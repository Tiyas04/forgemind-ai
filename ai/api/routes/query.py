from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from services.query_service import QueryService

router = APIRouter()
service = QueryService()

class Query(BaseModel):
    question: str

@router.post("/query")
def query(request: Query):
    # Return the AIResponse object directly for a flat JSON structure
    return service.ask(request.question)

@router.post("/query/stream")
def query_stream(request: Query):
    return StreamingResponse(
        service.ask_stream(request.question),
        media_type="text/event-stream"
    )