import os
import json
import base64
import hmac
import hashlib
import time
from passlib.hash import pbkdf2_sha256
from fastapi import Request

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-to-random-64-char-hex").encode()
SESSION_EXPIRY_HOURS = int(os.getenv("SESSION_EXPIRY_HOURS", 24))

def hash_password(password: str) -> str:
    return pbkdf2_sha256.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pbkdf2_sha256.verify(plain, hashed)
    except ValueError:
        return False

def create_session_token(user_id: int, username: str, role: str) -> str:
    exp = int(time.time()) + (SESSION_EXPIRY_HOURS * 3600)
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": exp
    }
    payload_json = json.dumps(payload).encode()
    payload_b64 = base64.urlsafe_b64encode(payload_json).decode().rstrip("=")
    
    signature = hmac.new(SECRET_KEY, payload_b64.encode(), hashlib.sha256).digest()
    signature_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{payload_b64}.{signature_b64}"

def verify_session_token(token: str) -> dict | None:
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        
        payload_b64, signature_b64 = parts
        
        # Verify signature
        expected_sig = hmac.new(SECRET_KEY, payload_b64.encode(), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")
        
        if not hmac.compare_digest(signature_b64, expected_sig_b64):
            return None
        
        # Pad and decode payload
        payload_padded = payload_b64 + "=" * (-len(payload_b64) % 4)
        payload_json = base64.urlsafe_b64decode(payload_padded).decode()
        payload = json.loads(payload_json)
        
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None

def get_current_user(request: Request) -> dict | None:
    token = request.cookies.get("negarit_session")
    if not token:
        return None
    return verify_session_token(token)
