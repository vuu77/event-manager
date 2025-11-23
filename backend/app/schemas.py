from pydantic import BaseModel

class EventBase(BaseModel):
    title: str
    description: str | None = None
    location: str | None = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True
