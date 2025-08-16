# backend/api/deps.py
from core.config import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import Client, create_client

# This scheme tells FastAPI that routes using it expect an "Authorization: Bearer <token>" header.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dependency #1: Get an admin client with service_role key. This client can bypass RLS.
def get_supabase_admin() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


# Dependency #2: Validate the token and return the user's ID.
async def get_current_user_id(
    token: str = Depends(oauth2_scheme),
    db_admin: Client = Depends(
        get_supabase_admin
    ),  # It uses the admin client to verify the token
) -> str:
    try:
        user_response = db_admin.auth.get_user(token)
        return user_response.user.id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
