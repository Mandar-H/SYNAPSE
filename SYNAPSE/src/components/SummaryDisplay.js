import React from 'react';
import { motion } from 'framer-motion';

const SummaryDisplay = ({ summary, filename, theme, onClose }) => {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        marginTop: '24px',
        background: theme === 'dark'
          ? 'radial-gradient(400px 200px at 90% 0%, rgba(0,122,204,.12), rgba(0,0,0,0)), #2d2d2d'
          : 'radial-gradient(400px 200px at 90% 0%, rgba(24,160,88,.12), rgba(0,0,0,0)), #ffffff',
        border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: theme === 'dark' 
          ? '0 10px 30px rgba(0,0,0,.35)' 
          : '0 10px 30px rgba(16,24,40,.06)',
        position: 'relative'
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
            fontSize: '24px',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          ×
        </button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #007acc, #6b8cff)'
                : 'linear-gradient(135deg, #18a058, #36d399)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            ✨
          </motion.div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: theme === 'dark' ? '#d4d4d4' : '#101217'
            }}>
              Summary
            </h3>
            {filename && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: theme === 'dark' ? '#9aa0a6' : '#5f6673'
              }}>
                {filename}
              </p>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: theme === 'dark' ? '#252526' : '#f8fafc',
            border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
            borderRadius: '12px',
            padding: '20px',
            color: theme === 'dark' ? '#d4d4d4' : '#101217',
            fontSize: '16px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
        >
          {summary}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: theme === 'dark' ? '#9aa0a6' : '#5f6673'
          }}
        >
          <span>📊</span>
          <span>Summary generated successfully</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SummaryDisplay;

