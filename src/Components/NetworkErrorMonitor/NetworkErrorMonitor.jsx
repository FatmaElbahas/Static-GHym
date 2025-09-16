import React, { useState, useEffect } from 'react';

/**
 * مكون مراقبة أخطاء الشبكة
 * يعرض أخطاء الشبكة في console ويوفر معلومات تفصيلية
 */
const NetworkErrorMonitor = () => {
  const [errors, setErrors] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // مراقبة console.error
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);
      
      // إذا كان الخطأ متعلق بالشبكة
      if (args[0] && typeof args[0] === 'string' && 
          (args[0].includes('API error') || args[0].includes('Network') || args[0].includes('fetch'))) {
        setErrors(prev => [...prev, {
          id: Date.now(),
          message: args.join(' '),
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };

    // تنظيف
    return () => {
      console.error = originalError;
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h6 style={{ margin: 0, color: '#dc3545' }}>أخطاء الشبكة</h6>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isVisible ? '−' : '+'}
        </button>
      </div>
      
      {isVisible && (
        <div>
          {errors.length === 0 ? (
            <p style={{ color: '#28a745', fontSize: '12px', margin: 0 }}>
              لا توجد أخطاء في الشبكة
            </p>
          ) : (
            <div>
              {errors.slice(-5).reverse().map(error => (
                <div key={error.id} style={{
                  padding: '5px',
                  marginBottom: '5px',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#721c24' }}>
                    {error.timestamp}
                  </div>
                  <div style={{ color: '#721c24' }}>
                    {error.message}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setErrors([])}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                مسح الأخطاء
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkErrorMonitor;
