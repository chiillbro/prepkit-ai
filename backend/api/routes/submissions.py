import httpx
from api.deps import get_current_user_id, get_supabase_admin
from core.config import settings
from fastapi import APIRouter, Depends, HTTPException
from schemas.submission import SubmissionCreate, SubmissionResult
from supabase import Client

router = APIRouter()
# Mapping our languages to Judge0 language IDs
# You can find more here: https://judge0.com/
LANGUAGE_ID_MAP = {
    "python": 71,
    "javascript": 63,
    "go": 60,
}


@router.post("/", response_model=SubmissionResult)
async def run_code_submission(
    submission_in: SubmissionCreate,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase_admin),
):
    """
    Receives code, sends it to Judge0 for execution,
    saves the result, and returns feedback.
    """
    language_id = LANGUAGE_ID_MAP.get(submission_in.language)
    if not language_id:
        raise HTTPException(status_code=400, detail="Unsupported language.")

    # In a real app, you'd fetch test cases from your DB
    # For now, we'll use a simple "Hello World" stdin/stdout test
    mock_stdin = "World"
    mock_expected_output = "Hello, World!\n"

    judge0_payload = {
        "source_code": submission_in.code,
        "language_id": language_id,
        "stdin": mock_stdin,
        "expected_output": mock_expected_output,
    }

    judge0_headers = {
        "X-RapidAPI-Key": settings.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "content-type": "application/json",
    }

    url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url, headers=judge0_headers, json=judge0_payload, timeout=10.0
            )
            response.raise_for_status()  # Raise exception for 4xx/5xx responses

        result = response.json()
        status_description = result.get("status", {}).get("description", "Error")

        # TODO: Add user_id once auth is implemented
        # db.table('submissions').insert({
        #     'problem_id': submission_in.problem_id,
        #     'language': submission_in.language,
        #     'code': submission_in.code,
        #     'status': status_description,
        #     'execution_time_ms': float(result.get('time', 0)) * 1000,
        #     'memory_kb': result.get('memory', 0)
        # }).execute()

        return SubmissionResult(
            status=status_description,
            execution_time_ms=float(result.get("time", 0)) * 1000
            if result.get("time")
            else None,
            memory_kb=result.get("memory"),
            output=result.get("stdout")
            or result.get("stderr")
            or result.get("compile_output")
            or "No output.",
        )

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error communicating with Judge0: {e.response.text}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An internal server error occurred: {str(e)}"
        )
