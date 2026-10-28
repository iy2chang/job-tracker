from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import create_db_and_tables
from app.routers import applications

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() # run once when the server starts
    yield   # the server runs here

app = FastAPI(title="Job Tracker API", lifespan=lifespan)

app.include_router(applications.router)

@app.get("/")
def root():
    return {"message": "Job Tracker API is running. Visit /docs to try it."}