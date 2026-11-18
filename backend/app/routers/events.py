from fastapi import APIRouter, HTTPException
from sqlmodel import col, select

from app.database import SessionDep
from app.models import Event, EventCreate, EventPublic
from app.routers.applications import get_or_404

router = APIRouter(tags=["events"])

@router.get("/applications/{application_id}/events", response_model=list[EventPublic])
def list_events(application_id: int, session: SessionDep):
    get_or_404(session, application_id)
    statement = (
        select(Event)
        .where(Event.application_id == application_id)
        .order_by(col(Event.event_date).desc(), col(Event.id).desc())
    )
    return session.exec(statement).all()

@router.post("/applications/{application_id}/events", response_model=EventPublic, status_code=201)
def create_event(application_id: int, data: EventCreate, session: SessionDep):
    get_or_404(session, application_id)
    event = Event.model_validate(data, update={"application_id": application_id})
    session.add(event)
    session.commit()
    session.refresh(event)
    return event