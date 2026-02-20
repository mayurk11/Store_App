import pytest

@pytest.mark.asyncio
async def test_register(async_client):
    response = await async_client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "testuser@test.com",
            "password": "123456"
        }
    )
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@test.com"


@pytest.mark.asyncio
async def test_login(async_client):
    # 🔹 First register user
    await async_client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "testuser@test.com",
            "password": "123456"
        }
    )

    # 🔹 Then login
    response = await async_client.post(
        "/auth/login",
        json={
            "email": "testuser@test.com",
            "password": "123456"
        }
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_protected_route(async_client):
    # 🔹 Register first
    await async_client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "testuser@test.com",
            "password": "123456"
        }
    )

    # 🔹 Login
    login = await async_client.post(
        "/auth/login",
        json={
            "email": "testuser@test.com",
            "password": "123456"
        }
    )

    token = login.json()["access_token"]

    response = await async_client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
