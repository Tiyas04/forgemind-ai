from storage.neo4j.client import Neo4jClient

class Neo4jRepository:
    def __init__(self):
        self.client = Neo4jClient()

    def merge_node(self, node, doc_id: str):
        query = f"""
        MERGE (n:{node.label} {{id: $id}})
        SET n += $properties, n.doc_id = $doc_id
        """
        with self.client.session() as session:
            session.run(
                query,
                id=node.id,
                properties=node.properties,
                doc_id=doc_id
            )

    def merge_edge(self, edge, doc_id: str):
        query = f"""
        MATCH (a {{id: $source}})
        MATCH (b {{id: $target}})
        MERGE (a)-[r:{edge.relation}]->(b)
        SET r += $properties, r.doc_id = $doc_id
        """
        with self.client.session() as session:
            session.run(
                query,
                source=edge.source,
                target=edge.target,
                properties=edge.properties,
                doc_id=doc_id
            )

    def expand(self, entities: list, doc_ids: list | None = None):
        params = {"entities": entities}
        if doc_ids:
            query = """
            MATCH (n)-[r]-(m)
            WHERE n.id IN $entities AND r.doc_id IN $doc_ids
            RETURN n.id AS source, type(r) AS relation, m.id AS target
            LIMIT 50
            """
            params["doc_ids"] = doc_ids
        else:
            # If no doc_ids are specified, expand across all documents.
            query = """
            MATCH (n)-[r]-(m)
            WHERE n.id IN $entities
            RETURN n.id AS source, type(r) AS relation, m.id AS target
            LIMIT 50
            """

        graph_context = []
        with self.client.session() as session:
            result = session.run(query, **params)
            for record in result:
                graph_context.append(
                    f"{record['source']} -[{record['relation']}]-> {record['target']}"
                )
        return graph_context