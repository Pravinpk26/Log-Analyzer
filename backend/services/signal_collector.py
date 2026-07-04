"""
signal_collector.py — Signal Extraction
=========================================
Extracts network, security, session, and authentication signals
from raw Playwright page data.

GEO: Geolocates YOUR machine's public IP (not the server's IP)
so the map shows Tamil Nadu (where you are scanning from).
"""

import socket
import requests as http_requests
from services.geo_service import GeoService


def _get_my_public_ip() -> str:
    """Get the public IP of the machine running the backend (your location)."""
    try:
        res = http_requests.get("https://api.ipify.org?format=json", timeout=5)
        return res.json().get("ip", "Unknown")
    except Exception:
        return "Unknown"


def collect_signals(data: dict) -> dict:
    headers    = data["headers"]
    cookies    = data["cookies"]
    soup       = data["soup"]
    html       = data["html"]
    html_lower = html.lower()
    headers_lower = {k.lower(): v for k, v in headers.items()}

    # ── Network ───────────────────────────────────────────────────────────────
    hostname = data["url"].split("//")[-1].split("/")[0]
    try:
        server_ip = socket.gethostbyname(hostname)
    except Exception:
        server_ip = "Unknown"

    network_signals = {
        "status_code":      data["status_code"],
        "response_time_ms": data["response_time"],
        "server_header":    headers.get("Server") or headers.get("server"),
        "redirect_chain":   data["redirects"],
        "tls_version":      headers_lower.get("x-tls-version", "Unknown"),
        "ip_address":       server_ip,
        "dns_information":  hostname,
        "content_length":   headers_lower.get("content-length", "Unknown"),
        "protocol":         "HTTPS" if data["url"].startswith("https") else "HTTP",
    }

    # ── Geo — YOUR location, not the server's ─────────────────────────────────
    my_ip       = _get_my_public_ip()
    geo_information = GeoService.get_location(my_ip)

    # ── Security ──────────────────────────────────────────────────────────────
    security_signals = {
        "https_enabled":       data["url"].startswith("https"),
        "hsts_header_present": "strict-transport-security" in headers_lower,
        "csp_header_present":  "content-security-policy"   in headers_lower,
        "secure_cookies":      any("secure" in str(v).lower() for v in cookies.values()),
        "captcha_detected":    "captcha" in html_lower or "recaptcha" in html_lower,
    }

    # ── Session ───────────────────────────────────────────────────────────────
    session_signals = {
        "page_title":           data["page_title"] or "Unknown",
        "current_url":          data["current_url"],
        "browser":              data["browser"],
        "login_timestamp":      data["login_timestamp"],
        "session_cookie_count": data["session_cookie_count"],
        "login_success":        data["login_success"],
    }

    # ── Authentication ────────────────────────────────────────────────────────
    login_form_detected    = False
    password_field_present = False
    form_method            = None

    for form in soup.find_all("form"):
        if form.find("input", {"type": "password"}):
            login_form_detected    = True
            password_field_present = True
            form_method            = form.get("method", "GET").upper()
            break

    oauth_providers = []
    if "google"    in html_lower: oauth_providers.append("Google")
    if "github"    in html_lower: oauth_providers.append("GitHub")
    if "facebook"  in html_lower: oauth_providers.append("Facebook")
    if "microsoft" in html_lower: oauth_providers.append("Microsoft")

    mfa_keywords = ["otp", "2fa", "mfa", "two-factor", "verification code"]
    mfa_detected = any(kw in html_lower for kw in mfa_keywords)

    authentication_signals = {
        "login_form_detected":   login_form_detected,
        "password_field_present": password_field_present,
        "form_method":            form_method,
        "oauth_providers":        oauth_providers,
        "mfa_indicator":          mfa_detected,
        "remember_me_present":    "remember me" in html_lower,
    }

    return {
        "network_signals":        network_signals,
        "security_signals":       security_signals,
        "session_signals":        session_signals,
        "authentication_signals": authentication_signals,
        "geo_information":        geo_information,
    }
