import React from 'react';

/**
 * Simple progress bar component.
 * @param {{percent: number, label?: string}} props
 */
const ProgressBar = ({ percent, label }) => {
  const safePercent = Math.min(Math.max(percent, 0), 100);
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {label}
        </div>
      )}
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          height: '0.75rem',
          borderRadius: '0.375rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${safePercent}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            height: '100%',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
      <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {safePercent}%
      </div>
    </div>
  );
};

export default ProgressBar;

