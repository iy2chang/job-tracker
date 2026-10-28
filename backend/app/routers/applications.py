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