"""
NLP Processing Module
Handles summarization and keyword-based search
"""
from typing import List, Dict, Tuple
import re

# Optional imports for advanced features
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    SentenceTransformer = None

try:
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    cosine_similarity = None

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False
    np = None

# Try to import HuggingFace transformers for abstractive summarization
try:
    from transformers import pipeline, AutoTokenizer
    TRANSFORMERS_AVAILABLE = True
except Exception:
    TRANSFORMERS_AVAILABLE = False
    pipeline = None
    AutoTokenizer = None


class NLPProcessor:
    """Handles NLP tasks: summarization and semantic search"""
    
    def __init__(self):
        """Initialize NLP models"""
        # Using a lightweight model for embeddings (good for semantic search)
        # For production, you might want to use a larger model
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            try:
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                self.initialized = False
            except Exception:
                self.embedding_model = None
                self.initialized = False
        else:
            self.embedding_model = None
            self.initialized = False
    
    def initialize(self):
        """Lazy initialization of models"""
        if not self.initialized and self.embedding_model:
            try:
                # Load the model (this happens on first use)
                _ = self.embedding_model.encode("test")
                self.initialized = True
            except Exception:
                self.initialized = False
    
    def summarize_text(self, text: str, max_length: int = 150, min_length: int = 30) -> str:
        """
        Summarize text using extractive summarization
        
        Args:
            text: Input text to summarize
            max_length: Maximum length of summary
            min_length: Minimum length of summary
            
        Returns:
            Summarized text
        """
        if not text or len(text.strip()) < min_length:
            return text

        # Prefer transformer-based abstractive summarization when available
        if TRANSFORMERS_AVAILABLE:
            try:
                # Use a lightweight summarization model for speed
                model_name = 'sshleifer/distilbart-cnn-12-6'

                # Initialize tokenizer and pipeline lazily
                if not hasattr(self, 'summarizer') or self.summarizer is None:
                    try:
                        tokenizer = AutoTokenizer.from_pretrained(model_name)
                        self.summarizer = pipeline('summarization', model=model_name, tokenizer=tokenizer)
                    except Exception:
                        # Fallback if model download fails
                        self.summarizer = None

                if self.summarizer:
                    # Chunk text into manageable sizes to avoid tokenizer limits
                    chunks = []
                    current = []
                    curr_len = 0
                    # Use character-based heuristic (approx tokens)
                    max_chunk_chars = 1000
                    for para in text.split('\n'):
                        p = para.strip()
                        if not p:
                            continue
                        if curr_len + len(p) + 1 <= max_chunk_chars:
                            current.append(p)
                            curr_len += len(p) + 1
                        else:
                            chunks.append('\n'.join(current))
                            current = [p]
                            curr_len = len(p) + 1

                    if current:
                        chunks.append('\n'.join(current))

                    # Summarize each chunk
                    chunk_summaries = []
                    for c in chunks:
                        try:
                            out = self.summarizer(c, max_length=max_length, min_length=min_length, do_sample=False)
                            if isinstance(out, list) and len(out) > 0 and 'summary_text' in out[0]:
                                chunk_summaries.append(out[0]['summary_text'].strip())
                            elif isinstance(out, list) and len(out) > 0 and isinstance(out[0], str):
                                chunk_summaries.append(out[0].strip())
                        except Exception:
                            # If summarization fails for chunk, fall back to extractive snippet
                            chunk_summaries.append(c[:max_length])

                    # If multiple chunk summaries, summarize them together for cohesion
                    if len(chunk_summaries) > 1:
                        combined = '\n'.join(chunk_summaries)
                        try:
                            out = self.summarizer(combined, max_length=max_length, min_length=min_length, do_sample=False)
                            if isinstance(out, list) and len(out) > 0 and 'summary_text' in out[0]:
                                return out[0]['summary_text'].strip()
                        except Exception:
                            # fallback: join chunk summaries
                            return ' '.join(chunk_summaries).strip()

                    return ' '.join(chunk_summaries).strip()
            except Exception:
                # If transformers usage fails, gracefully fall through to extractive method
                pass

        # ----- Fallback: extractive summarization -----
        # Split into sentences
        sentences = self._split_into_sentences(text)

        if len(sentences) <= 3:
            return text

        # Use extractive summarization based on sentence importance
        # Score sentences by length and keyword frequency
        sentence_scores = []
        words = text.lower().split()
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1

        for sentence in sentences:
            score = 0
            sentence_words = sentence.lower().split()
            # Score based on word frequency and sentence length
            for word in sentence_words:
                if word in word_freq:
                    score += word_freq[word]
            # Prefer longer sentences (but not too long)
            score += min(len(sentence_words), 20)
            sentence_scores.append((score, sentence))

        # Sort by score and take top sentences
        sentence_scores.sort(reverse=True, key=lambda x: x[0])

        # Select sentences until we reach max_length
        summary_sentences = []
        current_length = 0

        for _, sentence in sentence_scores:
            if current_length + len(sentence) <= max_length:
                summary_sentences.append(sentence)
                current_length += len(sentence)
            else:
                break

        # If we have too few sentences, add more
        if len(summary_sentences) < 2 and len(sentences) > 2:
            summary_sentences = sentence_scores[:3]
            summary_sentences = [s[1] for s in summary_sentences]

        # Maintain original order
        ordered_summary = []
        for sentence in sentences:
            if sentence in summary_sentences:
                ordered_summary.append(sentence)

        summary = ' '.join(ordered_summary)

        # Ensure minimum length
        if len(summary) < min_length and len(text) > min_length:
            # Add more sentences if needed
            for _, sentence in sentence_scores:
                if sentence not in ordered_summary:
                    summary += ' ' + sentence
                    if len(summary) >= min_length:
                        break

        return summary.strip()
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting (can be improved with NLTK)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def search_by_keywords(
        self, 
        text: str, 
        keywords: str, 
        top_k: int = 5,
        use_semantic: bool = True
    ) -> List[Dict[str, any]]:
        """
        Search for paragraphs/lines related to keywords
        
        Args:
            text: Document text
            keywords: Search keywords (comma-separated or single string)
            top_k: Number of results to return
            use_semantic: Use semantic search (True) or exact match (False)
            
        Returns:
            List of dictionaries with 'paragraph', 'relevance_score', and 'index'
        """
        if not text or not keywords:
            return []
        
        # Split into paragraphs
        paragraphs = self._split_into_paragraphs(text)
        
        if not paragraphs:
            return []
        
        # Clean keywords
        keyword_list = [k.strip().lower() for k in keywords.split(',')]
        keyword_list = [k for k in keyword_list if k]
        
        if not keyword_list:
            return []
        
        results = []
        
        if use_semantic and SENTENCE_TRANSFORMERS_AVAILABLE and self.embedding_model and SKLEARN_AVAILABLE and NUMPY_AVAILABLE:
            try:
                # Semantic search using embeddings
                self.initialize()
                
                # Encode query
                query_text = ' '.join(keyword_list)
                query_embedding = self.embedding_model.encode([query_text])
                
                # Encode paragraphs
                paragraph_embeddings = self.embedding_model.encode(paragraphs)
                
                # Calculate similarity
                similarities = cosine_similarity(query_embedding, paragraph_embeddings)[0]
                
                # Get top-k results
                top_indices = np.argsort(similarities)[::-1][:top_k]
                
                for idx in top_indices:
                    if similarities[idx] > 0.1:  # Threshold for relevance
                        results.append({
                            'paragraph': paragraphs[idx],
                            'relevance_score': float(similarities[idx]),
                            'index': int(idx),
                            'match_type': 'semantic'
                        })
            except Exception:
                # Fall back to exact matching if semantic search fails
                use_semantic = False
        else:
            # Exact keyword matching
            for idx, paragraph in enumerate(paragraphs):
                paragraph_lower = paragraph.lower()
                matches = sum(1 for keyword in keyword_list if keyword in paragraph_lower)
                
                if matches > 0:
                    relevance = matches / len(keyword_list)
                    results.append({
                        'paragraph': paragraph,
                        'relevance_score': relevance,
                        'index': int(idx),
                        'match_type': 'exact',
                        'matched_keywords': [k for k in keyword_list if k in paragraph_lower]
                    })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return results[:top_k]
    
    def _split_into_paragraphs(self, text: str) -> List[str]:
        """Split text into paragraphs"""
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
        
        return [p for p in paragraphs if p]

