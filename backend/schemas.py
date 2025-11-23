from pydantic import BaseModel
from typing import Optional

# --- 1. PHẦN SỰ KIỆN (EVENT) ---
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    capacity: Optional[int] = 100
    performers: Optional[str] = "Đang cập nhật"

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    class Config:
        from_attributes = True

# --- 2. PHẦN NGƯỜI DÙNG (USER) - QUAN TRỌNG ---
class UserBase(BaseModel):
    email: str  # <--- Đã đổi thành str (Chấp nhận mọi loại chữ)

class UserCreate(UserBase):
    full_name: str
    password: str

class UserLogin(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    full_name: str
    class Config:
        from_attributes = True