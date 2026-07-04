"""
event_store.py — In-Memory Authentication Event Store
=======================================================
Stores all events collected during Playwright scans and log uploads.
get_latest_event() is used by /ai-insights to avoid re-scanning.
"""

from copy import deepcopy

authentication_events = []

def add_event(event: dict) -> None:
    authentication_events.append(deepcopy(event))

def get_all_events() -> list:
    return deepcopy(authentication_events)

def get_latest_event() -> dict | None:
    """Returns the most recently stored event. Used by /ai-insights."""
    return deepcopy(authentication_events[-1]) if authentication_events else None

def total_events() -> int:
    return len(authentication_events)

def clear_events() -> None:
    authentication_events.clear()
