from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    farmer_id: int


class ChatResponse(BaseModel):
    answer: str
    farmer_id: int
