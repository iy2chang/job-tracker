from datetime import date
from enum import Enum

from sqlmodel import Field, SQLModel

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
    date_applied: str | None = None
    location: str | None = None
    notes: str | None = None

class Application(ApplicationBase, table=True):
    """The database table. table=True is what makes it a table."""
    id: int | None = Field(default=None, primary_key=True) # the database fills this in

class ApplicationCreate(ApplicationBase):
    """What the client sends to create an application (no id)"""
    pass

class ApplicationPublic(ApplicationBase):
    """What the API sends back. id is always present here."""

class ApplicationUpdate(SQLModel):
    """Every field optional, so the client can change just one thing."""
    company: str | None = Field(default=None, min_length=1, max_length=100)
    role: str | None = Field(default=None, min_length=1, max_length=100)
    job_url: str | None = None
    status: Status | None = None
    date_applied: date | None = None
    location: str | None = None
    notes: str | None = None