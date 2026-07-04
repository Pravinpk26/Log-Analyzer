"""
main.py — FastAPI Backend Entry Point
======================================
All endpoints. Auth-protected routes require a valid JWT Bearer token.

Endpoints:
  POST /login       → Admin login, returns JWT
  GET  /verify      → Check if JWT is still valid
  GET  /scan        → Full Playwright scan + AI insights (protected)
  GET  /ai-insights → AI insights from last stored scan (protected, no re-scan)
  GET  /events      → All stored authentication events (protected)
  GET  /dashboard   → Dashboard summary (protected)
  POST /upload-log  → Upload JSON/CSV log file (protected)
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from services.auth                           import login as auth_login, verify_token
from services.ai_insights                    import generate_ai_insights
from services.interaction_engine             import interact_with_website
from services.signal_collector               import collect_signals
from services.Log_categorizer                import categorize_logs
from services.security_score                 import calculate_security_score
from services.risk_engine                    import calculate_risk_score
from services.anomaly_detector               import detect_anomalies
from services.log_parser                     import parse_log_file
from services.dashboard_summary              import get_dashboard_summary
from services.dashboard_metrics              import get_dashboard_metrics
from services.authentication_event_collector import create_authentication_event

from services.login_history import (
    add_login_event, get_total_logins,
    get_failed_logins, get_successful_logins, get_unique_ips,
)
from services.event_store import (
    add_event, get_all_events, get_latest_event, total_events,
)

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="Log Analyzer Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth dependency ────────────────────────────────────────────────────────────
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return payload

# ── Request model ──────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

# ── Auth endpoints ─────────────────────────────────────────────────────────────
@app.post("/login")
def login(req: LoginRequest):
    """Login with username and password. Returns JWT token."""
    result = auth_login(req.username, req.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    return result

@app.get("/verify")
def verify(user=Depends(get_current_user)):
    """Verify the current JWT token is valid."""
    return {"valid": True, "username": user["sub"], "name": user["name"], "role": user["role"]}

# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/")
def home():
    return {"message": "Log Analyzer Dashboard API"}

# ── Dashboard ──────────────────────────────────────────────────────────────────
@app.get("/dashboard")
def dashboard(user=Depends(get_current_user)):
    return get_dashboard_summary()

# ── Full scan ──────────────────────────────────────────────────────────────────
@app.get("/scan")
def scan(url: str, user=Depends(get_current_user)):
    """
    Full pipeline: Playwright visits URL → signals collected →
    logs categorized → scores calculated → anomalies detected →
    Gemini AI generates insights → everything returned to dashboard.
    """
    raw_data             = interact_with_website(url)
    signals              = collect_signals(raw_data)
    authentication_event = create_authentication_event(signals)
    add_event(authentication_event)
    add_login_event(authentication_event)
    categorized_logs     = categorize_logs(signals)
    security_score       = calculate_security_score(signals)

    statistics = {
        "total_logins":      get_total_logins(),
        "successful_logins": get_successful_logins(),
        "failed_logins":     get_failed_logins(),
        "unique_ips":        get_unique_ips(),
    }

    risk              = calculate_risk_score(signals, statistics)
    anomalies         = detect_anomalies(statistics, authentication_event)
    dashboard_metrics = get_dashboard_metrics(get_all_events(), statistics, risk, anomalies)
    ai_result         = generate_ai_insights(signals=signals, anomalies=anomalies, risk=risk, statistics=statistics)

    return {
        "security_score":       security_score,
        "risk":                 risk,
        "anomalies":            anomalies,
        "dashboard_metrics":    dashboard_metrics,
        "results":              categorized_logs,
        "authentication_event": authentication_event,
        "statistics":           statistics,
        "ai_insights":          ai_result,
        "event_store": {
            "total_events": total_events(),
            "latest_event": authentication_event,
        },
    }

# ── AI insights (no re-scan) ───────────────────────────────────────────────────
@app.get("/ai-insights")
def ai_insights(url: str, user=Depends(get_current_user)):
    """Returns AI insights from the last stored scan. No second Playwright launch."""
    latest = get_latest_event()
    if not latest:
        return {"ai_insights": {"source": "rule-based", "insights": []}}

    statistics = {
        "total_logins":      get_total_logins(),
        "successful_logins": get_successful_logins(),
        "failed_logins":     get_failed_logins(),
        "unique_ips":        get_unique_ips(),
    }
    signals = {
        "security_signals":       {"https_enabled": url.startswith("https"), "hsts_header_present": False, "csp_header_present": False, "secure_cookies": False, "captcha_detected": False},
        "authentication_signals": {"login_form_detected": False, "mfa_indicator": False, "oauth_providers": [], "remember_me_present": False, "form_method": None},
        "network_signals":        {"status_code": 200, "response_time_ms": latest.get("response_time", 0), "tls_version": "Unknown", "protocol": "HTTPS" if url.startswith("https") else "HTTP"},
        "geo_information":        latest.get("geo", {}),
    }
    risk      = calculate_risk_score(signals, statistics)
    anomalies = detect_anomalies(statistics, latest)
    ai_result = generate_ai_insights(signals=signals, anomalies=anomalies, risk=risk, statistics=statistics)
    return {"ai_insights": ai_result}

# ── Events ─────────────────────────────────────────────────────────────────────
@app.get("/events")
def get_events(user=Depends(get_current_user)):
    return {"events": get_all_events()}

# ── Upload ─────────────────────────────────────────────────────────────────────
@app.post("/upload-log")
async def upload_log(file: UploadFile = File(...), user=Depends(get_current_user)):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    events = parse_log_file(file_path)
    for event in events:
        add_event(event)
    return {"message": "Log uploaded successfully.", "events_imported": len(events)}
