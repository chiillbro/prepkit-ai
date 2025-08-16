from api.routes import kits, problems, submissions
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PrepKit AI Backend")

origins = [
    "http://localhost:3000",  # current frontend running address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(kits.router, prefix="/kits", tags=["Kits"])
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
app.include_router(
    problems.router, prefix="/problems", tags=["Problems"]
)  # Add this line


@app.get("/")
def read_root():
    return {"message": "PrepKit AI Backend is running!"}
