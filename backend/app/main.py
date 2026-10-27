from datetime import date
from enum import Enum

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(title="Job Tracker API")

# -------- Models ----------

class Status(str, Enum):
    wishlist = "wishlist"
    applied = "applied"
    interviewing = "interviewing"
    offer = "offer"
    rejected = "rejected"

class ApplicationBase(BaseModel):
    """Fields shared by creating and reading an application."""
    company: str = Field(min_length=1, max_length=100)
    role: str = Field(min_length=1, max_length=100)
    job_url: str | None = None
    status: Status | None = None
    date_applied: date | None = None
    location: str | None = None
    notes: str | None = None

class ApplicationCreate(ApplicationBase):
    """What the client sends to create an application (no id yet)."""
    pass

class ApplicationUpdate(BaseModel):
    """Every field is optional, so the client can change just one thing."""
    company: str | None = Field(default=None, min_length=1, max_length=100)
    role: str | None = Field(default=None, min_length=1, max_length=100)
    job_url: str | None = None
    status: Status | None = None
    location: str | None = None
    notes: str | None = None

class Application(ApplicationBase):
    """Waht the API sends back, including the id."""
    id: int


# fake database

applications: dict[int, Application] = {}
next_id = 1

def get_or_404(application_id: int) -> Application:
    application = applications.get(application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

# ---------- Endpoints ----------------------

@app.get("/")
def root():
    return {"message": "Job Tracker API is running. Visit /docs to try it"}