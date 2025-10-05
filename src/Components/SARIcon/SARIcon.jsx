import React from 'react';

// Saudi Riyal currency icon component - displays ر.س symbol
const SARIcon = ({ size = '1em', className = '', style = {} }) => {
  return (
    <span 
      className={`sar-icon ${className}`} 
      style={{ 
        display: 'inline-block',
        fontSize: size,
        fontWeight: '600',
        color: 'inherit',
        marginLeft: '2px',
        marginRight: '2px',
        ...style 
      }}
      aria-label="ريال سعودي"
      title="ريال سعودي"
    >
      ر.س
    </span>
  );
};

export default SARIcon;
