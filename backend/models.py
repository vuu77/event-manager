from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Unicode
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# LƯU Ý: Mình đã thêm chữ 'Unicode' vào dòng import ở trên và thay String thành Unicode

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # Dùng Unicode để lưu tiếng Việt (tương đương NVARCHAR trong SQL)
    full_name = Column(Unicode(255), index=True)       
    email = Column(String(255), unique=True, index=True) # Email không dấu nên dùng String ok
    password = Column(String(255))                    
    phone = Column(String(20), nullable=True)         
    role = Column(String(50), default="user")        
    created_at = Column(DateTime, default=datetime.utcnow) 

    events = relationship("Event", back_populates="organizer")
    bookings = relationship("Booking", back_populates="user")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    # Tiêu đề và Địa điểm có dấu -> Dùng Unicode
    title = Column(Unicode(255), index=True)           
    description = Column(Unicode(4000)) # Mô tả dài dùng Unicode to hơn           
    date = Column(DateTime)                      
    location = Column(Unicode(255))                    
    capacity = Column(Integer)                   
    image_url = Column(String(500), nullable=True)    
    
    organizer_id = Column(Integer, ForeignKey("users.id"))
    
    organizer = relationship("User", back_populates="events")
    bookings = relationship("Booking", back_populates="event")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))     
    event_id = Column(Integer, ForeignKey("events.id"))   
    quantity = Column(Integer, default=1)                 
    booking_date = Column(DateTime, default=datetime.utcnow) 
    status = Column(String(50), default="confirmed")          

    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")