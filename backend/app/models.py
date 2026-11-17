from datetime import date
from enum import Enum

from sqlmodel import Field, SQLModel, Relationship

class Status(str, Enum):
    wishlist = "wishlist"
    applied = "applied"
    interviewing = "interviewing"
    offer = "offer"
    rejected = "rejected"

class ApplicationBase(SQLModel):
    """Fields shared by every version of an application."""
    company: str = Field(min_length=1, max_length=100, index=True)
    role: str = Field(min_length=1, max_length=100)
    job_url: str | None = None
    status: Status = Field(default=Status.wishlist, index=True)
    date_applied: date | None = None
    location: str | None = None
    notes: str | None = None

class Application(ApplicationBase, table=True):
    """The database table. table=True is what makes it a table."""
    id: int | None = Field(default=None, primary_key=True) # the database fills this in

    """application.events gives a list of that application's events"""
    events: list["Event"] = Relationship(back_populates="application", cascade_delete=True)

class ApplicationCreate(ApplicationBase):
    """What the client sends to create an application (no id)"""
    pass

class ApplicationPublic(ApplicationBase):
    """What the API sends back. id is always present here."""
    id: int

class ApplicationUpdate(SQLModel):
    """Every field optional, so the client can change just one thing."""
    company: str | None = Field(default=None, min_length=1, max_length=100)
    role: str | None = Field(default=None, min_length=1, max_length=100)
    job_url: str | None = None
    status: Status | None = None
    date_applied: date | None = None
    location: str | None = None
    notes: str | None = None

class EventKind(str, Enum):
    applied = "applied"
    phone_screen = "phone_screen"
    interview = "interview"
    follow_up = "follow_up"
    offer = "offer"
    rejection = "rejection"
    other = "other"

class EventBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    kind: EventKind = EventKind.other
    event_date: date
    notes: str | None = None

class Event(EventBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    application_id: int = Field(foreign_key="application.id", index=True)

    """event.applicaiton gives the whole Application object"""
    application: Application = Relationship(back_populate="events")

class EventCreate(EventBase):
    pass

class EventPublic(EventBase):
    id: int
    application_id: int