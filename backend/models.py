from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    bookings = relationship("Booking", back_populates="user")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    date = Column(String)
    location = Column(String)
    capacity = Column(Integer, default=100)
    performers = Column(String, default="Đang cập nhật")
    bookings = relationship("Booking", back_populates="event")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    customer_email = Column(String)
    quantity = Column(Integer)
    total_price = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")