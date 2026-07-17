from ingestion.document_loader import DocumentLoader
from processing.cleaner import TextCleaner
from processing.normalizer import TextNormalizer
from extraction.extractor import IndustrialExtractor
from knowledge.knowledge_builder import KnowledgeBuilder
from knowledge.deduplicator import KnowledgeDeduplicator
from knowledge.validator import KnowledgeValidator
from embeddings.embedding_service import EmbeddingService
from services.indexing_service import IndexingService

class IngestionService:
    def __init__(self):
        self.loader = DocumentLoader()
        self.extractor = IndustrialExtractor()
        self.builder = KnowledgeBuilder()
        self.deduplicator = KnowledgeDeduplicator()
        self.validator = KnowledgeValidator()
        self.embedding = EmbeddingService()
        self.indexing = IndexingService()

    def ingest(self, path: str) -> bool:
        loaded_data = self.loader.load(path)
        document = loaded_data["document"]
        chunks = loaded_data["chunks"]

        doc_id = document.doc_id
        for chunk in chunks:
            chunk.text = TextCleaner.clean(chunk.text)
            chunk.text = TextNormalizer.normalize(chunk.text)
            
            extraction = self.extractor.extract(chunk)
            knowledge = self.builder.build(extraction)
            
            knowledge = self.deduplicator.deduplicate(knowledge)
            knowledge = self.validator.validate(knowledge)

            vector_record = self.embedding.create_vector_record(chunk, knowledge)
            self.indexing.index(knowledge, vector_record, doc_id=doc_id)

        return True
