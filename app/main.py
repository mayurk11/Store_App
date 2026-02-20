from fastapi import FastAPI
from app.database.mongodb import init_db
from app.models.user_model import User
from app.models.visit_model import Visit
# Routers
from app.routes.auth_routes import router as auth_router
from app.routes.visit_routes import router as visit_router
from app.routes.admin_routes import router as admin_router
# Rate Limiting
from app.core.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi import Request
# Static Files
from fastapi.staticfiles import StaticFiles
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
# limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# CORS Middleware - Allowing frontend running on localhost:3000 to access the API

# origins = ["*"]  You can specify your frontend URL here, e.g. ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    print(f"Rate limit exceeded ")
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please slow down."}
    )

    

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
    
