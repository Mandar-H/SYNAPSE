# Testing the Application

## Quick Test Checklist

### 1. Start the Application
- Run `START.bat` or `start.bat`
- Wait for both servers to start (30-60 seconds)
- Check that two command windows are open:
  - Backend window showing "Application startup complete"
  - Frontend window showing "Compiled successfully"

### 2. Access the Application
- Open browser to: `http://localhost:3000`
- You should see the Synapse homepage

### 3. Test Document Upload
- Scroll to the "Upload & Summarize Documents" section
- Click or drag & drop a PDF, DOCX, or TXT file
- Watch for:
  - File appears in the list
  - Processing indicator (⏳)
  - Summary appears below the file list

### 4. Verify Backend Connection
- Open: `http://localhost:8000/docs`
- You should see the API documentation (Swagger UI)

### 5. Test MongoDB Connection
- Check backend window for: "✓ Connected to MongoDB: synapse_db"
- If you see "⚠ Warning: MongoDB connection failed", the app will still work but won't save documents

## Common Issues & Solutions

### Backend won't start
**Problem**: Python errors or missing dependencies
**Solution**: 
```bash
cd summarize
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend won't start
**Problem**: Node.js errors or missing packages
**Solution**:
```bash
cd SYNAPSE
npm install
npm start
```

### "Cannot connect to backend" error
**Problem**: Backend not running or wrong port
**Solution**: 
- Check backend is running on port 8000
- Check firewall isn't blocking port 8000
- Verify `http://localhost:8000` is accessible

### MongoDB connection fails
**Problem**: Internet connection or MongoDB Atlas settings
**Solution**:
- Check internet connection
- Verify MongoDB Atlas allows connections from your IP
- App will still work without database (just won't save documents)

### File upload fails
**Problem**: File too large or unsupported format
**Solution**:
- Use PDF, DOCX, or TXT files only
- Try smaller files first (< 10MB)
- Check browser console for errors

## Expected Behavior

### Successful Upload Flow:
1. User selects/drops file
2. File appears in list with 📄 icon
3. Icon changes to ⏳ (processing)
4. Backend extracts text and generates summary
5. Icon changes to ✅ (complete)
6. Summary box appears below with the summary text

### Database Status:
- If connected: Documents saved to MongoDB
- If not connected: App works but documents not saved (warning in backend console)

## Performance Notes

- First upload may be slow (NLP models loading)
- Subsequent uploads are faster
- Large files (>5MB) may take 30-60 seconds
- Summary quality depends on document length and content

## Test Files

Create a simple test file (`test.txt`):
```
This is a test document for the Synapse application. 
The application should be able to process this document and generate a summary.
This is a simple test to verify that the upload and summarization features are working correctly.
```

Upload this file to verify the system is working.

