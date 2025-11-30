# app/routes/bookings.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_bookings():
    return {"message": "Bookings endpoint - coming soon"}
