from pydantic import BaseModel, Field
from typing import Dict, Any
from datetime import datetime
import uuid

class DocumentSchema(BaseModel):
    doc_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    filetype: str
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    processed_at: datetime = Field(default_factory=datetime.utcnow)