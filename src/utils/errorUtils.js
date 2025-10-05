/**
 * Error handling utilities for better error management
 */

/**
 * Custom error classes
 */
export class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

export class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Error types mapping
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  API: 'api',
  VALIDATION: 'validation',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
};

/**
 * Error messages in Arabic
 */
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
  [ERROR_TYPES.API]: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
  [ERROR_TYPES.VALIDATION]: 'البيانات المدخلة غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.',
  [ERROR_TYPES.TIMEOUT]: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
  [ERROR_TYPES.UNKNOWN]: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
};

/**
 * Get user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message in Arabic
 */
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];

  // Handle custom error types
  if (error instanceof APIError) {
    return ERROR_MESSAGES[ERROR_TYPES.API];
  }

  if (error instanceof NetworkError) {
    return ERROR_MESSAGES[ERROR_TYPES.NETWORK];
  }

  if (error instanceof ValidationError) {
    return error.message || ERROR_MESSAGES[ERROR_TYPES.VALIDATION];
  }

  // Handle specific error cases
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_MESSAGES[ERROR_TYPES.NETWORK];
  }

  if (error.message && error.message.includes('timeout')) {
    return ERROR_MESSAGES[ERROR_TYPES.TIMEOUT];
  }

  // Handle HTTP status codes
  if (error.status) {
    switch (error.status) {
      case 400:
        return 'طلب غير صحيح. يرجى التحقق من البيانات المدخلة.';
      case 401:
        return 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'غير مسموح لك بالوصول إلى هذا المورد.';
      case 404:
        return 'المورد المطلوب غير موجود.';
      case 429:
        return 'تم تجاوز حد الطلبات المسموح. يرجى المحاولة لاحقاً.';
      case 500:
        return ERROR_MESSAGES[ERROR_TYPES.API];
      case 502:
      case 503:
      case 504:
        return 'الخادم غير متاح حالياً. يرجى المحاولة لاحقاً.';
      default:
        return ERROR_MESSAGES[ERROR_TYPES.API];
    }
  }

  return ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
};

/**
 * Log error for debugging
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (error, context = '', additionalData = {}) => {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', errorInfo);
  }

  // Here you could send to error tracking service
  // Example: Sentry, LogRocket, etc.
  // errorTrackingService.captureException(error, errorInfo);
};

/**
 * Handle API errors with proper error types
 * @param {Response} response - Fetch response object
 * @returns {Promise<never>} - Throws appropriate error
 */
export const handleAPIError = async (response) => {
  let errorMessage = 'حدث خطأ في الخادم';
  let errorData = null;

  try {
    errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch (e) {
    // If response is not JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }

  throw new APIError(errorMessage, response.status, errorData);
};

/**
 * Safe fetch wrapper with error handling
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<any>} - Fetch response
 */
export const safeFetch = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleAPIError(response);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new APIError(ERROR_MESSAGES[ERROR_TYPES.TIMEOUT], 408);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new NetworkError(ERROR_MESSAGES[ERROR_TYPES.NETWORK], error);
  }
};

/**
 * Retry mechanism for failed requests
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise<any>} - Function result
 */
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain error types
      if (error instanceof ValidationError || 
          (error instanceof APIError && error.status >= 400 && error.status < 500)) {
        throw error;
      }

      // If this is the last retry, throw the error
      if (i === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError;
};

/**
 * Error boundary component props
 * @param {Error} error - The error object
 * @param {Function} resetError - Function to reset error state
 * @returns {Object} - Props for error UI component
 */
export const getErrorProps = (error, resetError) => ({
  title: 'حدث خطأ',
  message: getErrorMessage(error),
  onRetry: resetError,
  showRetry: true,
  showDetails: process.env.NODE_ENV === 'development'
});

/**
 * Validate API response structure
 * @param {Object} response - API response object
 * @param {string} expectedStructure - Expected response structure
 * @returns {boolean} - True if response is valid
 */
export const validateAPIResponse = (response, expectedStructure = 'basic') => {
  if (!response || typeof response !== 'object') {
    return false;
  }

  switch (expectedStructure) {
    case 'basic':
      return response.hasOwnProperty('status');
    
    case 'salons':
      return response.status === 'success' && 
             Array.isArray(response.data);
    
    case 'salon':
      return response.status === 'success' && 
             response.data && 
             typeof response.data === 'object';
    
    case 'services':
      return response.status === 'success' && 
             (Array.isArray(response.data) || 
              (response.data && Array.isArray(response.data.services)));
    
    default:
      return true;
  }
};

/**
 * Create error state for React components
 * @param {Error} error - The error object
 * @returns {Object} - Error state object
 */
export const createErrorState = (error) => ({
  hasError: true,
  error: error,
  message: getErrorMessage(error),
  type: getErrorType(error),
  timestamp: new Date().toISOString()
});

/**
 * Get error type from error object
 * @param {Error} error - The error object
 * @returns {string} - Error type
 */
export const getErrorType = (error) => {
  if (error instanceof NetworkError) return ERROR_TYPES.NETWORK;
  if (error instanceof APIError) return ERROR_TYPES.API;
  if (error instanceof ValidationError) return ERROR_TYPES.VALIDATION;
  if (error.message && error.message.includes('timeout')) return ERROR_TYPES.TIMEOUT;
  return ERROR_TYPES.UNKNOWN;
};
