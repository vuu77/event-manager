from sqlalchemy import Column, Integer, String, Date
from database import Base

# Bảng Người dùng (Quan trọng cho Đăng ký/Đăng nhập)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True) # Email là duy nhất
    password = Column(String)

# Bảng Sự kiện (Để hiển thị lên trang chủ sau này)
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    date = Column(String)
    location = Column(String)
    capacity = Column(Integer, default=100) # Số lượng vé
    performers = Column(String, default="Đang cập nhật") # Tên ca sĩ/khách mời