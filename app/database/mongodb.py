from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)

async def init_db(models):
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=models
    )
    print("Database initialized successfully")
    
