import os
import logging
from fastapi import APIRouter, UploadFile, HTTPException
from services.ingestion_service import IngestionService

logger = logging.getLogger("ai_service")
router = APIRouter()
service = IngestionService()

@router.post("/upload")
async def upload(file: UploadFile):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    path = f"{upload_dir}/{file.filename}"
    
    try:
        content = await file.read()
        with open(path, "wb") as f:
            f.write(content)
            
        res = service.ingest(path)
        
        return {
            "status": "success",
            "doc_id": res.get("doc_id", f"doc_{file.filename}"),
            "filename": res.get("filename", file.filename),
            "chunks_count": res.get("chunks_count", 0)
        }
    except Exception as e:
        logger.error(f"Ingestion failed for file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ingestion pipeline failed: {str(e)}")

@router.delete("/upload/{doc_id}")
def delete_document(doc_id: str):
    try:
        # 1. Clear vector database index
        from storage.chroma.repository import ChromaRepository
        chroma = ChromaRepository()
        chroma.delete(doc_id)
        
        # 2. Clear Knowledge Graph nodes/edges
        from storage.neo4j.repository import Neo4jRepository
        graph = Neo4jRepository()
        graph.delete_by_doc_id(doc_id)
        
        return {
            "status": "success",
            "message": f"Document index with doc_id {doc_id} successfully deleted."
        }
    except Exception as e:
        logger.error(f"Deletion failed for doc_id {doc_id}: {str(e)}")
        return {
            "status": "warning",
            "message": f"Partial deletion completed for doc_id {doc_id}: {str(e)}"
        }