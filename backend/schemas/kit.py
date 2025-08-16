from typing import List
from uuid import UUID

from pydantic import BaseModel


class KitCreate(BaseModel):
    days: int
    topics: List[str]


class ProblemInKit(BaseModel):
    id: UUID
    title: str
    topic: str
    difficulty: int

    class config:
        from_attributes = True


class KitResponse(BaseModel):
    id: UUID
    name: str
    day_plan: dict[int, List[ProblemInKit]]

    class Config:
        from_attributes = True


class KitCreationResponse(BaseModel):
    kit_id: UUID
