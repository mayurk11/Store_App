import os
from datetime import datetime
from app.models.visit_model import Visit

UPLOAD_DIR = "uploads"

async def create_visit(visitor_id: str, file):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = f"{UPLOAD_DIR}/{datetime.utcnow().timestamp()}_{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    visit = Visit(
        visitor_id=visitor_id,
        image_path=file_path,
        status="pending"
    )

    await visit.insert()
    return visit

async def get_all_visits():
    return await Visit.find_all().to_list()

async def review_visit(visit_id: str, admin_id: str, status: str):
    visit = await Visit.get(visit_id)

    if not visit:
        raise ValueError("Visit not found")

    if status not in ["done", "rejected","Done","Rejected","DONE","REJECTED"]:
        raise ValueError("Invalid status")

    visit.status = status
    visit.reviewed_by = admin_id
    visit.updated_at = datetime.utcnow()

    await visit.save()
    return visit

async def get_visits_by_user(visitor_id: str):
    return await Visit.find(Visit.visitor_id == visitor_id).to_list()
