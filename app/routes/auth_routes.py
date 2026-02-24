from fastapi import APIRouter, HTTPException, Depends, Request, Body
from app.schemas.user_schema import RegisterRequest, UserResponse
from app.schemas.user_schema import LoginRequest, TokenResponse
from app.services.auth_service import register_user, login_user, refresh_access_token
from app.core.security import get_current_user
from fastapi import APIRouter, Request
from app.core.rate_limiter import limiter


router = APIRouter(prefix="/auth", tags=["Authentication"])


# 🔐 Register (limit brute-force account creation)
@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")
async def register(request: Request, data: RegisterRequest):
    try:
        user = await register_user(data)
        return UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# 🔐 Login (limit brute-force login attempts)
@router.post("/login", response_model=TokenResponse)
@limiter.limit("4/minute")
async def login(request: Request, data: LoginRequest):
    try:
        return await login_user(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# 👤 Get current user (optional rate limit)
@router.get("/me")
@limiter.limit("20/minute")
async def get_me(request: Request, current_user=Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


# 🔄 Refresh token (protect against abuse)
from pydantic import BaseModel

class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh")
@limiter.limit("10/minute")
async def refresh_token(request: Request, data: RefreshRequest):
    try:
        return await refresh_access_token(data.refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

