"""
interaction_engine.py — Playwright Browser Automation
=======================================================
Launches ONE real Chromium browser per scan.
Waits up to 60 seconds for the user to log in if needed.
Safely captures HTML even if the page is still navigating.

Note: Google OAuth and GitHub OAuth block Playwright logins by design.
Scan the LOGIN PAGE URL directly (e.g. https://github.com/login)
to analyze its security — actual login is not required.
"""

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from datetime import datetime
import time


def interact_with_website(url: str) -> dict:
    """
    Visit a URL with Playwright, wait for login (up to 60s), capture all data.

    Args:
        url: Website URL to scan

    Returns:
        Dict with url, html, soup, headers, cookies, status_code,
        response_time, page_title, browser, current_url,
        login_success, session_cookie_count, login_timestamp, redirects.
    """
    start = time.time()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page    = context.new_page()

        print("\n" + "=" * 60)
        print(f"Scanning: {url}")
        print("Browser open — you have 60 seconds to log in if needed.")
        print("=" * 60 + "\n")

        response     = page.goto(url, wait_until="networkidle")
        original_url = page.url

        # Wait up to 60s, stop early if URL changes (login detected)
        for _ in range(60):
            page.wait_for_timeout(1000)
            if page.url != original_url:
                print("Login redirect detected — waiting 30 more seconds for manual login...")
                page.wait_for_timeout(30000)  # extra 30 seconds after redirect
                break

        response_time = round((time.time() - start) * 1000)

        # Safe HTML capture — page may still be mid-navigation
        try:
            html = page.content()
        except Exception:
            html = "<html></html>"

        soup         = BeautifulSoup(html, "html.parser")
        page_title   = page.title() or "Unknown"
        current_url  = page.url
        cookie_list  = context.cookies()
        browser_name = browser.browser_type.name

        login_timestamp      = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        session_cookie_count = len(cookie_list)
        login_success        = current_url != url
        cookies              = {c["name"]: c["value"] for c in cookie_list}

        browser.close()

        return {
            "url":                  url,
            "current_url":          current_url,
            "page_title":           page_title,
            "login_timestamp":      login_timestamp,
            "browser":              browser_name,
            "session_cookie_count": session_cookie_count,
            "login_success":        login_success,
            "status_code":          response.status if response else None,
            "headers":              dict(response.headers) if response else {},
            "cookies":              cookies,
            "response_time":        response_time,
            "redirects":            [],
            "html":                 html,
            "soup":                 soup,
        }
