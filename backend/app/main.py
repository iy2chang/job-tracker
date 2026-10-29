from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db_and_tables
from app.routers import applications

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() # run once when the server starts
    yield   # the server runs here

app = FastAPI(title="Job Tracker API", lifespan=lifespan)

# Let the React dev server (a different origin) call the API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(applications.router)

@app.get("/")
def root():
    return {"message": "Job Tracker API is running. Visit /docs to try it."}