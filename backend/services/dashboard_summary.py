from services.event_store import get_all_events


def get_dashboard_summary():

    events = get_all_events()

    total_events = len(events)

    successful_logins = sum(
        1
        for event in events
        if event.get("status", "").lower() == "success"
    )

    failed_logins = sum(
        1
        for event in events
        if event.get("status", "").lower() == "failed"
    )

    unique_ips = len(
        set(
            event.get("ip_address")
            for event in events
            if event.get("ip_address")
        )
    )

    browsers = {}

    for event in events:

        browser = event.get("browser", "Unknown")

        browsers[browser] = browsers.get(browser, 0) + 1

    most_used_browser = (
        max(browsers, key=browsers.get)
        if browsers
        else "Unknown"
    )

    if total_events == 0:

        risk_score = 0

    else:

        risk_score = max(
            0,
            100 - (failed_logins * 20)
        )

    return {

        "risk_score": risk_score,

        "total_events": total_events,

        "successful_logins": successful_logins,

        "failed_logins": failed_logins,

        "unique_ips": unique_ips,

        "most_used_browser": most_used_browser,

        "events": events

    }