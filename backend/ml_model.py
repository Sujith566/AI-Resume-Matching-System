import pandas as pd
import joblib
import re
from pathlib import Path
from sklearn.preprocessing import normalize


# ============================================================
# 1. LOAD MODEL AND VECTORIZER
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

model = joblib.load(MODEL_DIR / "xgboost_baseline.pkl")
vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.pkl")


# ============================================================
# 2. SKILLS LIST
# ============================================================

skills_list = [
    "Python",
    "SQL",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "FastAPI",
    "Flask",
    "Django",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "GCP",
    "Java",
    "JavaScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "NLP",
    "Computer Vision",
    "Spark",
    "Hadoop"
]


# ============================================================
# 3. EXTRACT SKILLS
# ============================================================

def extract_skills(text):

    text_lower = text.lower()

    found_skills = []

    for skill in skills_list:

        if skill.lower() in text_lower:
            found_skills.append(skill)

    return found_skills


# ============================================================
# 4. CALCULATE SKILL OVERLAP
# ============================================================

def calculate_skill_overlap(resume, job_description):

    resume_skills = extract_skills(resume)

    required_skills = extract_skills(job_description)

    matched_skills = [
        skill
        for skill in required_skills
        if skill in resume_skills
    ]

    missing_skills = [
        skill
        for skill in required_skills
        if skill not in resume_skills
    ]

    if len(required_skills) == 0:

        skill_overlap = 0.0

    else:

        skill_overlap = (
            len(matched_skills)
            / len(required_skills)
        )

    return (
        matched_skills,
        missing_skills,
        skill_overlap
    )


# ============================================================
# 5. EXTRACT CANDIDATE EXPERIENCE
# ============================================================

def extract_candidate_experience(text):

    text = text.lower()

    # Example: "3 years of experience"
    match = re.search(
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        text
    )

    if match:
        return int(match.group(1))

    # Example: "3 yrs experience"
    match = re.search(
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience',
        text
    )

    if match:
        return int(match.group(1))

    return 0


def extract_required_experience(text):

    text = text.lower()

    # Example: "2-4 years of experience"
    match = re.search(
        r'(\d+)\s*-\s*(\d+)\s*years?',
        text
    )

    if match:
        return int(match.group(2))

    # Example: "3+ years of experience"
    match = re.search(
        r'(\d+)\+\s*years?',
        text
    )

    if match:
        return int(match.group(1))

    # Example: "2 years of experience"
    match = re.search(
        r'(\d+)\s*years?\s+(?:of\s+)?experience',
        text
    )

    if match:
        return int(match.group(1))

    return 0

# ============================================================
# 7. CALCULATE EXPERIENCE MATCH
# ============================================================

def calculate_experience_match(
    candidate_experience,
    required_experience
):

    if required_experience == 0:

        return 1.0

    return min(
        candidate_experience / required_experience,
        1.0
    )


# ============================================================
# 8. PREDICT MATCH
# ============================================================

def predict_match(resume, job_description):

    # --------------------------------------------------------
    # A. TF-IDF COSINE SIMILARITY
    # --------------------------------------------------------

    resume_vector = vectorizer.transform([resume])

    jd_vector = vectorizer.transform([job_description])

    resume_vector = normalize(resume_vector)

    jd_vector = normalize(jd_vector)

    cosine_similarity = (
        resume_vector.multiply(jd_vector)
    ).sum().item()


    # --------------------------------------------------------
    # B. SKILL OVERLAP
    # --------------------------------------------------------

    (
        matched_skills,
        missing_skills,
        skill_overlap
    ) = calculate_skill_overlap(
        resume,
        job_description
    )


    # --------------------------------------------------------
    # C. EXPERIENCE
    # --------------------------------------------------------

    candidate_experience = extract_candidate_experience(
        resume
    )

    required_experience = extract_required_experience(
        job_description
    )


    # --------------------------------------------------------
    # D. EXPERIENCE MATCH
    # --------------------------------------------------------

    experience_match = calculate_experience_match(
        candidate_experience,
        required_experience
    )


    # --------------------------------------------------------
    # E. CREATE MODEL FEATURES
    # --------------------------------------------------------

    features = pd.DataFrame({

        "cosine_similarity": [
            cosine_similarity
        ],

        "skill_overlap": [
            skill_overlap
        ],

        "experience_match": [
            experience_match
        ]

    })


    # --------------------------------------------------------
    # F. PREDICT MATCH SCORE
    # --------------------------------------------------------

    prediction = model.predict(features)[0]


    # --------------------------------------------------------
    # G. RETURN RESULT
    # --------------------------------------------------------

    return {

        "match_score": round(
            float(prediction),
            2
        ),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "candidate_experience": candidate_experience,

        "required_experience": required_experience
    }