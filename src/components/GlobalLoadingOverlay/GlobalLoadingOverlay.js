import React from 'react';
import ReactDOM from 'react-dom';
import './GlobalLoadingOverlay.scss';

const GlobalLoadingOverlay = ({ active, text = 'Loading...' }) => {
  if (!active) return null;

  return ReactDOM.createPortal(
    <div className="global-loading-overlay" role="status" aria-live="polite" aria-label={text}>
      <div className="glo-backdrop" />
      <div className="glo-content">
        <div className="glo-spinner" />
        {text && <div className="glo-text">{text}</div>}
      </div>
    </div>,
    document.body
  );
};

export default GlobalLoadingOverlay;
