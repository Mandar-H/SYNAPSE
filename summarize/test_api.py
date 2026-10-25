"""
Quick test script for the Legal Document Analyzer API
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("\n" + "="*60)
    print("Testing Legal Document Analyzer API")
    print("="*60)
    
    # Wait for server to be ready
    print("\nWaiting for server to start...")
    time.sleep(2)
    
    # Test 1: Root endpoint
    print("\n[1] Testing Root Endpoint (GET /)")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Test 2: Summarization
    print("\n[2] Testing Summarization (POST /summarize)")
    sample_text = """This Service Agreement (the 'Agreement') is entered into on January 1, 2024, 
between ABC Corporation, a Delaware corporation ('Company'), and XYZ Services LLC, 
a California limited liability company ('Service Provider'). 

WHEREAS, Company desires to engage Service Provider to provide certain consulting services; 
and WHEREAS, Service Provider is willing to provide such services subject to the terms 
and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SERVICES. Service Provider agrees to provide consulting services as described in Exhibit A.

2. COMPENSATION. Company shall pay Service Provider the sum of $50,000 per month for services rendered.

3. TERM. This Agreement shall commence on January 1, 2024 and continue for a period of twelve (12) months 
unless terminated earlier in accordance with Section 5.

4. CONFIDENTIALITY. Both parties acknowledge that they may receive confidential information 
and agree to maintain strict confidentiality.

5. TERMINATION. Either party may terminate this Agreement with thirty (30) days written notice.

6. GOVERNING LAW. This Agreement shall be governed by the laws of the State of California."""
    
    try:
        payload = {
            "text": sample_text,
            "max_length": 200,
            "min_length": 50
        }
        response = requests.post(f"{BASE_URL}/summarize", json=payload)
        result = response.json()
        print(f"   Status: {response.status_code}")
        print(f"   Original Length: {result['original_length']} characters")
        print(f"   Summary Length: {result['summary_length']} characters")
        print(f"   Compression Ratio: {result['compression_ratio']}")
        print(f"\n   Summary:")
        print(f"   {result['summary']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Keyword Search
    print("\n[3] Testing Keyword Search (POST /search)")
    try:
        payload = {
            "text": sample_text,
            "keywords": "compensation, termination, confidentiality",
            "top_k": 3,
            "use_semantic": False
        }
        response = requests.post(f"{BASE_URL}/search", json=payload)
        result = response.json()
        print(f"   Status: {response.status_code}")
        print(f"   Keywords: {result['keywords']}")
        print(f"   Total Results: {result['total_results']}")
        print(f"\n   Search Results:")
        for i, res in enumerate(result['results'], 1):
            print(f"\n   Result {i} (Score: {res['relevance_score']:.2f}):")
            print(f"   {res['paragraph'][:150]}...")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "="*60)
    print("API Testing Complete!")
    print("="*60)
    print(f"\nAccess the interactive API docs at: {BASE_URL}/docs")
    print("\n")

if __name__ == "__main__":
    test_api()

