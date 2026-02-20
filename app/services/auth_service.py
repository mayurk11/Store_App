from app.models.user_model import User
from app.core.security import verify_password, create_access_token, create_refresh_token,hash_password
from jose import JWTError, jwt
from app.config import settings


async def register_user(data):
    # Check if user already exists
    existing_user = await User.find_one({"email": data.email})
    if existing_user:
        raise ValueError("Email already registered")

    # Hash password
    hashed_pw = hash_password(data.password)

    # Create user
    user = User(
        name=data.name,
        email=data.email,
        password=hashed_pw,
        role="visitor"  # default role
    )

    await user.insert()
    print(f"User {user.email} registered successfully")
    return user


async def login_user(email: str, password: str):
    user = await User.find_one({"email": email})

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.password):
        raise ValueError("Invalid email or password")

    access_token = create_access_token(
        {"user_id": str(user.id), "role": user.role ,"name": user.name}
    )

    refresh_token = create_refresh_token(
        {"user_id": str(user.id)}
    )
    
    
    print(f"User {user.email} logged in successfully")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    
async def refresh_access_token(refresh_token: str):
    try:
        payload = jwt.decode(
            refresh_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload.get("user_id")

        if user_id is None:
            raise ValueError("Invalid refresh token")

    except JWTError:
        raise ValueError("Refresh token expired or invalid")

    user = await User.get(user_id)

    if not user:
        raise ValueError("User not found")

    new_access_token = create_access_token(
        {"user_id": str(user.id), "role": user.role}
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }