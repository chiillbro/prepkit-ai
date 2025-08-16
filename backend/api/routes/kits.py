# backend/api/routes/kits.py
import random

from api.deps import get_current_user_id, get_supabase_admin
from fastapi import APIRouter, Depends, HTTPException
from schemas.kit import KitCreate, KitCreationResponse  # We'll add a new response model
from supabase import Client

# A placeholder for our user auth dependency, which we will build out later.
# For now, it returns a mock user ID.
# async def get_current_user_id() -> str:
#     # In a real app, this would decode a JWT and return the user ID.
#     return "be154370-0cf5-4c97-b209-d9dc23b64d93"  # Replace with a user ID from your Supabase auth.users table


router = APIRouter()


@router.post("/", response_model=KitCreationResponse)
async def create_kit(
    kit_in: KitCreate,
    user_id: str = Depends(get_current_user_id),
    db: Client = Depends(get_supabase_admin),
):
    """
    Generate and SAVE a new personalized preparation kit for the authenticated user.
    """
    try:
        # 1. Fetch available problems from the DB
        problem_response = (
            db.table("problems")
            .select("id, title, topic, difficulty")
            .in_("topic", kit_in.topics)
            .execute()
        )
        if not problem_response.data:
            raise HTTPException(
                status_code=404, detail="No problems found for the selected topics."
            )

        # 2. Use our algorithm to select problems
        problems = problem_response.data
        problems_per_day = 3
        total_problems_needed = kit_in.days * problems_per_day

        if len(problems) < total_problems_needed:
            raise HTTPException(
                status_code=400,
                detail="Not enough problems to generate the kit. Select more topics or fewer days.",
            )

        selected_problems = random.sample(problems, total_problems_needed)

        # 3. Save the new kit to the 'kits' table
        kit_name = f"{kit_in.days}-Day Prep Kit for {', '.join(kit_in.topics)}"
        new_kit_data = {
            "user_id": user_id,
            "name": kit_name,
        }
        kit_insert_response = db.table("kits").insert(new_kit_data).execute()
        new_kit_id = kit_insert_response.data[0]["id"]

        # 4. Prepare and save the problems for this kit in the 'kit_problems' table
        kit_problems_to_insert = []
        for i, problem in enumerate(selected_problems):
            day = (i // problems_per_day) + 1
            kit_problems_to_insert.append(
                {
                    "kit_id": new_kit_id,
                    "problem_id": problem["id"],
                    "day_number": day,
                }
            )

        db.table("kit_problems").insert(kit_problems_to_insert).execute()

        # 5. Return the ID of the newly created kit
        return KitCreationResponse(kit_id=new_kit_id)

    except Exception as e:
        # In a real app, you'd have more granular error handling and possibly a transaction rollback
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


from schemas.kit import KitResponse, ProblemInKit


@router.get("/{kit_id}", response_model=KitResponse)
async def get_kit_details(
    kit_id: str,
    user_id: str = Depends(
        get_current_user_id
    ),  # Ensures this is an authenticated route
    db: Client = Depends(get_supabase_admin),
):
    """
    Fetch the details of a single preparation kit, including its day-by-day problem plan.
    """
    try:
        # 1. Fetch the kit details
        kit_response = (
            db.table("kits").select("id, name").eq("id", kit_id).single().execute()
        )
        if not kit_response.data:
            raise HTTPException(status_code=404, detail="Kit not found.")

        kit_details = kit_response.data

        # 2. Fetch the problems associated with this kit, joined with problem details
        kit_problems_response = (
            db.table("kit_problems")
            .select("day_number, problems(id, title, topic, difficulty)")
            .eq("kit_id", kit_id)
            .order("day_number", desc=False)
            .execute()
        )

        if not kit_problems_response.data:
            # This case is unlikely if kit creation was successful, but good to handle
            return KitResponse(
                id=kit_details["id"], name=kit_details["name"], day_plan={}
            )

        # 3. Structure the data into the desired day_plan format
        day_plan = {}
        for item in kit_problems_response.data:
            day = item["day_number"]
            problem_data = item["problems"]
            if day not in day_plan:
                day_plan[day] = []

            # Ensure problem_data is not None before creating ProblemInKit
            if problem_data:
                day_plan[day].append(ProblemInKit(**problem_data))

        return KitResponse(
            id=kit_details["id"], name=kit_details["name"], day_plan=day_plan
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
