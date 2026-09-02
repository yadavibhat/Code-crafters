from pydantic import BaseModel, EmailStr, Field

class OTPRequest(BaseModel):
    email: str = Field(..., example="aditya.rao@nmit.ac.in")

class OTPVerify(BaseModel):
    email: str = Field(..., example="aditya.rao@nmit.ac.in")
    otp: str = Field(..., example="123456")

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str | None = None
    student_id: str | None = None
    onboarding_completed: bool = False
