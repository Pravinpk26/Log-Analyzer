from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from datetime import datetime
import time


def interact_with_website(url):

    start = time.time()

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=False
        )

        context = browser.new_context()

        page = context.new_page()

        print("\nOpening Login Page...\n")

        response = page.goto(
            url,
            wait_until="networkidle"
        )

        print("=" * 60)
        print("Waiting for login to complete...")
        print("=" * 60)
        original_url = url
        for _ in range(120):   # Wait up to 120 seconds
            page.wait_for_timeout(1000)
            if page.url != original_url:
                print("Login detected!")
                break

        response_time = round(
            (time.time() - start) * 1000
        )

        html = page.content()

        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        page_title = page.title()

        login_timestamp = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        browser_name = browser.browser_type.name

        current_url = page.url

        cookie_list = context.cookies()

        session_cookie_count = len(cookie_list)

        login_success = (
            current_url != url
        )

        cookies = {}

        for cookie in cookie_list:

            cookies[cookie["name"]] = cookie["value"]

        result = {

            "url": url,

            "current_url": current_url,

            "page_title": page_title,

            "login_timestamp": login_timestamp,

            "browser": browser_name,

            "session_cookie_count": session_cookie_count,

            "login_success": login_success,

            "status_code":
                response.status if response else None,

            "headers":
                dict(response.headers) if response else {},

            "cookies":
                cookies,

            "response_time":
                response_time,

            "redirects":
                [],

            "html":
                html,

            "soup":
                soup
        }

        browser.close()

        return result