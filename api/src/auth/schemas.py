from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerifyRequest(BaseModel):
    token: str


class VerifyEmailRequest(BaseModel):
    token: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str = "user"
    email_verified: bool = False
    onboarding_completed: bool = False


class AuthResponse(BaseModel):
    user: UserResponse


class SignupResponse(BaseModel):
    ok: bool = True
    email: EmailStr
    message: str = "Check your email to verify your account."
