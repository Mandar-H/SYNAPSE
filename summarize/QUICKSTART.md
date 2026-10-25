# Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   python main.py
   ```

3. **Access the API:**
   - API Base URL: `http://localhost:8000`
   - Interactive Docs: `http://localhost:8000/docs`

## Basic Usage Examples

### 1. Upload and Analyze a Document

**Using cURL:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@your_document.pdf" \
  -F "summarize=true" \
  -F "search=true" \
  -F "keywords=liability, contract, terms"
```

**Using Python:**
```python
import requests

with open('document.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/analyze',
        files={'file': f},
        data={
            'summarize': 'true',
            'search': 'true',
            'keywords': 'liability, contract'
        }
    )
    result = response.json()
    print(result['summary'])
    print(result['search_results'])
```

**Using JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('summarize', 'true');
formData.append('keywords', 'liability, contract');

fetch('http://localhost:8000/analyze', {
    method: 'POST',
    body: formData
})
.then(res => res.json())
.then(data => {
    console.log('Summary:', data.summary);
    console.log('Search Results:', data.search_results);
});
```

### 2. Summarize Text Directly

```python
import requests

response = requests.post(
    'http://localhost:8000/summarize',
    json={
        'text': 'Your long legal document text here...',
        'max_length': 200,
        'min_length': 50
    }
)
print(response.json()['summary'])
```

### 3. Search for Keywords

```python
import requests

response = requests.post(
    'http://localhost:8000/search',
    json={
        'text': 'Your document text...',
        'keywords': 'liability, damages, breach',
        'top_k': 5,
        'use_semantic': True
    }
)

for result in response.json()['results']:
    print(f"Score: {result['relevance_score']}")
    print(f"Text: {result['paragraph']}\n")
```

## Web Application Integration

### Frontend Example (React)

```jsx
import React, { useState } from 'react';

function DocumentAnalyzer() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [keywords, setKeywords] = useState('');

    const handleAnalyze = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('summarize', 'true');
        formData.append('search', 'true');
        formData.append('keywords', keywords);

        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        setSummary(data.summary);
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input 
                type="text" 
                placeholder="Keywords (comma-separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
            <button onClick={handleAnalyze}>Analyze</button>
            <div>{summary}</div>
        </div>
    );
}
```

## Testing

Run the example client:
```bash
python example_client.py
```

Make sure the server is running first!

## Troubleshooting

- **Port already in use?** Change the port in `main.py`: `uvicorn.run(app, host="0.0.0.0", port=8001)`
- **Model download slow?** First run downloads ~100MB of models. Be patient!
- **CORS errors?** Update CORS settings in `main.py` to allow your frontend domain

