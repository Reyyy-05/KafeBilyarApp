# app/routes/admin.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def admin_dashboard():
    return {"message": "Admin endpoint - coming soon"}
