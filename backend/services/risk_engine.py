def calculate_risk_score(signals, statistics):

    risk_score = 0

    # --------------------------
    # SECURITY CHECKS
    # --------------------------

    if signals["security_signals"]["https_enabled"]:
        risk_score += 20

    if signals["security_signals"]["hsts_header_present"]:
        risk_score += 15

    if signals["security_signals"]["csp_header_present"]:
        risk_score += 15

    if signals["security_signals"]["secure_cookies"]:
        risk_score += 15

    if signals["authentication_signals"]["mfa_indicator"]:
        risk_score += 10

    # --------------------------
    # LOGIN ACTIVITY
    # --------------------------

    if statistics["failed_logins"] >= 3:
        risk_score -= 20

    if statistics["failed_logins"] >= 5:
        risk_score -= 30

    if statistics["unique_ips"] > 3:
        risk_score -= 15

    if statistics["successful_logins"] == 0:
        risk_score -= 20

    # --------------------------
    # LIMIT SCORE
    # --------------------------

    risk_score = max(0, min(risk_score, 100))

    # --------------------------
    # RISK LEVEL
    # --------------------------

    if risk_score >= 80:
        risk_level = "Low"

    elif risk_score >= 50:
        risk_level = "Medium"

    else:
        risk_level = "High"

    return {

        "risk_score": risk_score,

        "risk_level": risk_level

    }