from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = "sqlite:///jobtracker.db"  # creates jobtracker.db in the foler you run the server from

# check_same_thread=False lets FastAPI use the SQLite connection from different threads
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine) # creates any tables that don't exists yet

def get_session():
    """Open a session for one request, and close it when the request is done."""
    with Session(engine) as session:
        yield session

# Shortcut: put `session: SessionDep` in an endpoint and FastAPI hands you a session
SessionDep = Annotated[Session, Depends(get_session)]