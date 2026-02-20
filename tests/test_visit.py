import pytest

@pytest.mark.asyncio
async def test_upload_requires_auth(async_client):
    response = await async_client.post("/visits/upload")
    assert response.status_code == 403 or response.status_code == 401
