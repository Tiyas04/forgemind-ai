from pydantic import BaseModel
from typing import Any


class AIResponse(BaseModel):
    answer: str
    confidence: float
    citations: list[dict[str, Any]]
    suggested_questions: list[str]
    metadata: dict[str, Any]


class ResponseBuilder:

    def build(
        self,
        answer,
        confidence,
        citations,
        suggested_questions
    ):

        return AIResponse(
            answer=answer,
            confidence=confidence,
            citations=citations,
            suggested_questions=suggested_questions,
            metadata={}
        )