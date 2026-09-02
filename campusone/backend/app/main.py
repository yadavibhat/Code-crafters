from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import health, auth, profile, genie, connections, opportunities, clubs, genie_chat

app = FastAPI(title="CampusOne API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(genie.router)
app.include_router(connections.router)
app.include_router(opportunities.router)
app.include_router(clubs.router)
app.include_router(genie_chat.router)

@app.get("/")
def read_root():
    return {"message": "CampusOne Backend API"}
