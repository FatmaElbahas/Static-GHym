import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faTimes,
  faSignInAlt,
  faCheckCircle,
  faArrowRight,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

// Schema للتحقق من صحة البيانات باستخدام Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .required('البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح')
    .max(100, 'البريد الإلكتروني طويل جداً')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'البريد الإلكتروني غير صحيح'
    ),
  
  password: Yup.string()
    .required('كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(50, 'كلمة المرور طويلة جداً')
});

const Login = () => {
  const navigate = useNavigate();

  // القيم الافتراضية للنموذج
  const initialValues = {
    email: '',
    password: ''
  };

  // دالة إرسال النموذج
  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    try {
      setStatus(''); // مسح الرسائل السابقة
      
      // التحقق من صحة البيانات قبل الإرسال
      if (!values.email || !values.password) {
        setStatus('جميع الحقول مطلوبة');
        setSubmitting(false);
        return;
      }
      
      // إرسال البيانات إلى API
      const requestData = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      
      console.log('Sending login data to API:', requestData);
      
      const response = await fetch('https://enqlygo.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Login API Response:', result);
      
      if (response.ok && result.status === 'success') {
        // حفظ بيانات المستخدم في localStorage
        if (result.data?.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        // حفظ التوكن إذا كان موجود
        if (result.data?.token) {
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('authToken', result.data.token);
        }
        
        // إرسال event لتحديث النافبار
        window.dispatchEvent(new Event('loginSuccess'));
        
        // إظهار رسالة نجاح جميلة
        setStatus('success');
        
        // إعادة توجيه بعد ثانيتين
        setTimeout(() => {
          // Check if user was trying to book a service
          const returnToBooking = sessionStorage.getItem('returnToBooking');
          if (returnToBooking) {
            navigate(`/service/${returnToBooking}`);
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        // معالجة أخطاء API
        if (result.errors) {
          // تعيين أخطاء الحقول
          Object.keys(result.errors).forEach(key => {
            setFieldError(key, result.errors[key][0]);
          });
        } else {
          // معالجة أخطاء محددة
          let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
          
          if (result.message) {
            // معالجة رسائل الخطأ المحددة
            if (result.message.includes('createToken() on null') || 
                result.message.includes('Call to a member function createToken()')) {
              errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            } else if (result.message.includes('Unauthorized') || 
                       result.message.includes('Invalid credentials')) {
              errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            } else if (result.message.includes('User not found')) {
              errorMessage = 'المستخدم غير موجود';
            } else if (result.message.includes('Account disabled') || 
                       result.message.includes('Account suspended')) {
              errorMessage = 'الحساب معطل، يرجى التواصل مع الدعم الفني';
            } else {
              errorMessage = result.message;
            }
          } else if (result.error) {
            errorMessage = result.error;
          }
          
          setStatus(errorMessage);
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // معالجة أنواع مختلفة من الأخطاء
      let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت.';
      } else if (error.name === 'SyntaxError') {
        errorMessage = 'خطأ في استجابة الخادم. يرجى المحاولة مرة أخرى.';
      } else if (error.message && error.message.includes('createToken() on null')) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      }
      
      setStatus(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Login Navbar */}
      <nav className="bg-white shadow-sm" style={{ padding: '0.7rem 0', marginTop: 0, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Back Arrow */}
            <button
              onClick={() => navigate('/')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #e9ecef',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#484848',
                fontSize: '16px'
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

            {/* Logo */}
            <img 
              src={logo}
              alt="Root" 
              style={{width: '85px', height: 'auto'}}
            />

            {/* Empty div for spacing */}
            <div style={{ width: '40px' }}></div>
          </div>
        </div>
      </nav>

    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-6">
            <div className="bg-white rounded-4 shadow p-5 p-lg-5">
              {/* Header */}
              <div className="text-end mb-5">
                <h2 style={{ 
                  color: '#484848', 
                  fontWeight: '700', 
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  marginBottom: '2.5rem'
                }}>
                  تسجيل الدخول
                </h2>
              </div>

              {/* Form */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, status, setFieldValue, setStatus }) => (
                  <Form>
                    {/* Modal للنجاح */}
                    {status === 'success' && (
                      <>
                        <div 
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 23, 38, 0.75)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'fadeIn 0.3s ease'
                          }}
                          onClick={() => setStatus('')}
                        >
                          <div 
                            style={{
                              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                              borderRadius: '20px',
                              padding: '2.5rem 2rem',
                              maxWidth: '420px',
                              width: '90%',
                              boxShadow: '0 20px 60px rgba(40, 167, 69, 0.2), 0 0 0 1px rgba(40, 167, 69, 0.1)',
                              textAlign: 'center',
                              animation: 'slideUp 0.3s ease',
                              border: '2px solid rgba(40, 167, 69, 0.1)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ 
                              marginBottom: '1.5rem',
                              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 1.5rem',
                              boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)'
                            }}>
                              <FontAwesomeIcon 
                                icon={faCheckCircle} 
                                style={{ fontSize: '2.5rem', color: '#ffffff' }}
                              />
                            </div>
                            <h4 style={{ 
                              color: '#2c3e50', 
                              fontWeight: '700', 
                              marginBottom: '0.8rem',
                              fontSize: '22px'
                            }}>
                              تم تسجيل الدخول بنجاح! 🎉
                            </h4>
                            <p style={{ 
                              color: '#6c757d', 
                              fontSize: '15px',
                              marginBottom: '0',
                              lineHeight: '1.6'
                            }}>
                              جاري التوجيه إلى لوحة التحكم...
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Modal للخطأ */}
                    {status && status !== 'success' && (
                      <>
                        <div 
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 23, 38, 0.75)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'fadeIn 0.3s ease'
                          }}
                          onClick={() => setStatus('')}
                        >
                          <div 
                            style={{
                              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                              borderRadius: '20px',
                              padding: '2.5rem 2rem',
                              maxWidth: '420px',
                              width: '90%',
                              boxShadow: '0 20px 60px rgba(220, 53, 69, 0.15), 0 0 0 1px rgba(220, 53, 69, 0.1)',
                              textAlign: 'center',
                              animation: 'slideUp 0.3s ease',
                              position: 'relative',
                              border: '2px solid rgba(220, 53, 69, 0.08)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setStatus('')}
                              style={{
                                position: 'absolute',
                                top: '1.2rem',
                                left: '1.2rem',
                                background: 'rgba(220, 53, 69, 0.1)',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: '#dc3545',
                                lineHeight: '1',
                                padding: '0',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
                                e.currentTarget.style.transform = 'rotate(90deg)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
                                e.currentTarget.style.transform = 'rotate(0deg)';
                              }}
                            >
                              ×
                            </button>
                            <div style={{ 
                              marginBottom: '1.5rem',
                              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 1.5rem',
                              boxShadow: '0 8px 20px rgba(220, 53, 69, 0.25)'
                            }}>
                              <FontAwesomeIcon 
                                icon={faTimes} 
                                style={{ fontSize: '2.5rem', color: '#ffffff' }}
                              />
                            </div>
                            <h4 style={{ 
                              color: '#2c3e50', 
                              fontWeight: '700', 
                              marginBottom: '0.8rem',
                              fontSize: '20px'
                            }}>
                              خطأ في تسجيل الدخول
                            </h4>
                            <p style={{ 
                              color: '#6c757d', 
                              fontSize: '15px', 
                              lineHeight: '1.7',
                              marginBottom: '1.5rem',
                              padding: '0 0.5rem'
                            }}>
                              {status}
                            </p>
                            <button
                              onClick={() => setStatus('')}
                              style={{
                                background: 'linear-gradient(135deg, #0171BD 0%, #015a94 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.75rem 2.5rem',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(1, 113, 189, 0.3)',
                                width: '100%',
                                maxWidth: '200px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(1, 113, 189, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(1, 113, 189, 0.3)';
                              }}
                            >
                              حسناً
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* البريد الإلكتروني */}
                    <div className="mb-4">
                      <Field name="email">
                        {({ field, meta }) => (
                          <div style={{ position: 'relative' }}>
                            <input
                              {...field}
                              type="email"
                              className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              style={{
                                borderRadius: '10px', 
                                fontSize: '16px',
                                padding: '1rem',
                                border: meta.touched && meta.error ? '1px solid #dc3545' : '1px solid #e9ecef',
                                backgroundColor: '#ffffff',
                                marginBottom: meta.touched && meta.error ? '0.5rem' : '0'
                              }}
                              placeholder="أدخل بريدك الإلكتروني"
                              onChange={(e) => {
                                const formattedValue = e.target.value.toLowerCase();
                                setFieldValue('email', formattedValue);
                              }}
                            />
                            <ErrorMessage name="email">
                              {msg => (
                                <div style={{
                                  color: '#dc3545',
                                  fontSize: '14px',
                                  marginTop: '0.25rem',
                                  textAlign: 'right',
                                  display: 'block'
                                }}>
                                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                        )}
                      </Field>
                    </div>

                    {/* كلمة المرور */}
                    <div className="mb-4">
                      <Field name="password">
                        {({ field, meta }) => (
                          <div style={{ position: 'relative' }}>
                            <input
                              {...field}
                              type="password"
                              className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              style={{
                                borderRadius: '10px', 
                                fontSize: '16px',
                                padding: '1rem',
                                border: meta.touched && meta.error ? '1px solid #dc3545' : '1px solid #e9ecef',
                                backgroundColor: '#ffffff',
                                marginBottom: meta.touched && meta.error ? '0.5rem' : '0'
                              }}
                              placeholder="أدخل كلمة المرور"
                              onChange={(e) => {
                                const formattedValue = e.target.value.replace(/\s/g, '');
                                setFieldValue('password', formattedValue);
                              }}
                            />
                            <ErrorMessage name="password">
                              {msg => (
                                <div style={{
                                  color: '#dc3545',
                                  fontSize: '14px',
                                  marginTop: '0.25rem',
                                  textAlign: 'right',
                                  display: 'block'
                                }}>
                                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                        )}
                      </Field>
                    </div>

                    {/* زر تسجيل الدخول */}
                    <button
                      type="submit"
                      className="btn w-100 mt-2 submit-btn-custom"
                      style={{
                        borderRadius: '10px', 
                        fontSize: '16px', 
                        backgroundColor: status === 'success' ? '#28a745' : '#0171BD', 
                        borderColor: status === 'success' ? '#28a745' : '#0171BD',
                        color: '#ffffff',
                        fontWeight: '600',
                        padding: '1rem',
                        border: '2px solid',
                        transition: 'all 0.3s ease'
                      }}
                      disabled={isSubmitting || status === 'success'}
                      onMouseEnter={(e) => {
                        if (status !== 'success' && !isSubmitting) {
                          e.currentTarget.style.setProperty('background-color', '#ffffff', 'important');
                          e.currentTarget.style.setProperty('color', '#0171BD', 'important');
                          e.currentTarget.style.setProperty('border-color', '#0171BD', 'important');
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(1, 113, 189, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (status !== 'success') {
                          e.currentTarget.style.setProperty('background-color', '#0171BD', 'important');
                          e.currentTarget.style.setProperty('color', '#ffffff', 'important');
                          e.currentTarget.style.setProperty('border-color', '#0171BD', 'important');
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {status === 'success' ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                          تم تسجيل الدخول بنجاح!
                        </>
                      ) : isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري تسجيل الدخول...
                        </>
                      ) : (
                        'دخول'
                      )}
                    </button>
                  </Form>
                )}
              </Formik>

              {/* Register Link */}
              <div className="text-end mt-5">
                <Link 
                  to="/register" 
                  className="text-decoration-none d-inline-flex align-items-center gap-2"
                  style={{ 
                    color: '#0171BD !important', 
                    fontSize: '15px', 
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty('color', '#015a94', 'important');
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('color', '#0171BD', 'important');
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} style={{ color: '#0171BD' }} />
                  <span style={{ color: '#0171BD' }}>إنشاء حساب</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
