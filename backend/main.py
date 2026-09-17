from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from backend.ml_model import predict_match
from backend.resume_parser import extract_text_from_resume


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://ai-resume-matching-system-1.onrender.com"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {
        "message": "AI Resume Matching API is running"
    }


@app.post("/predict")
async def predict(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...)
):

    # Save uploaded resume temporarily
    file_path = Path(f"temp_{resume_file.filename}")

    with open(file_path, "wb") as file:
        file.write(await resume_file.read())

    # Extract text from PDF/DOCX
    resume_text = extract_text_from_resume(file_path)

    # Delete temporary file
    file_path.unlink()

    # Run ML prediction
    result = predict_match(
        resume_text,
        job_description
    )

    return result