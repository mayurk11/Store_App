from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.core.security import get_current_user
from app.core.roles import require_role
from app.services.visit_service import create_visit

from app.core.rate_limiter import limiter
from fastapi import Request

from app.services.visit_service import get_visits_by_user


router = APIRouter(prefix="/visits", tags=["Visits"])

@router.post("/upload")
@limiter.limit("10/minute")
async def upload_visit(
    request: Request,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    # Only visitor allowed
    require_role(current_user, "visitor")

    visit = await create_visit(str(current_user.id), file)

    print(f"Images upload by Email : {current_user.email}")
    return {
        "message": "Visit uploaded successfully",
        "visit_id": str(visit.id),
        "status": visit.status
    }



@router.get("/my-visits")
async def get_my_visits(current_user = Depends(get_current_user)):
    require_role(current_user, "visitor")

    visits = await get_visits_by_user(str(current_user.id))
    print(f"Visit history accessed by Email : {current_user.email}")
    return [
        {
            "visit_id": str(v.id),
            "status": v.status,
            "image_path": v.image_path
        }
        for v in visits
    ]
