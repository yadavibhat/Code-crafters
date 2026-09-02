from fastapi import APIRouter, HTTPException, Header
from app.core.config import settings
from app.models.auth import OTPRequest, OTPVerify, AuthResponse
from app.services.auth_service import is_valid_institutional_email, generate_otp, verify_otp_and_login, get_student_id_from_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login", response_model=AuthResponse)
def request_otp(payload: OTPRequest):
    if not is_valid_institutional_email(payload.email):
        raise HTTPException(
            status_code=400,
            detail=f"Only institutional emails from allowed domain (@{settings.ALLOWED_EMAIL_DOMAIN} or @nmit.ac.in) are permitted."
        )
    otp = generate_otp(payload.email)
    return AuthResponse(
        success=True,
        message=f"OTP sent to {payload.email}. Use 123456 for hackathon testing."
    )

@router.post("/verify", response_model=AuthResponse)
def verify_otp(payload: OTPVerify):
    res = verify_otp_and_login(payload.email, payload.otp)
    if not res:
        raise HTTPException(status_code=401, detail="Invalid OTP code.")
    return AuthResponse(
        success=True,
        message="Authentication successful.",
        token=res["token"],
        student_id=res["student_id"],
        onboarding_completed=res["onboarding_completed"]
    )

@router.get("/me")
def check_session(authorization: str = Header(None)):
    token = authorization.replace("Bearer ", "") if authorization else ""
    student_id = get_student_id_from_token(token)
    if not student_id:
        raise HTTPException(status_code=401, detail="Invalid session token.")
    return {"student_id": student_id, "authenticated": True}
