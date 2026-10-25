"""
Document Processing Module
Handles extraction of text from various document formats
"""
import os
from typing import Optional
from pathlib import Path
from io import BytesIO
import PyPDF2
from docx import Document
import aiofiles


class DocumentProcessor:
    """Processes various document formats and extracts text"""
    
    @staticmethod
    async def extract_text(file_path: str, file_type: Optional[str] = None) -> str:
        """
        Extract text from a document file
        
        Args:
            file_path: Path to the document file
            file_type: Optional file type hint (pdf, docx, txt)
            
        Returns:
            Extracted text content
        """
        if file_type is None:
            file_type = Path(file_path).suffix.lower()
        
        if file_type == '.pdf':
            return await DocumentProcessor._extract_from_pdf(file_path)
        elif file_type == '.docx':
            return await DocumentProcessor._extract_from_docx(file_path)
        elif file_type == '.txt':
            return await DocumentProcessor._extract_from_txt(file_path)
        else:
            # Try to infer from content
            return await DocumentProcessor._extract_from_txt(file_path)
    
    @staticmethod
    async def _extract_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        text_content = []
        try:
            async with aiofiles.open(file_path, 'rb') as file:
                pdf_bytes = await file.read()
            # PyPDF2 can work with bytes directly
            pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    text_content.append(text)
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")
        
        return '\n\n'.join(text_content)
    
    @staticmethod
    async def _extract_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
            return '\n\n'.join(paragraphs)
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")
    
    @staticmethod
    async def _extract_from_txt(file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                return await file.read()
        except UnicodeDecodeError:
            # Try with different encoding
            async with aiofiles.open(file_path, 'r', encoding='latin-1') as file:
                return await file.read()
        except Exception as e:
            raise ValueError(f"Error reading text file: {str(e)}")
    
    @staticmethod
    def split_into_paragraphs(text: str) -> list:
        """
        Split text into paragraphs for better search and summarization
        
        Args:
            text: Input text
            
        Returns:
            List of paragraphs
        """
        # Split by double newlines or single newlines with some heuristics
        paragraphs = []
        current_para = []
        
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                if current_para:
                    paragraphs.append(' '.join(current_para))
                    current_para = []
            else:
                current_para.append(line)
        
        if current_para:
            paragraphs.append(' '.join(current_para))
        
        return [p for p in paragraphs if p]  # Remove empty paragraphs

