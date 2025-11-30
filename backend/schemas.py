# --- FILE: backend/schemas.py (BẢN FULL ĐẦY ĐỦ) ---
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ==========================================
# 1. USER SCHEMAS (Tài khoản)
# ==========================================
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    full_name: str
    password: str
    phone: Optional[str] = None

class UserLogin(UserBase):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    full_name: str
    phone: Optional[str] = None
    role: str = "user"
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Dùng để nhúng thông tin rút gọn của người tạo vào Event
class UserBasic(BaseModel):
    full_name: str
    email: str
    class Config:
        from_attributes = True

# ==========================================
# 2. EVENT REQUEST SCHEMAS (Sự kiện Công ty) <--- ĐÂY LÀ PHẦN BẠN ĐANG THIẾU
# ==========================================
class EventRequestCreate(BaseModel):
    full_name: str
    email: str
    topic: str
    message: str

# ==========================================
# 3. EVENT SCHEMAS (Sự kiện Nghệ thuật)
# ==========================================
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime          
    location: str
    capacity: int = 100
    image_url: Optional[str] = None

# Dùng để nhận dữ liệu từ Frontend gửi lên
class EventCreate(EventBase):
    organizer_id: Optional[int] = None 

# Dùng để trả dữ liệu về (kèm ID và Thông tin người tạo)
class Event(EventBase):
    id: int
    organizer_id: int
    organizer: Optional[UserBasic] = None # Hiện tên người tạo
    
    class Config:
        from_attributes = True