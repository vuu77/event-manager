# --- FILE: backend/schemas.py ---
# QUAN TRỌNG: Phải có 3 dòng import này đầu tiên mới chạy được!
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ==========================================
# 1. USER SCHEMAS (Cho Đăng ký/Đăng nhập)
# ==========================================
class UserBase(BaseModel):
    email: EmailStr

# Dùng khi đăng ký tài khoản
class UserCreate(UserBase):
    full_name: str
    password: str
    phone: Optional[str] = None

# Dùng khi đăng nhập
class UserLogin(UserBase):
    email: str
    password: str

# Dùng khi trả dữ liệu về (giấu mật khẩu đi)
class UserOut(UserBase):
    id: int
    full_name: str
    phone: Optional[str] = None
    role: str = "user"
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ==========================================
# 2. EVENT SCHEMAS (Cho Tạo sự kiện)
# ==========================================
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime          # Dùng datetime chuẩn SQL
    location: str
    capacity: int = 100
    image_url: Optional[str] = None

# Dùng để nhận dữ liệu từ Frontend gửi lên
class EventCreate(EventBase):
    # organizer_id không bắt buộc nhập vì Server sẽ tự lấy từ Token
    organizer_id: Optional[int] = None 

# Dùng để trả dữ liệu về (kèm ID)
class Event(EventBase):
    id: int
    organizer_id: int
    
    class Config:
        from_attributes = True