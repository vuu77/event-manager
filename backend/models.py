# --- FILE: backend/models.py (BẢN FULL KHÔNG LỖI) ---
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Unicode, DECIMAL
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# 1. Bảng Users (Tài khoản)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(Unicode(255)) # Unicode để lưu tiếng Việt
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    phone = Column(String(20))
    role = Column(String(50), default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

# 2. Bảng Events (Sự kiện Nghệ thuật)
class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(Unicode(255))
    description = Column(Unicode) # Tương đương NVARCHAR(MAX)
    date = Column(DateTime)
    location = Column(Unicode(255))
    capacity = Column(Integer)
    image_url = Column(String(500))
    organizer_id = Column(Integer, ForeignKey("users.id"))
    
    # Quan hệ: Một sự kiện thuộc về một người tạo
    organizer = relationship("User")

# 3. Bảng EventRequests (Sự kiện Công ty - Form liên hệ)
class EventRequest(Base):
    __tablename__ = "event_requests"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(Unicode(255))
    email = Column(String(255))
    topic = Column(Unicode(255))
    message = Column(Unicode)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

# 4. Bảng Bookings (Đặt vé)
class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    # user_id có thể để trống (nullable=True) nếu khách vãng lai đặt
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    quantity = Column(Integer, default=1)
    status = Column(String(50), default="confirmed")
    booking_date = Column(DateTime, default=datetime.utcnow)

# 5. Bảng Products (Gói dịch vụ Báo giá)
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Unicode(255))
    price = Column(DECIMAL(18, 0)) # Dùng DECIMAL cho tiền tệ
    description = Column(Unicode)
    created_at = Column(DateTime, default=datetime.utcnow)

# 6. Bảng Orders (Đơn hàng)
class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(DECIMAL(18, 0))
    status = Column(String(50), default="Pending")
    order_date = Column(DateTime, default=datetime.utcnow)

# 7. Bảng OrderDetails (Chi tiết đơn hàng)
class OrderDetail(Base):
    __tablename__ = "order_details"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    price_at_purchase = Column(DECIMAL(18, 0))