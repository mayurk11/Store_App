import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.main import app
from app.models.user_model import User
from app.models.visit_model import Visit
from app.config import settings


@pytest_asyncio.fixture
async def async_client():
    # 🔹 Manually initialize test database
    client = AsyncIOMotorClient(settings.MONGO_URL)
    test_db = client["test_store_visit_db"]

    await init_beanie(
        database=test_db,
        document_models=[User, Visit],
    )

    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test"
    ) as client:
        yield client

    # 🔹 Clean up after test
    await test_db.drop_collection("users")
    await test_db.drop_collection("visits")
