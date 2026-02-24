from fastapi import FastAPI
from app.database.mongodb import init_db
from app.models.user_model import User
from app.models.visit_model import Visit
# Routers
from app.routes.auth_routes import router as auth_router
from app.routes.visit_routes import router as visit_router
from app.routes.admin_routes import router as admin_router
# Rate Limiting
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from app.core.rate_limiter import limiter 

# Static Files
from fastapi.staticfiles import StaticFiles
import os
# CORS
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


# database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db([User, Visit])
    yield




# App Initialization
app = FastAPI(
    title="Store Visit Management API",
    version="1.0.0",
    lifespan=lifespan
)

# # Rate Limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

from fastapi.responses import JSONResponse

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."},
    )




app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    

# Routes
app.include_router(auth_router)
app.include_router(visit_router)
app.include_router(admin_router)


    
    #  # TEST INSERT (Temporary)
    # existing = await User.find_one(User.email == "test@test.com")
    # if not existing:
    #     await User(
    #         name="Test User",
    #         email="test@test.com",
    #         password="123456",
    #         role="visitor"
    #     ).insert()


@app.get("/", tags=["Root"])
async def root():
    
    return {"message": "Store Visit API is running 🚀"}
    
