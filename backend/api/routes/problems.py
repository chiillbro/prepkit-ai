# backend/api/routes/problems.py

from api.deps import get_current_user_id, get_supabase_admin
from fastapi import APIRouter, Depends, HTTPException
from schemas.problem import ProblemDetail  # We need to create this schema
from supabase import Client

router = APIRouter()


@router.get("/{problem_id}", response_model=ProblemDetail)
async def get_problem_details(
    problem_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase_admin),
):
    """
    Fetch the full details of a single problem.
    """
    try:
        response = (
            db.table("problems").select("*").eq("id", problem_id).single().execute()
        )
        if not response.data:
            raise HTTPException(status_code=404, detail="Problem not found.")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
