from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.interaction_engine import interact_with_website
from services.signal_collector import collect_signals
from services.Log_categorizer import categorize_logs
from services.security_score import calculate_security_score
from services.risk_engine import calculate_risk_score
from services.anomaly_detector import detect_anomalies
from fastapi import UploadFile, File
from services.event_store import get_all_events
from services.log_parser import parse_log_file
from services.dashboard_summary import get_dashboard_summary
from services.event_store import add_event
from services.dashboard_metrics import get_dashboard_metrics

from services.authentication_event_collector import (
    create_authentication_event
)

from services.login_history import (
    add_login_event,
    get_total_logins,
    get_failed_logins,
    get_successful_logins,
    get_unique_ips
)

from services.event_store import (
    add_event,
    get_all_events,
    total_events
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():

    return {

        "message": "Log Analyzer Dashboard API"

    }

@app.get("/dashboard")
def dashboard():

    return get_dashboard_summary()


@app.get("/scan")
def scan(url: str):

    # Step 1
    raw_data = interact_with_website(url)

    # Step 2
    signals = collect_signals(raw_data)

    # Step 3
    authentication_event = create_authentication_event(signals)
    add_event(authentication_event)

    # Step 4
    add_login_event(authentication_event)

    # Step 5
    categorized_logs = categorize_logs(signals)

    # Step 6
    security_score = calculate_security_score(signals)

    statistics = {
        "total_logins": get_total_logins(),
        "successful_logins": get_successful_logins(),
        "failed_logins": get_failed_logins(),
        "unique_ips": get_unique_ips()
    }
    risk = calculate_risk_score(
        signals,
        statistics
    )

    anomalies = detect_anomalies(
        statistics,
        authentication_event
    )

    dashboard_metrics = get_dashboard_metrics(
        get_all_events(),
        statistics,
        risk,
        anomalies
    )


    return {

        "security_score": security_score,

        "anomalies": anomalies,

        "dashboard_metrics": dashboard_metrics,

        "risk": risk,

        "results": categorized_logs,

        "authentication_event": authentication_event,
        
        "event_store": {
            "total_events": total_events(),
            "latest_event": authentication_event
        },
        

        "statistics": {

            "total_logins":
                get_total_logins(),

            "successful_logins":
                get_successful_logins(),

            "failed_logins":
                get_failed_logins(),

            "unique_ips":
                get_unique_ips()
        }

        
    }

@app.get("/events")
def get_events():

    return {

        "events": get_all_events()

    }

@app.post("/upload-log")
async def upload_log(file: UploadFile = File(...)):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as f:

        f.write(await file.read())

    events = parse_log_file(file_path)

    for event in events:

        add_event(event)

    return {

        "message": "Log uploaded successfully.",

        "events_imported": len(events)

    }