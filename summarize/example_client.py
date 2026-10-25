"""
Example client code for testing the Legal Document Analyzer API
"""
import requests
import json

BASE_URL = "http://localhost:8000"


def test_upload_document(file_path: str):
    """Test document upload endpoint"""
    print(f"\n📄 Uploading document: {file_path}")
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Extracted {data['text_length']} characters")
        print(f"   Paragraphs: {len(data['paragraphs'])}")
        return data['text']
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None


def test_summarize(text: str):
    """Test summarization endpoint"""
    print("\n📝 Summarizing text...")
    
    payload = {
        "text": text,
        "max_length": 200,
        "min_length": 50
    }
    
    response = requests.post(
        f"{BASE_URL}/summarize",
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Summary ({data['summary_length']} chars):")
        print(f"   {data['summary']}")
        return data['summary']
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None


def test_search(text: str, keywords: str):
    """Test keyword search endpoint"""
    print(f"\n🔍 Searching for keywords: {keywords}")
    
    payload = {
        "text": text,
        "keywords": keywords,
        "top_k": 5,
        "use_semantic": True
    }
    
    response = requests.post(
        f"{BASE_URL}/search",
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Found {data['total_results']} results:")
        for i, result in enumerate(data['results'], 1):
            print(f"\n   Result {i} (Score: {result['relevance_score']:.3f}):")
            print(f"   {result['paragraph'][:200]}...")
        return data['results']
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None


def test_analyze_endpoint(file_path: str, keywords: str = None):
    """Test comprehensive analyze endpoint"""
    print(f"\n🔬 Comprehensive Analysis: {file_path}")
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        data = {
            'summarize': 'true',
            'search': 'true' if keywords else 'false'
        }
        if keywords:
            data['keywords'] = keywords
        
        response = requests.post(
            f"{BASE_URL}/analyze",
            files=files,
            data=data
        )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Analysis complete!")
        print(f"   Text length: {result['text_length']} chars")
        print(f"   Paragraphs: {result['paragraph_count']}")
        
        if 'summary' in result:
            print(f"\n📝 Summary ({result['summary_length']} chars):")
            print(f"   {result['summary']}")
        
        if 'search_results' in result:
            print(f"\n🔍 Search Results ({len(result['search_results'])} found):")
            for i, res in enumerate(result['search_results'][:3], 1):
                print(f"   {i}. {res['paragraph'][:150]}...")
        
        return result
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("Legal Document Analyzer - Example Client")
    print("=" * 60)
    
    # Test with direct text input
    sample_text = """
    This Agreement ("Agreement") is entered into on this date between Party A and Party B.
    The terms and conditions set forth herein govern the relationship between the parties.
    Party A agrees to provide services as described in Schedule A attached hereto.
    Party B agrees to compensate Party A according to the payment terms specified in Section 3.
    Both parties acknowledge that this Agreement contains confidential information.
    Any breach of confidentiality shall result in liability for damages.
    This Agreement shall be governed by the laws of the State of California.
    """
    
    print("\n" + "=" * 60)
    print("TEST 1: Direct Text Summarization")
    print("=" * 60)
    summary = test_summarize(sample_text)
    
    print("\n" + "=" * 60)
    print("TEST 2: Keyword Search")
    print("=" * 60)
    results = test_search(sample_text, "liability, agreement, compensation")
    
    print("\n" + "=" * 60)
    print("TEST 3: Document Upload (if you have a test file)")
    print("=" * 60)
    print("To test file upload, create a test document and uncomment:")
    # text = test_upload_document("test_document.pdf")
    # if text:
    #     test_summarize(text)
    #     test_search(text, "keywords here")
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)
    print("\n💡 Tip: Start the server with 'python main.py' before running tests")

