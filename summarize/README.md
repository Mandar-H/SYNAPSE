# Synapse Document Analyzer

A powerful, private, and secure Python-based NLP solution for analyzing and summarizing documents. This backend provides intelligent summarization and keyword-based search capabilities, integrated with MongoDB for data persistence, designed to be integrated with web applications.

## Features

- **Multi-format Document Support**: Process PDF, DOCX, and TXT files
- **Intelligent Summarization**: Extract key information from lengthy documents
- **MongoDB Integration**: All documents and summaries are saved to MongoDB
- **Semantic & Exact Keyword Search**: Find relevant paragraphs using semantic understanding or exact matching
- **RESTful API**: FastAPI-based backend ready for web application integration
- **Privacy-Focused**: All processing happens locally - no external API calls
- **Secure**: Private document processing with no data leakage
- **User Tracking**: Documents are associated with user emails for easy retrieval

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. **Clone or navigate to the project directory**

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

   Note: The first run will download NLP models (~100MB), which may take a few minutes.

4. **MongoDB Configuration**
   
   Set the `MONGODB_URL` environment variable to enable MongoDB persistence. Do not commit real credentials:
   ```bash
   export MONGODB_URL="mongodb+srv://<username>:<password>@<cluster>/<database>"
   ```
   
   The database will automatically create collections (`documents` and `users`) on first use.

## Usage

### Starting the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### API Endpoints

#### 1. Upload Document
**POST** `/upload`

Upload a document file (PDF, DOCX, TXT) and extract text.

```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@document.pdf"
```

#### 2. Summarize Text
**POST** `/summarize`

Summarize text or document content.

```bash
curl -X POST "http://localhost:8000/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your legal document text here...",
    "max_length": 150,
    "min_length": 30
  }'
```

#### 3. Search by Keywords
**POST** `/search`

Find paragraphs related to specific keywords.

```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your document text...",
    "keywords": "liability, contract, terms",
    "top_k": 5,
    "use_semantic": true
  }'
```

#### 4. Process Document
**POST** `/process_document`

Upload a document and extract text (with optional summarization).

```bash
curl -X POST "http://localhost:8000/process_document" \
  -F "file=@document.pdf" \
  -F "action=both"
```

#### 5. Comprehensive Analysis
**POST** `/analyze`

Complete document analysis with summarization and search.

```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@document.pdf" \
  -F "summarize=true" \
  -F "search=true" \
  -F "keywords=liability, damages"
```

## Integration with Web Applications

### Example: JavaScript/Fetch API

```javascript
// Upload and analyze a document
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('summarize', 'true');
formData.append('keywords', 'liability, contract');

const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.summary);
console.log(result.search_results);
```

### Example: Python Client

```python
import requests

# Upload document
with open('document.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/upload',
        files={'file': f}
    )
    data = response.json()
    text = data['text']

# Summarize
summary_response = requests.post(
    'http://localhost:8000/summarize',
    json={'text': text}
)
summary = summary_response.json()['summary']

# Search
search_response = requests.post(
    'http://localhost:8000/search',
    json={
        'text': text,
        'keywords': 'liability, contract',
        'top_k': 5
    }
)
results = search_response.json()['results']
```

## Architecture

### Components

1. **document_processor.py**: Handles text extraction from various file formats
2. **nlp_processor.py**: Provides summarization and semantic search capabilities
3. **main.py**: FastAPI application with REST endpoints

### NLP Models

- **Embeddings**: `all-MiniLM-L6-v2` (Sentence Transformers) for semantic search
- **Summarization**: Extractive summarization based on sentence importance scoring

## Security & Privacy

- All processing happens locally on your server
- No external API calls or data transmission
- Documents are stored temporarily (can be configured for immediate deletion)
- CORS can be configured to restrict access to specific domains

## Configuration

### CORS Settings

Edit `main.py` to restrict CORS to your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### File Storage

By default, uploaded files are stored in the `uploads/` directory. For production:
- Implement proper file cleanup
- Use cloud storage (S3, Azure Blob, etc.)
- Add file size limits
- Implement authentication/authorization

## Performance Tips

1. **Model Loading**: Models are loaded lazily on first use
2. **Caching**: Consider implementing caching for frequently accessed documents
3. **Async Processing**: For large documents, consider background task processing
4. **GPU**: If available, PyTorch will automatically use GPU for faster processing

## Troubleshooting

### Model Download Issues
If models fail to download, they will be cached in `~/.cache/huggingface/`. Ensure you have internet access on first run.

### Memory Issues
For very large documents, consider:
- Processing in chunks
- Using lighter models
- Increasing system memory

### File Format Issues
Ensure files are not corrupted and are in supported formats (PDF, DOCX, TXT).

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions, please check the API documentation at `/docs` endpoint or review the code comments.

