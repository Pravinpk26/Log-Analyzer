import os
import json
import requests


GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
def generate_ai_insights(signals: dict, anomalies: list, risk: dict, statistics: dict) -> dict:
    """
    Calls the Google Gemini API to generate AI insights and actionable
    recommendations based on the collected signals, anomalies, and risk data.
    Returns a dict with a list of insight/recommendation pairs.
    """

    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")

    if not gemini_api_key:
        return _fallback_insights(anomalies, risk, signals)

    # -----------------------------------------------
    # Build a compact, structured prompt for Gemini
    # -----------------------------------------------

    security = signals.get("security_signals", {})
    auth = signals.get("authentication_signals", {})
    network = signals.get("network_signals", {})
    geo = signals.get("geo_information", {})

    context = {
        "security": {
            "https_enabled": security.get("https_enabled"),
            "hsts_present": security.get("hsts_header_present"),
            "csp_present": security.get("csp_header_present"),
            "secure_cookies": security.get("secure_cookies"),
            "captcha_detected": security.get("captcha_detected"),
        },
        "authentication": {
            "login_form_detected": auth.get("login_form_detected"),
            "mfa_enabled": auth.get("mfa_indicator"),
            "oauth_providers": auth.get("oauth_providers", []),
            "remember_me_present": auth.get("remember_me_present"),
            "form_method": auth.get("form_method"),
        },
        "network": {
            "status_code": network.get("status_code"),
            "response_time_ms": network.get("response_time_ms"),
            "tls_version": network.get("tls_version"),
            "protocol": network.get("protocol"),
        },
        "geo": {
            "country": geo.get("country"),
            "city": geo.get("city"),
            "isp": geo.get("isp"),
        },
        "risk": {
            "score": risk.get("risk_score"),
            "level": risk.get("risk_level"),
        },
        "statistics": {
            "total_logins": statistics.get("total_logins"),
            "failed_logins": statistics.get("failed_logins"),
            "successful_logins": statistics.get("successful_logins"),
            "unique_ips": statistics.get("unique_ips"),
        },
        "anomalies": [
            {"type": a.get("type"), "severity": a.get("severity"), "message": a.get("message")}
            for a in anomalies
        ],
    }

    system_prompt = (
        "You are a cybersecurity AI analyst embedded in a Log Analyzer Dashboard. "
        "Your job is to analyse scan data and produce concise, actionable security "
        "insights and recommendations for the security team. "
        "You must respond ONLY with a valid JSON object — no markdown, no preamble, "
        "no code fences. "
        "The JSON must have exactly this shape:\n"
        '{"insights": [{"insight": "...", "recommendation": "...", "severity": "High|Medium|Low|Info"}]}\n'
        "Produce 3 to 5 insight/recommendation pairs. "
        "Each insight must be 1–2 sentences describing what was detected. "
        "Each recommendation must be 1–2 sentences of concrete, specific action to take. "
        "severity must be one of: High, Medium, Low, Info. "
        "Prioritise the most critical findings first."
    )

    user_prompt = (
        "Analyse the following log analyzer scan data and produce security insights:\n\n"
        + json.dumps(context, indent=2)
    )

    url = GEMINI_API_URL.format(model=gemini_model)

    try:
        response = requests.post(
            url,
            params={"key": gemini_api_key},
            headers={"content-type": "application/json"},
            json={
                "system_instruction": {
                    "parts": [{"text": system_prompt}]
                },
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": user_prompt}],
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 1024,
                    "responseMimeType": "application/json",
                },
            },
            timeout=30,
        )

        response.raise_for_status()
        data = response.json()

        # Extract text from Gemini's response shape
        raw_text = ""
        candidates = data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            for part in parts:
                raw_text += part.get("text", "")

        # Strip any accidental markdown code fences (Gemini sometimes adds them
        # even with responseMimeType set)
        raw_text = raw_text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip().rstrip("```").strip()

        parsed = json.loads(raw_text)

        return {
            "source": "gemini-ai",
            "insights": parsed.get("insights", []),
        }

    except Exception as exc:
        # Degrade gracefully — use rule-based fallback
        print(f"[ai_insights] Gemini API error: {exc}")
        return _fallback_insights(anomalies, risk, signals)


# -----------------------------------------------
# Rule-based fallback (no API key / API failure)
# -----------------------------------------------

def _fallback_insights(anomalies: list, risk: dict, signals: dict) -> dict:
    """
    Generates deterministic insights from signals when the AI API
    is unavailable. Mirrors the logic of the anomaly detector and
    risk engine to produce human-readable output.
    """

    insights = []
    security = signals.get("security_signals", {})
    auth = signals.get("authentication_signals", {})
    network = signals.get("network_signals", {})

    # -- HSTS
    if not security.get("hsts_header_present"):
        insights.append({
            "insight": "The Strict-Transport-Security (HSTS) header is missing, leaving users vulnerable to protocol downgrade attacks.",
            "recommendation": "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' to all HTTPS responses.",
            "severity": "High",
        })

    # -- CSP
    if not security.get("csp_header_present"):
        insights.append({
            "insight": "No Content Security Policy header was detected, which increases risk of cross-site scripting (XSS) attacks.",
            "recommendation": "Define and deploy a Content-Security-Policy header. Start with a strict policy and whitelist required sources.",
            "severity": "Medium",
        })

    # -- MFA
    if not auth.get("mfa_indicator"):
        insights.append({
            "insight": "No multi-factor authentication indicator was detected on the login page.",
            "recommendation": "Enforce MFA for all user accounts, especially admin roles, using TOTP or WebAuthn.",
            "severity": "High",
        })

    # -- Secure cookies
    if not security.get("secure_cookies"):
        insights.append({
            "insight": "Session cookies appear to be missing the Secure flag, allowing transmission over unencrypted connections.",
            "recommendation": "Set the Secure and HttpOnly flags on all session cookies and use the SameSite=Strict attribute.",
            "severity": "Medium",
        })

    # -- Brute force anomaly
    brute_force = any(a.get("type") == "Brute Force Attack" for a in anomalies)
    if brute_force:
        insights.append({
            "insight": "Multiple failed login attempts have been detected, indicating a possible brute-force attack in progress.",
            "recommendation": "Implement account lockout after 5 failed attempts and consider adding IP-based rate limiting on the login endpoint.",
            "severity": "High",
        })

    # -- Slow response
    response_time = network.get("response_time_ms", 0)
    if response_time and response_time > 3000:
        insights.append({
            "insight": f"Authentication response time is elevated at {response_time}ms, which may indicate server-side performance issues or active load.",
            "recommendation": "Investigate server load and database query performance on the authentication endpoint. Consider CDN or caching strategies.",
            "severity": "Low",
        })

    # -- Overall risk
    risk_level = risk.get("risk_level", "Unknown")
    risk_score = risk.get("risk_score", 0)
    if risk_level == "High":
        insights.insert(0, {
            "insight": f"Overall risk score is {risk_score}/100 (High). Multiple critical security controls are missing or misconfigured.",
            "recommendation": "Prioritise remediation of High-severity findings immediately. Schedule a full security audit.",
            "severity": "High",
        })

    # Ensure we always return at least one insight
    if not insights:
        insights.append({
            "insight": "No critical issues detected. The site demonstrates a reasonable baseline security posture.",
            "recommendation": "Continue monitoring for anomalies and consider a penetration test to validate controls.",
            "severity": "Info",
        })

    return {
        "source": "rule-based",
        "insights": insights[:5],  # cap at 5
    }
