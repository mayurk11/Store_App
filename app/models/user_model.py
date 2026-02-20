from beanie import Document
from pydantic import EmailStr
from typing import Optional
from datetime import datetime ,UTC

class User(Document):
    name: str
    email: EmailStr
    password: str
    role: str
    is_active: bool = True
    created_at: datetime = datetime.now(UTC)

    class Settings:
        name = "users"
