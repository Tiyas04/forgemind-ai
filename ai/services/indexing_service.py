from storage.neo4j.repository import Neo4jRepository

from storage.chroma.repository import ChromaRepository


class IndexingService:

    def __init__(self):

        self.graph = Neo4jRepository()
        self.vector = ChromaRepository()

    def index(self, knowledge, vector_record, doc_id: str):
        for node in knowledge.nodes:
            self.graph.merge_node(node, doc_id=doc_id)
        for edge in knowledge.edges:
            self.graph.merge_edge(edge, doc_id=doc_id)
        self.vector.add(vector_record)