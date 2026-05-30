import React from 'react';
import './SectionLoadingOverlay.scss';

const SectionLoadingOverlay = ({ active, text = 'Loading...' }) => {
  if (!active) return null;

  return (
    <div className="section-loading-overlay" role="status" aria-live="polite" aria-label={text}>
      <div className="slo-backdrop" />
      <div className="slo-content">
        <div className="slo-spinner" />
        {text && <div className="slo-text">{text}</div>}
      </div>
    </div>
  );
};

export default SectionLoadingOverlay;
