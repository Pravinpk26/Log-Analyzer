"""
auth.py — Admin Authentication Service
=======================================
Handles login and JWT token management.

Default credentials (change via environment variables):
  Username: admin
  Password: admin123

To set a custom password hash, run:
  python -c "import bcrypt; print(bcrypt.hashpw(b'yourpassword', bcrypt.gensalt()).decode())"
Then set ADMIN_PASSWORD_HASH environment variable to the output.

Environment variables:
  ADMIN_USERNAME      — default: admin
  ADMIN_PASSWORD_HASH — bcrypt hash of the password
  ADMIN_DISPLAY_NAME  — shown in the dashboard header
  ADMIN_ROLE          — shown under the name in header
  JWT_SECRET          — secret key for signing tokens (change in production)
"""

import os
import bcrypt
import jwt
from datetime import datetime, timedelta

# ── Config ─────────────────────────────────────────────────────────────────────
JWT_SECRET      = os.getenv("JWT_SECRET", "log-analyzer-secret-change-in-production")
JWT_ALGORITHM   = "HS256"
JWT_EXPIRY_HOURS = 8

ADMIN_USERNAME     = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_DISPLAY_NAME = os.getenv("ADMIN_DISPLAY_NAME", "SOC Analyst")
ADMIN_ROLE         = os.getenv("ADMIN_ROLE", "Administrator")

# Default hash for "admin123" — override with ADMIN_PASSWORD_HASH env var
ADMIN_PASSWORD_HASH = os.getenv(
    "ADMIN_PASSWORD_HASH",
    "$2b$12$cjIWeWHXmaN0Na53b4q8NeAQI1fBP9YEpeK72g.oP2mf51wEJCUea"
)


def verify_password(plain: str, hashed: str) -> bool:
    """Check a plain password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def create_token(username: str) -> str:
    """Create a signed JWT token valid for JWT_EXPIRY_HOURS hours."""
    payload = {
        "sub":  username,
        "name": ADMIN_DISPLAY_NAME,
        "role": ADMIN_ROLE,
        "iat":  datetime.utcnow(),
        "exp":  datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict | None:
    """Decode and verify a JWT token. Returns payload or None if invalid."""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        return None


def login(username: str, password: str) -> dict | None:
    """
    Validate credentials. Returns token dict on success, None on failure.
    """
    if username != ADMIN_USERNAME:
        return None
    if not verify_password(password, ADMIN_PASSWORD_HASH):
        return None
    return {
        "access_token": create_token(username),
        "token_type":   "bearer",
        "name":         ADMIN_DISPLAY_NAME,
        "role":         ADMIN_ROLE,
        "username":     username,
    }
