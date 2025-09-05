from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
from fastembed import TextEmbedding
from typing import List


class KBVectorStore:
    def __init__(self, url: str, collection: str):
        self.client = QdrantClient(url=url)
        self.collection = collection
        self.embedder = TextEmbedding("sentence-transformers/all-MiniLM-L6-v2")
        self._ensure_collection()

    def _ensure_collection(self):
        try:
            self.client.get_collection(self.collection)
        except Exception:
            self.client.recreate_collection(
                collection_name=self.collection,
                vectors_config=qmodels.VectorParams(
                    size=384, distance=qmodels.Distance.COSINE
                ),
            )

    def index_texts(self, texts: List[str]):
        embeddings = list(self.embedder.embed(texts))
        points = [
            qmodels.PointStruct(id=i, vector=emb, payload={"text": t})
            for i, (emb, t) in enumerate(zip(embeddings, texts))
        ]
        self.client.upsert(collection_name=self.collection, points=points)

    def search(self, query: str, limit: int = 3):
        qvec = list(self.embedder.embed([query]))[0]
        res = self.client.search(
            collection_name=self.collection, query_vector=qvec, limit=limit
        )
        return [hit.payload["text"] for hit in res]
