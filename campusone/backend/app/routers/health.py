from fastapi import APIRouter
from app.models.health import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(status="ok")
