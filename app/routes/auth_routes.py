from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import RegisterRequest, UserResponse
from app.services.auth_service import register_user

from app.schemas.user_schema import LoginRequest, TokenResponse
from app.services.auth_service import login_user

from app.core.security import get_current_user
from fastapi import Depends

from app.core.rate_limiter import limiter
from fastapi import Request

from fastapi import Body
from app.services.auth_service import refresh_access_token


router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register(data: RegisterRequest):
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



@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, data: LoginRequest):
    try:
        return await login_user(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@router.post("/refresh")
async def refresh_token(refresh_token: str = Body(...)):
    try:
        return await refresh_access_token(refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
