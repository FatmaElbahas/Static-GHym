import React from 'react';
import { getErrorMessage, getErrorProps, logError } from '../utils/errorUtils';

/**
 * Error Boundary Component to catch and handle React errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    logError(error, 'ErrorBoundary', {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.fallback || 'Default'
    });

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback = ({ error, onRetry }) => {
  const errorProps = getErrorProps(error, onRetry);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      margin: '2rem 0'
    }}>
      {/* Error Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#dc3545',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
            fill="white"
          />
        </svg>
      </div>

      {/* Error Title */}
      <h2 style={{
        color: '#dc3545',
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        {errorProps.title}
      </h2>

      {/* Error Message */}
      <p style={{
        color: '#6c757d',
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        {errorProps.message}
      </p>

      {/* Action Buttons */}
      {errorProps.showRetry && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={errorProps.onRetry}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0171BD',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0171BD'}
          >
            المحاولة مرة أخرى
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#0171BD',
              border: '1px solid #0171BD',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      )}

      {/* Error Details (Development Only) */}
      {errorProps.showDetails && process.env.NODE_ENV === 'development' && (
        <details style={{
          marginTop: '2rem',
          textAlign: 'left',
          maxWidth: '600px',
          width: '100%'
        }}>
          <summary style={{
            cursor: 'pointer',
            padding: '0.5rem',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}>
            تفاصيل الخطأ (للإدارة فقط)
          </summary>
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px',
            border: '1px solid #dee2e6'
          }}>
            {error?.stack || error?.message || 'لا توجد تفاصيل متاحة'}
          </pre>
        </details>
      )}
    </div>
  );
};

/**
 * Hook version of error boundary for functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error) => {
    setError(error);
    logError(error, 'useErrorHandler');
  }, []);

  return { error, resetError, captureError };
};

/**
 * Error Fallback for specific error types
 */
export const ErrorFallback = ({ error, resetError }) => {
  if (!error) return null;

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '1rem 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem'
      }}>
        <span style={{ color: '#dc3545', fontSize: '16px' }}>⚠️</span>
        <strong style={{ color: '#dc3545' }}>خطأ:</strong>
      </div>
      
      <p style={{ 
        color: '#6c757d', 
        marginBottom: '1rem',
        fontSize: '14px'
      }}>
        {getErrorMessage(error)}
      </p>

      {resetError && (
        <button
          onClick={resetError}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0171BD',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          إخفاء الخطأ
        </button>
      )}
    </div>
  );
};

/**
 * Loading Error Component
 */
export const LoadingError = ({ error, onRetry }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '1rem'
      }}>
        😞
      </div>
      
      <h3 style={{
        color: '#dc3545',
        marginBottom: '0.5rem'
      }}>
        فشل في تحميل البيانات
      </h3>
      
      <p style={{
        color: '#6c757d',
        marginBottom: '1.5rem'
      }}>
        {getErrorMessage(error)}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0171BD',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          المحاولة مرة أخرى
        </button>
      )}
    </div>
  );
};

export default ErrorBoundary;
