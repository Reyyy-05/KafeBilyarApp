# app/routes/auth.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.database import get_supabase_client
import bcrypt
from datetime import datetime, timedelta
import jwt
from app.config import settings

router = APIRouter()
supabase = get_supabase_client()

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Routes
@router.post("/register", response_model=TokenResponse)
async def register_user(user: UserRegister):
    """Register new customer"""
    try:
        # Check if user exists
        result = supabase.table("users").select("*").eq("email", user.email).execute()
        if result.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_pw = hash_password(user.password)
        
        # Insert user
        new_user = {
            "email": user.email,
            "password_hash": hashed_pw,
            "name": user.name,
            "phone": user.phone
        }
        
        result = supabase.table("users").insert(new_user).execute()
        user_data = result.data[0]
        
        # Create token
        access_token = create_access_token(
            data={"sub": user_data["id"], "type": "customer"},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "phone": user_data["phone"]
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login_user(credentials: UserLogin):
    """Customer login"""
    try:
        # Find user
        result = supabase.table("users").select("*").eq("email", credentials.email).execute()
        
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        access_token = create_access_token(
            data={"sub": user["id"], "type": "customer"},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "phone": user["phone"],
                "total_bookings": user["total_bookings"],
                "total_hours_played": user["total_hours_played"],
                "rating": float(user["rating"])
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/login", response_model=TokenResponse)
async def login_admin(credentials: AdminLogin):
    """Admin login"""
    try:
        # Find admin
        result = supabase.table("admins").select("*").eq("username", credentials.username).execute()
        
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        admin = result.data[0]
        
        # Check if active
        if not admin["is_active"]:
            raise HTTPException(status_code=403, detail="Admin account is inactive")
        
        # Verify password
        if not verify_password(credentials.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        access_token = create_access_token(
            data={"sub": admin["id"], "type": "admin", "role": admin["role"]},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": admin["id"],
                "username": admin["username"],
                "name": admin["name"],
                "email": admin["email"],
                "role": admin["role"]
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
