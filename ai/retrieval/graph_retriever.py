class GraphRetriever:

    def __init__(

        self,

        repository

    ):

        self.repository = repository

    def retrieve(self, entities):
        return self.repository.expand(entities=entities, doc_ids=None)