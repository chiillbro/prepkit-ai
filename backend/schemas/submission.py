from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    problem_id: str
    language: str  # e.g., "python", "javascript"
    code: str


class OptimalSolutionInfo(BaseModel):
    time_complexity: str | None
    space_complexity: str | None


class SubmissionResult(BaseModel):
    status: str  # e.g., 'success', 'fail'
    execution_time_ms: float | None = None
    memory_kb: int | None = None
    output: str
    optimal_solution: OptimalSolutionInfo | None = None
