# Synapse - Document Summarization Web Application

A fully functional web application for uploading documents and getting AI-powered summaries. Built with React frontend and Python FastAPI backend, integrated with MongoDB.

## 🚀 Quick Start

### Single Command Startup (Recommended)

The easiest way to start everything with one command:

**Windows (Batch):**
```bash
start.bat
```

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
./start.sh
```

**Node.js (Cross-platform):**
```bash
node start.js
```

**Or using npm from root:**
```bash
npm start
```

**Or from SYNAPSE directory:**
```bash
cd SYNAPSE
npm run start:all
```

All scripts will:
- ✅ Check for Python and Node.js
- ✅ Create virtual environment if needed
- ✅ Install dependencies automatically
- ✅ Start both backend and frontend servers
- ✅ Handle cleanup on exit

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd summarize
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd SYNAPSE
npm install
npm start
```

## 📋 Prerequisites

- **Python 3.8+** with pip
- **Node.js 14+** with npm
- **MongoDB Atlas** account and connection string (optional; required for database persistence)

## ✨ Features

- 📄 **Multi-format Support**: Upload PDF, DOCX, and TXT files
- 🤖 **AI Summarization**: Automatic intelligent document summarization
- 💾 **MongoDB Storage**: All documents and summaries saved to database
- 👤 **User Tracking**: Track documents by user email
- 🎨 **Modern UI**: Beautiful, responsive interface with dark/light themes
- ⚡ **Real-time Processing**: Live status updates during document processing

## 🏗️ Project Structure

```
SYNAPSE/
├── start.bat              # Windows batch script
├── start.ps1              # PowerShell script
├── start.js               # Node.js cross-platform script
├── SYNAPSE/               # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CTA.js           # Document upload
│   │   │   └── SummaryDisplay.js # Summary display
│   │   └── App.js
│   └── package.json
└── summarize/             # Python Backend
    ├── main.py           # FastAPI server
    ├── database.py       # MongoDB integration
    ├── document_processor.py
    ├── nlp_processor.py
    └── requirements.txt
```

## 🔧 Configuration

### MongoDB

Set the MongoDB connection string in the `MONGODB_URL` environment variable to enable database persistence. Do not commit real credentials.

**PowerShell:**
```powershell
$env:MONGODB_URL = "mongodb+srv://<username>:<password>@<cluster>/<database>"
```

**Linux/macOS:**
```bash
export MONGODB_URL="mongodb+srv://<username>:<password>@<cluster>/<database>"
```

### API URL

The frontend connects to the backend at `http://localhost:8000` by default. To change it, create a `.env` file in the `SYNAPSE` directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## 📡 API Endpoints

- `POST /process_document` - Upload and process document (main endpoint)
- `POST /upload` - Upload document and extract text
- `POST /summarize` - Summarize text directly
- `GET /documents?user_email=...` - Get user's documents
- `GET /documents/{id}` - Get specific document
- `GET /docs` - API documentation (Swagger UI)

## 🎯 Usage

1. **Start the application** using one of the startup scripts
2. **Open browser** to `http://localhost:3000`
3. **Upload documents** by dragging and dropping or clicking to select
4. **View summaries** - summaries appear automatically after processing
5. **All data is saved** to MongoDB for future retrieval

## 🛠️ Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check if port 8000 is available
- Verify MongoDB connection (check internet connection)

### Frontend won't start
- Ensure Node.js 14+ is installed
- Check if port 3000 is available
- Run `npm install` in the SYNAPSE directory

### Documents not processing
- Check backend is running on port 8000
- Verify file format (PDF, DOCX, TXT only)
- Check browser console for errors

### MongoDB connection errors
- Verify internet connection
- Check MongoDB Atlas IP whitelist
- Ensure connection string is correct

## 📦 Dependencies

### Backend
- FastAPI
- Motor (async MongoDB driver)
- PyPDF2, python-docx
- sentence-transformers
- scikit-learn

### Frontend
- React 18
- Framer Motion
- React Scripts

## 🔐 Security Notes

- MongoDB connection string is hardcoded for development
- For production, use environment variables
- Implement proper authentication
- Add CORS restrictions for production

## 📝 License

This project is part of the Synapse application suite.

## 🤝 Support

For issues or questions:
1. Check the API docs at `http://localhost:8000/docs`
2. Review the setup guide in `SETUP.md`
3. Check implementation details in `IMPLEMENTATION_SUMMARY.md`

---

**Made with ❤️ for document processing and summarization**

