# backend/schemas/problem.py
from uuid import UUID

from pydantic import BaseModel


class ProblemDetail(BaseModel):
    id: UUID
    title: str
    description: str
    topic: str
    difficulty: int
    # Add other fields from your DB like function signatures, test cases etc.
    # We will add those in the next step.

    class Config:
        from_attributes = True
