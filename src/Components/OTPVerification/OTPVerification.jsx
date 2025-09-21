import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faCheckCircle, 
  faTimes, 
  faSpinner,
  faExclamationTriangle,
  faKey,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import './OTPVerification.css';

const OTPVerification = ({ bookingId, onSuccess, onCancel, isVisible }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const API_URL = 'https://enqlygo.com/api/user/bookings/complete-book';

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isVisible) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, isVisible]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isVisible) {
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setSuccess(false);
      // Focus first input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isVisible]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty field or the last field
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (otpCode = null) => {
    const otpToSubmit = otpCode || otp.join('');
    
    if (otpToSubmit.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          booking_id: bookingId,
          completion_otp: otpToSubmit
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(result);
        }, 2000);
      } else {
        setError(result.message || 'رمز التحقق غير صحيح');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.');
      console.error('OTP verification error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Header */}
          <div className="modal-header border-0" style={{ 
            background: 'linear-gradient(135deg, var(--color-main) 0%, #00BDC3 100%)',
            color: 'white',
            padding: '1.5rem 2rem'
          }}>
            <div className="d-flex align-items-center w-100">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }}>
                <FontAwesomeIcon icon={faShieldAlt} size="lg" />
              </div>
              <div>
                <h5 className="modal-title mb-0 fw-bold">تحقق من الحجز</h5>
                <small className="opacity-90">أدخل رمز التحقق لإتمام الحجز</small>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {success ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    size="3x" 
                    className="text-success success-icon"
                  />
                </div>
                <h4 className="text-success fw-bold mb-3">تم التحقق بنجاح!</h4>
                <p className="text-muted">تم إتمام الحجز بنجاح</p>
              </div>
            ) : (
              <>
                {/* Booking Info */}
                <div className="bg-light rounded-3 p-3 mb-4">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faKey} className="text-primary me-2" />
                    <div>
                      <h6 className="mb-1 fw-bold">رقم الحجز: #{bookingId}</h6>
                      <small className="text-muted">أدخل رمز التحقق المرسل إليك</small>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                {timeLeft > 0 && (
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center bg-warning bg-opacity-10 rounded-pill px-3 py-2 timer-warning">
                      <FontAwesomeIcon icon={faClock} className="text-warning me-2" />
                      <span className="text-warning fw-bold">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                )}

                {/* OTP Input */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-center d-block mb-3">
                    رمز التحقق (6 أرقام)
                  </label>
                  <div className="d-flex justify-content-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="form-control text-center fw-bold otp-input"
                        style={{
                          width: '50px',
                          height: '50px',
                          fontSize: '1.5rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '10px'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" style={{ borderRadius: '10px' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Resend Option */}
                {canResend && (
                  <div className="text-center mb-4">
                    <button 
                      type="button" 
                      className="btn btn-link text-primary p-0"
                      onClick={() => {
                        setTimeLeft(300);
                        setCanResend(false);
                        setError(null);
                      }}
                    >
                      إعادة إرسال الرمز
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="modal-footer border-0 p-4">
              <div className="d-flex gap-3 w-100">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  style={{ borderRadius: '10px', padding: '0.75rem' }}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-2" />
                  إلغاء
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary flex-grow-1"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting || otp.join('').length !== 6}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '0.75rem',
                    background: 'var(--color-main)',
                    border: 'none'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                      تأكيد
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
