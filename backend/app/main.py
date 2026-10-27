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

@app.get("/applications", response_model=list[Application])
def list_applications(status: Status | None = None):
    results = list(applications.values())
    if status is not None:
        results = [a for a in results if a.status == status]
    return results

@app.get("/applications/{application_id}", response_model=Application)
def get_application(application_id: int):
    return get_or_404(application_id)

@app.post("/applications", response_model=Application, status_code=status.HTTP_201_CREATED)
def create_application(data: ApplicationCreate):
    global next_id
    application = Application(id=next_id, **data.model_dump())
    applications[next_id] = application
    next_id += 1
    return application

@app.patch("/applications/{application_id}", response_model=Application)
def update_application(application_id: int, data: ApplicationUpdate):
    application = get_or_404(application_id)
    changes = data.model_dump(exclude_unset=True) # only fields the client actually sent
    updated = application.model_copy(update=changes)
    application[application_id] = updated
    return updated

@app.delete("/applications/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int):
    get_or_404(application_id)
    del applications[application_id]