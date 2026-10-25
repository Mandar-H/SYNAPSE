# Synapse - Complete Setup Guide

This guide will help you set up and run the complete Synapse application with document upload and summarization features.

## Project Structure

```
SYNAPSE/
├── SYNAPSE/              # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CTA.js           # Document upload component
│   │   │   ├── SummaryDisplay.js # Summary display component
│   │   │   └── ...
│   │   └── App.js
│   └── package.json
└── summarize/            # Python FastAPI Backend
    ├── main.py          # API endpoints
    ├── database.py      # MongoDB integration
    ├── document_processor.py
    ├── nlp_processor.py
    └── requirements.txt
```

## Prerequisites

- **Node.js** (v14 or higher) and npm
- **Python** (3.8 or higher) and pip
- **MongoDB Atlas** account (or local MongoDB instance)

## Setup Instructions

### 1. Backend Setup (Python/FastAPI)

1. Navigate to the `summarize` directory:
   ```bash
   cd summarize
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Linux/Mac
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. MongoDB is already configured with the provided connection string. The database will be created automatically on first run.

5. Start the backend server:
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### 2. Frontend Setup (React)

1. Navigate to the `SYNAPSE` directory:
   ```bash
   cd SYNAPSE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file to configure the API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```
   
   If not set, it defaults to `http://localhost:8000`

4. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

1. **Start the Backend**: Make sure the Python backend is running on port 8000
2. **Start the Frontend**: Make sure the React app is running on port 3000
3. **Open the Application**: Navigate to `http://localhost:3000` in your browser
4. **Upload Documents**: 
   - Drag and drop files (PDF, DOCX, TXT) or click to upload
   - The system will automatically process and summarize the document
   - Summaries are displayed below the upload area
5. **View Summaries**: Each uploaded document will show its summary once processing is complete

## API Endpoints

### Main Endpoints

- `POST /process_document` - Upload and process a document (returns summary)
- `POST /upload` - Upload a document and extract text
- `POST /summarize` - Summarize text directly
- `GET /documents?user_email=...` - Get all documents for a user
- `GET /documents/{document_id}` - Get a specific document

### Example API Call

```bash
curl -X POST "http://localhost:8000/process_document" \
  -F "file=@document.pdf" \
  -F "user_email=user@example.com" \
  -F "action=summarize"
```

## Features

- ✅ Document upload (PDF, DOCX, TXT)
- ✅ Automatic text extraction
- ✅ AI-powered summarization
- ✅ MongoDB storage for documents and summaries
- ✅ User tracking (by email)
- ✅ Real-time processing status
- ✅ Beautiful, responsive UI
- ✅ Dark/Light theme support

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**:
   - Check your internet connection
   - Verify the MongoDB connection string in `database.py`
   - Ensure MongoDB Atlas allows connections from your IP

2. **Model Download Issues**:
   - The first run downloads NLP models (~100MB)
   - Ensure you have a stable internet connection
   - Check available disk space

3. **Port Already in Use**:
   - Change the port in `main.py` or use: `uvicorn main:app --port 8001`

### Frontend Issues

1. **API Connection Error**:
   - Ensure the backend is running on port 8000
   - Check the `REACT_APP_API_URL` environment variable
   - Check browser console for CORS errors

2. **File Upload Fails**:
   - Ensure file is PDF, DOCX, or TXT format
   - Check file size (very large files may timeout)
   - Check backend logs for errors

## Database Schema

### Documents Collection

```javascript
{
  "_id": ObjectId,
  "file_id": String,
  "filename": String,
  "text": String,
  "text_length": Number,
  "summary": String,
  "summary_length": Number,
  "user_email": String,
  "file_type": String,
  "file_size": Number,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

## Production Deployment

### Backend

1. Use a production ASGI server:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

2. Set environment variables:
   ```bash
   export MONGODB_URL="your_production_mongodb_url"
   ```

3. Configure CORS for your frontend domain in `main.py`

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```

2. Serve the `build` folder with a web server (nginx, Apache, etc.)

## Support

For issues or questions, check the API documentation at `http://localhost:8000/docs` when the backend is running.

