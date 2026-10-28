from enum import Enum
from typing import Literal

from fastapi import APIRouter, HTTPException
from sqlmodel import Session, col, select

from app.database import SessionDep
from app.models import (
    Application,
    ApplicationCreate,
    ApplicationPublic,
    ApplicationUpdate,
    Status,
)

# Every route in this file starts with /applications
router = APIRouter(prefix="/applications", tags=["applications"])

class SortField(str, Enum):
    id = "id"
    company = "company"
    date_applied = "date_applied"
    status = "status"

def get_or_404(session: Session, application_id: int) -> Application:
    application = session.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.get("", response_model=list[ApplicationPublic])
def list_application(
    session: SessionDep,
    status: Status | None = None,
    company: str | None = None,
    sort: SortField = SortField.id,
    order: Literal["asc", "desc"] = "asc"
):
    statement = select(Application) # SELECT * FROM application

    if status is not None:
        statement = statement.where(Application.status == status)
    if company is not None:
        statement = statement.where(col(Application.company).icontains(company))

    column = col(getattr(Application, sort.value))
    statement = statement.order_by(column.desc() if order == "desc" else column.asc())

    return session.exec(statement).all()


@router.get("/{application_id}", response_model=ApplicationPublic)
def get_application(application_id: int, session: SessionDep):
    return get_or_404(session, application_id)

@router.post("", response_model=ApplicationPublic, status_code=201)
def create_application(data: ApplicationCreate, session: SessionDep):
    application = Application.model_validate(data) # turn the request data into a table role
    session.add(application) # stage it
    session.commit() # save it to the database
    session.refresh(application) # reload it, so it now has the id the database assigned
    return application

@router.patch("/{application_id}", response_model=ApplicationPublic)
def update_applicatoin(application_id: int, data: ApplicationUpdate, session: SessionDep):
    application = get_or_404(session, application_id)
    changes = data.model_dump(exclude_unset=True)
    application.sqlmodel_update(changes)
    session.add(application)
    session.commit()
    session.refresh(application)
    return application

@router.delete("/{application_id}", status_code=204)
def delete_applicatoin(application_id: int, session: SessionDep):
    application = get_or_404(session, application_id)
    session.delete(application)
    session.commit()