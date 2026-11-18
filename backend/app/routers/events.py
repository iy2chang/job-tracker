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
