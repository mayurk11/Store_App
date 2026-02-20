from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.core.roles import require_role
from app.models.user_model import User
from app.services.visit_service import get_all_visits, review_visit
from app.schemas.visit_schema import VisitStatus

from app.core.security import get_current_admin


router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/visits")
async def list_visits(current_user = Depends(get_current_user)):
    require_role(current_user, "admin")

    visits = await get_all_visits()

    return [
        {
            "visit_id": str(v.id),
            "visitor_id": v.visitor_id,
            "status": v.status,
            "image_path": v.image_path,
        }
        for v in visits
    ]

@router.put("/visits/{visit_id}")
async def update_visit(
    visit_id: str,
    status: VisitStatus,
    current_user = Depends(get_current_user)
):
    require_role(current_user, "admin")

    try:
        visit = await review_visit(visit_id, str(current_user.id), status)
        print(f"Visit reviewed by Email : {current_user.email} with status : {status}" )
        return {
            "message": "Visit reviewed successfully",
            "visit_id": str(visit.id),
            "status": visit.status
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users")
async def get_all_users(current_user: User = Depends(get_current_admin)):
    users = await User.find_all().to_list()

    return [
        {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at,
        }
        for user in users
    ]
