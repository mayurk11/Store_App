from beanie import Document
from datetime import UTC, datetime
from typing import Optional

class Visit(Document):
    visitor_id: str
    image_path: str
    status: str = "pending"
    reviewed_by: Optional[str] = None
    created_at: datetime = datetime.now(UTC)
    updated_at: datetime = datetime.now(UTC)
    

    class Settings:
        name = "visits"