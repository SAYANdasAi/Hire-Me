import os
import io
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import Response, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from docx import Document

# Initialize FastAPI
app = FastAPI(
    title="JobLens AI Service",
    description="Microservice for job search intent detection, parsing, summarization, and AI resume optimization",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
import google.generativeai as genai
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("WARNING: GEMINI_API_KEY is not set. The service will run in MOCK mode.")

# --- Text Extraction Helper ---
def extract_text_from_file(file_content: bytes, filename: str) -> str:
    ext = filename.split('.')[-1].lower()
    if ext == 'pdf':
        try:
            pdf = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")
    elif ext in ['docx', 'doc']:
        try:
            doc = Document(io.BytesIO(file_content))
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract text from DOCX: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")

# --- Pydantic Schemas ---
class IntentGuardRequest(BaseModel):
    query: str

class IntentGuardResponse(BaseModel):
    is_job_search: bool
    redirect_message: str

class QueryParseRequest(BaseModel):
    query: str

class QueryParseResponse(BaseModel):
    role: Optional[str] = None
    level: Optional[str] = None
    location: Optional[str] = None

class JobSummaryRequest(BaseModel):
    title: str
    company: str
    description: str
    location: Optional[str] = None
    salary: Optional[str] = None

class JobSummaryResponse(BaseModel):
    summary: str
    company_overview: str
    experience_required: str
    tech_stack: List[str]
    why_apply: str

class ResumeRewriteRequest(BaseModel):
    section: str
    current_text: str
    missing_keywords: List[str]

class ResumeRewriteResponse(BaseModel):
    rewritten_text: str
    changes_summary: str

# --- Endpoints ---

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_configured": model is not None,
        "mode": "production" if model else "mock"
    }

@app.post("/jobs/intent-guard", response_model=IntentGuardResponse)
async def intent_guard(request: IntentGuardRequest):
    query = request.query
    if not model:
        # Mock behavior
        is_job_search = any(word in query.lower() for word in ["job", "hire", "work", "sde", "developer", "engineer", "designer", "manager", "role", "position"])
        redirect_message = "" if is_job_search else "JobLens is specialized in career and job discovery. Try searching for roles like 'Frontend Engineer in Bangalore'."
        return IntentGuardResponse(is_job_search=is_job_search, redirect_message=redirect_message)

    prompt = f"""
    You are an intent guard for JobLens, a job search application.
    Analyze the user's search query and determine if it is career, job search, hiring, recruitment, or role discovery related.
    
    Query: "{query}"
    
    Respond strictly in JSON format with two fields:
    1. "is_job_search" (boolean): true if related to jobs/careers/hiring/roles, false otherwise.
    2. "redirect_message" (string): If is_job_search is false, provide a polite, friendly guiding message suggesting what they can search for instead. If is_job_search is true, leave this as empty string.
    
    JSON response:
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return IntentGuardResponse(
            is_job_search=data.get("is_job_search", True),
            redirect_message=data.get("redirect_message", "")
        )
    except Exception as e:
        return IntentGuardResponse(
            is_job_search=True,
            redirect_message=""
        )

@app.post("/jobs/parse-query", response_model=QueryParseResponse)
async def parse_query(request: QueryParseRequest):
    query = request.query
    if not model:
        # Mock parsing: Simple keyword check
        words = query.split()
        role = "Software Developer"
        location = "Remote"
        level = "Mid"
        if len(words) > 0:
            role = words[0]
        if "bangalore" in query.lower() or "bengaluru" in query.lower():
            location = "Bangalore"
        if "sde 2" in query.lower() or "senior" in query.lower():
            level = "Senior"
        return QueryParseResponse(role=role, level=level, location=location)

    prompt = f"""
    You are a query parser for a job search engine.
    Extract the role, seniority level (e.g. Intern, Junior, SDE 2, Senior, Lead, Director), and location from the following search query.
    
    Query: "{query}"
    
    Respond strictly in JSON format with these exact fields:
    - "role" (string or null)
    - "level" (string or null)
    - "location" (string or null)
    
    JSON response:
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return QueryParseResponse(
            role=data.get("role"),
            level=data.get("level"),
            location=data.get("location")
        )
    except Exception:
        return QueryParseResponse(role=query, level=None, location=None)

