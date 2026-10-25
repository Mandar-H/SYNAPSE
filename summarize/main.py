"""
FastAPI Backend for Legal Document Analysis
Provides endpoints for document upload, summarization, and keyword search
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
import tempfile
from pathlib import Path
from contextlib import asynccontextmanager

from document_processor import DocumentProcessor
from nlp_processor import NLPProcessor
from database import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    # Startup
    await db.connect()
    yield
    # Shutdown
    await db.disconnect()

app = FastAPI(
    title="Synapse Document Analyzer",
    description="A private, secure backend for analyzing and summarizing documents",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for web application integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processors
doc_processor = DocumentProcessor()
nlp_processor = NLPProcessor()

# Temporary storage for uploaded files (in production, use proper storage)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Ensure uploads directory exists
try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except Exception as e:
    print(f"Warning: Could not create uploads directory: {e}")


class TextInput(BaseModel):
    """Model for direct text input"""
    text: str


class SearchRequest(BaseModel):
    """Model for search request"""
    text: str
    keywords: str
    top_k: Optional[int] = 5
    use_semantic: Optional[bool] = True


class SummaryRequest(BaseModel):
    """Model for summary request"""
    text: str
    max_length: Optional[int] = 150
    min_length: Optional[int] = 30


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Legal Document Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/upload",
            "summarize": "/summarize",
            "search": "/search",
            "process_document": "/process_document"
        }
    }


@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_email: Optional[str] = Form(None)
):
    """
    Upload a document file and extract text
    
    Supports: PDF, DOCX, TXT files
    """
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_ext = Path(file.filename).suffix
        file_path = UPLOAD_DIR / f"{file_id}{file_ext}"
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        file_size = len(content)
        
        # Extract text
        text = await doc_processor.extract_text(str(file_path), file_ext)
        
        # Save to database
        doc_id = await db.save_document(
            filename=file.filename,
            file_id=file_id,
            text=text,
            user_email=user_email,
            file_type=file_ext,
            file_size=file_size
        )
        
        return {
            "document_id": doc_id,
            "file_id": file_id,
            "filename": file.filename,
            "text": text,
            "text_length": len(text),
            "paragraphs": doc_processor.split_into_paragraphs(text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.post("/summarize")
async def summarize_text(request: SummaryRequest):
    """
    Summarize text or document content
    
    Args:
        request: SummaryRequest with text and optional parameters
    """
    try:
        if not request.text or len(request.text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Text is too short to summarize")
        
        summary = nlp_processor.summarize_text(
            request.text,
            max_length=request.max_length,
            min_length=request.min_length
        )
        
        return {
            "original_length": len(request.text),
            "summary_length": len(summary),
            "summary": summary,
            "compression_ratio": round(len(summary) / len(request.text), 2) if request.text else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing text: {str(e)}")


@app.post("/search")
async def search_keywords(request: SearchRequest):
    """
    Search for paragraphs/lines related to keywords
    
    Args:
        request: SearchRequest with text, keywords, and optional parameters
    """
    try:
        if not request.text or not request.keywords:
            raise HTTPException(status_code=400, detail="Text and keywords are required")
        
        results = nlp_processor.search_by_keywords(
            request.text,
            request.keywords,
            top_k=request.top_k,
            use_semantic=request.use_semantic
        )
        
        return {
            "keywords": request.keywords,
            "total_results": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")


@app.post("/process_document")
async def process_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    user_email: Optional[str] = Form(None),
    action: str = Form("summarize")  # "summarize", "search", or "both"
):
    """
    Process a document: upload, extract text, summarize, and save to database
    
    Args:
        file: Optional uploaded file
        text: Optional direct text input
        user_email: Optional user email for tracking
        action: Action to perform (summarize, search, both)
    """
    try:
        file_id = None
        filename = None
        file_type = None
        file_size = None
        
        # Get text from file or direct input
        if file:
            file_id = str(uuid.uuid4())
            file_ext = Path(file.filename).suffix
            filename = file.filename
            file_type = file_ext
            file_path = UPLOAD_DIR / f"{file_id}{file_ext}"
            
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            file_size = len(content)
            extracted_text = await doc_processor.extract_text(str(file_path), file_ext)
        elif text:
            extracted_text = text
            file_id = str(uuid.uuid4())
        else:
            raise HTTPException(status_code=400, detail="Either file or text must be provided")
        
        # Generate summary
        summary = nlp_processor.summarize_text(extracted_text)
        
        # Save to database
        doc_id = await db.save_document(
            filename=filename or "text_input.txt",
            file_id=file_id,
            text=extracted_text,
            summary=summary,
            user_email=user_email,
            file_type=file_type,
            file_size=file_size
        )
        
        result = {
            "document_id": doc_id,
            "file_id": file_id,
            "text": extracted_text,
            "text_length": len(extracted_text),
            "summary": summary,
            "summary_length": len(summary),
            "compression_ratio": round(len(summary) / len(extracted_text), 2) if extracted_text else 0
        }
        
        # Perform additional actions if requested
        if action in ["search", "both"]:
            result["paragraphs"] = doc_processor.split_into_paragraphs(extracted_text)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")


@app.post("/analyze")
async def analyze_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    keywords: Optional[str] = Form(None),
    summarize: bool = Form(True),
    search: bool = Form(False)
):
    """
    Comprehensive document analysis endpoint
    
    Performs:
    - Text extraction
    - Summarization (if requested)
    - Keyword search (if keywords provided)
    """
    try:
        # Extract text
        if file:
            file_id = str(uuid.uuid4())
            file_ext = Path(file.filename).suffix
            file_path = UPLOAD_DIR / f"{file_id}{file_ext}"
            
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            extracted_text = await doc_processor.extract_text(str(file_path), file_ext)
        elif text:
            extracted_text = text
        else:
            raise HTTPException(status_code=400, detail="Either file or text must be provided")
        
        result = {
            "text_length": len(extracted_text),
            "paragraph_count": len(doc_processor.split_into_paragraphs(extracted_text))
        }
        
        # Summarize if requested
        if summarize:
            result["summary"] = nlp_processor.summarize_text(extracted_text)
            result["summary_length"] = len(result["summary"])
        
        # Search if keywords provided
        if search and keywords:
            result["search_results"] = nlp_processor.search_by_keywords(
                extracted_text,
                keywords,
                top_k=10
            )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")


@app.get("/documents")
async def get_user_documents(user_email: Optional[str] = None, limit: int = 50):
    """
    Get all documents for a user
    
    Args:
        user_email: User email to filter documents
        limit: Maximum number of documents to return
    """
    try:
        if not user_email:
            return {"documents": []}
        
        documents = await db.get_user_documents(user_email, limit)
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching documents: {str(e)}")


@app.get("/documents/{document_id}")
async def get_document(document_id: str):
    """
    Get a specific document by ID
    
    Args:
        document_id: MongoDB document ID
    """
    try:
        document = await db.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching document: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

