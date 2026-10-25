import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SummaryDisplay from './SummaryDisplay';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CTA = ({ theme, user }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [processingFiles, setProcessingFiles] = useState(new Set());
  const [summaries, setSummaries] = useState({});
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleFiles = async (newFiles) => {
    setError(null);
    
    // Filter for supported file types
    const supportedTypes = ['.pdf', '.docx', '.txt', '.doc'];
    const validFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return supportedTypes.includes(ext);
    });

    if (validFiles.length === 0 && newFiles.length > 0) {
      setError('Please upload PDF, DOCX, or TXT files only.');
      return;
    }

    // Process each file
    for (const file of validFiles) {
      await processFile(file);
    }
  };

  const processFile = async (file) => {
    const fileId = Date.now() + Math.random();
    const fileObj = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    };

    setFiles(prev => [...prev, fileObj]);
    setProcessingFiles(prev => new Set([...prev, fileId]));

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (user && user.email) {
        formData.append('user_email', user.email);
      }
      formData.append('action', 'summarize');

      // Check if backend is reachable
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/process_document`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(120000) // 2 minute timeout
        });
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout - file may be too large. Please try a smaller file.');
        } else if (fetchError.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to backend server. Make sure the backend is running on port 8000.');
        }
        throw new Error(`Network error: ${fetchError.message}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process document' }));
        throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setSummaries(prev => ({
        ...prev,
        [fileId]: {
          summary: data.summary,
          filename: file.name,
          document_id: data.document_id,
          compression_ratio: data.compression_ratio
        }
      }));

    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process document. Please try again.');
      
      // Remove file from list on error
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } finally {
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setSummaries(prev => {
      const newSummaries = { ...prev };
      delete newSummaries[fileId];
      return newSummaries;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024) * 10) / 10 + ' MB';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.section
      id="docs"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      style={{
        padding: '24px 0 48px',
        background: 'transparent'
      }}
    >
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(400px 200px at 90% 0%, rgba(255,59,59,.12), rgba(0,0,0,0)), #2d2d2d'
              : 'radial-gradient(400px 200px at 90% 0%, rgba(24,160,88,.12), rgba(0,0,0,0)), #ffffff',
            border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: theme === 'dark' 
              ? '0 10px 30px rgba(0,0,0,.35)' 
              : '0 10px 30px rgba(16,24,40,.06)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated background elements */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: theme === 'dark'
                ? 'radial-gradient(circle, rgba(0,122,204,0.2), transparent)'
                : 'radial-gradient(circle, rgba(24,160,88,0.2), transparent)',
              filter: 'blur(20px)'
            }}
          />

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              margin: '0 0 8px',
              fontSize: '24px',
              color: theme === 'dark' ? '#d4d4d4' : '#101217',
              fontWeight: 700
            }}
          >
            Upload & Summarize Documents
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              margin: '0 0 20px',
              color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
              fontSize: '16px'
            }}
          >
            Drag and drop documents to get instant AI-powered summaries.
          </motion.p>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  marginBottom: '16px',
                  padding: '12px 16px',
                  background: theme === 'dark' ? '#3a1f1f' : '#fee',
                  border: `1px solid ${theme === 'dark' ? '#5a2f2f' : '#fcc'}`,
                  borderRadius: '10px',
                  color: theme === 'dark' ? '#ff6b6b' : '#c33',
                  fontSize: '14px'
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dropzone */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
            style={{
              display: 'grid',
              placeItems: 'center',
              gap: '8px',
              border: `2px dashed ${isDragOver 
                ? (theme === 'dark' ? '#007acc' : '#18a058')
                : (theme === 'dark' ? '#2f2f2f' : '#e5e8ef')}`,
              borderRadius: '14px',
              padding: '32px 20px',
              color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isDragOver
                ? (theme === 'dark' ? 'rgba(0,122,204,0.08)' : 'rgba(24,160,88,0.08)')
                : (theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(16,24,40,0.02)'),
              boxShadow: isDragOver
                ? (theme === 'dark' ? '0 12px 26px rgba(0,122,204,0.2)' : '0 12px 26px rgba(24,160,88,0.2)')
                : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated border */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: '14px',
                background: theme === 'dark'
                  ? 'linear-gradient(45deg, #007acc, #6b8cff, #ff3b3b, #18a058)'
                  : 'linear-gradient(45deg, #18a058, #36d399, #ff6b35, #8b5cf6)',
                backgroundSize: '400% 400%',
                zIndex: -1,
                opacity: 0.3
              }}
            />

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ fontSize: '48px', marginBottom: '8px' }}
            >
              📁
            </motion.div>

            <motion.span
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Drop files here or click to upload
            </motion.span>

            <div style={{
              fontSize: '12px',
              marginTop: '8px',
              color: theme === 'dark' ? '#6b7280' : '#9ca3af'
            }}>
              Supports: PDF, DOCX, TXT
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </motion.div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginTop: '16px',
                  textAlign: 'left'
                }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontSize: '14px',
                    color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                    marginBottom: '8px',
                    fontWeight: 500
                  }}
                >
                  Uploaded files ({files.length})
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {files.map((file, index) => {
                    const isProcessing = processingFiles.has(file.id);
                    const summary = summaries[file.id];

                    return (
                      <motion.div
                        key={file.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                          borderRadius: '10px',
                          background: theme === 'dark' ? '#252526' : '#f8fafc',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          style={{ fontSize: '16px' }}
                        >
                          {isProcessing ? '⏳' : summary ? '✅' : '📄'}
                        </motion.div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: theme === 'dark' ? '#d4d4d4' : '#101217',
                            fontWeight: 600,
                            fontSize: '14px'
                          }}>
                            {file.name}
                          </div>
                          <div style={{
                            color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                            fontSize: '12px'
                          }}>
                            {formatFileSize(file.size)}
                            {isProcessing && ' • Processing...'}
                            {summary && ' • Summary ready'}
                          </div>
                        </div>

                        {!isProcessing && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFile(file.id)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              border: 'none',
                              background: theme === 'dark' ? '#ff3b3b' : '#ef4444',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = theme === 'dark' ? '#e04345' : '#dc2626';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = theme === 'dark' ? '#ff3b3b' : '#ef4444';
                            }}
                          >
                            Remove
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Displays */}
          <AnimatePresence>
            {Object.entries(summaries).map(([fileId, summaryData]) => (
              <SummaryDisplay
                key={fileId}
                summary={summaryData.summary}
                filename={summaryData.filename}
                theme={theme}
                onClose={() => {
                  setSummaries(prev => {
                    const newSummaries = { ...prev };
                    delete newSummaries[fileId];
                    return newSummaries;
                  });
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTA;