@app.post("/jobs/summarize", response_model=JobSummaryResponse)
async def summarize_job(request: JobSummaryRequest):
    if not model:
        # Mock summary
        return JobSummaryResponse(
            summary=f"Exciting opportunity for a {request.title} to join {request.company} and work on high-scale systems.",
            company_overview=f"{request.company} is a leading innovator in modern solutions and user-centric systems.",
            experience_required="3+ years of professional software engineering experience.",
            tech_stack=["React", "TypeScript", "Node.js", "PostgreSQL"],
            why_apply="Work on cutting edge technologies, competitive salary, and high growth environment."
        )

    prompt = f"""
    You are an expert recruiter and technical editor. Summarize the following job description into structured JSON.
    
    Job Title: {request.title}
    Company: {request.company}
    Location: {request.location or "Not specified"}
    Salary: {request.salary or "Not specified"}
    
    Description:
    {request.description}
    
    Respond strictly in JSON format with the following keys:
    - "summary" (string): A concise, punchy 3-line summary of what the job entails.
    - "company_overview" (string): 1-2 sentences about the company's background and culture.
    - "experience_required" (string): Concise summary of the experience level and key background needed.
    - "tech_stack" (list of strings): Extracted technical tools, frameworks, and programming languages.
    - "why_apply" (string): Key benefits, exciting challenges, or unique selling points of this position.
    
    JSON response:
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return JobSummaryResponse(
            summary=data.get("summary", ""),
            company_overview=data.get("company_overview", ""),
            experience_required=data.get("experience_required", ""),
            tech_stack=data.get("tech_stack", []),
            why_apply=data.get("why_apply", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini summarization failed: {str(e)}")

# --- Module 3 Endpoints (Resume Optimizer) ---

@app.post("/resume/score")
async def score_resume(
    jd_text: str = Form(...),
    file: UploadFile = File(...)
):
    # Read the file contents and extract text
    file_content = await file.read()
    resume_text = extract_text_from_file(file_content, file.filename)

    if not model:
        # Mock scoring
        return {
            "score": 75,
            "missing_keywords": ["FastAPI", "Redis", "Cloudinary"],
            "matched_keywords": ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
            "feedback": "Your resume has a strong foundation in frontend and database design. To better align with the job description, you should highlight backend experiences with FastAPI, session caching with Redis, and media assets handling using Cloudinary."
        }

    prompt = f"""
    You are an advanced Applicant Tracking System (ATS) optimization engine.
    Analyze the following resume text against the provided job description (JD).
    
    Resume Text:
    {resume_text}
    
    Job Description (JD):
    {jd_text}
    
    Perform a gap analysis and respond strictly in JSON format with these keys:
    - "score" (integer, 0 to 100): The overall match score.
    - "missing_keywords" (list of strings): Critical technical skills, frameworks, or methodologies present in the JD but missing in the resume.
    - "matched_keywords" (list of strings): Skills and keywords that successfully match between both.
    - "feedback" (string): Detailed actionable advice on how the candidate can improve their resume for this JD.
    
    JSON response:
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume scoring failed: {str(e)}")

@app.post("/resume/rewrite", response_model=ResumeRewriteResponse)
async def rewrite_resume_section(request: ResumeRewriteRequest):
    if not model:
        # Mock rewriting
        keywords_str = ", ".join(request.missing_keywords)
        return ResumeRewriteResponse(
            rewritten_text=f"{request.current_text} Handled high-throughput APIs using FastAPI, caching query responses with Redis, and optimized asset delivery via Cloudinary CDN integration.",
            changes_summary=f"Integrated missing keywords: {keywords_str}. Framed experience with strong action verbs and quantified impact."
        )

    prompt = f"""
    You are an expert resume writer. Rewrite the following section of a resume to incorporate the missing keywords naturally while maintaining professional tone and truthfulness.
    
    Section Name: {request.section}
    Current Text:
    {request.current_text}
    
    Missing Keywords to incorporate: {request.missing_keywords}
    
    Respond strictly in JSON format with the following keys:
    - "rewritten_text" (string): The newly rewritten section.
    - "changes_summary" (string): A short list of what was changed and why.
    
    JSON response:
    """
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return ResumeRewriteResponse(
            rewritten_text=data.get("rewritten_text", ""),
            changes_summary=data.get("changes_summary", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume rewrite failed: {str(e)}")

@app.post("/resume/export")
async def export_resume(resume_data: Dict[str, Any]):
    # In a real environment weasyprint compiles HTML to PDF.
    # We will set up Jinja2 templates.
    # For safety on systems where weasyprint system dependencies (pango/cairo) might be missing initially,
    # we provide a fallback text-based PDF or standard weasyprint compilation.
    try:
        from jinja2 import Environment, FileSystemLoader
        # Render HTML using jinja2
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; margin: 40px; }
                h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px; }
                h2 { color: #0f172a; margin-top: 20px; font-size: 16px; border-bottom: 1px solid #e2e8f0; }
                .contact { font-size: 12px; color: #64748b; margin-bottom: 20px; }
                .section-content { font-size: 13px; line-height: 1.6; margin-bottom: 15px; white-space: pre-line; }
            </style>
        </head>
        <body>
            <h1>{{ name }}</h1>
            <div class="contact">
                Email: {{ email }} | Phone: {{ phone }} | Location: {{ location }}
                {% if website %}| Website: {{ website }}{% endif %}
            </div>
            
            {% for section_title, content in sections.items() %}
                <h2>{{ section_title }}</h2>
                <div class="section-content">{{ content }}</div>
            {% endfor %}
        </body>
        </html>
        """
        
        from jinja2 import Template
        template = Template(html_template)
        rendered_html = template.render(
            name=resume_data.get("name", "John Doe"),
            email=resume_data.get("email", "john.doe@example.com"),
            phone=resume_data.get("phone", "+1234567890"),
            location=resume_data.get("location", "Remote"),
            website=resume_data.get("website", ""),
            sections=resume_data.get("sections", {})
        )
        
        # Try compiling with weasyprint, fallback to HTML if weasyprint library has system binary issues on local Windows
        try:
            from weasyprint import HTML
            pdf_bytes = HTML(string=rendered_html).write_pdf()
            return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=resume.pdf"})
        except Exception as we_err:
            print(f"Weasyprint PDF compile failed or system libraries missing: {str(we_err)}. Falling back to plain HTML response.")
            # Fallback outputting HTML as PDF attachment (simple and readable text fallback)
            return Response(content=rendered_html.encode('utf-8'), media_type="text/html", headers={"Content-Disposition": "attachment; filename=resume.html"})
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume export failed: {str(e)}")
