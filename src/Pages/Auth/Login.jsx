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
  faCheckCircle
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
        
        // إعادة توجيه إلى الداشبورد بعد ثانيتين
        setTimeout(() => {
          navigate('/dashboard');
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
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container-fluid">
        <div className="row g-0 min-vh-100">
          {/* Left Side - Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
            <div className="w-100 p-3" style={{maxWidth: '500px'}}>
              {/* Header */}
              <div className="text-center mb-3">
                <div className="mb-2">
                  <img 
                    src={logo}
                    alt="غنيم" 
                    className="img-fluid"
                    style={{width: '80px', height: '80px'}}
                  />
                </div>
                <h2 className="h4 fw-bold text-dark mb-0">تسجيل الدخول</h2>
              </div>

              {/* Form */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, status, setFieldValue }) => (
                  <Form>
                    {/* رسالة النجاح */}
                    {status === 'success' && (
                      <div className="alert alert-success mb-3 border-0 shadow-sm" role="alert" style={{
                        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                        border: '1px solid #28a745',
                        borderRadius: '10px'
                      }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <FontAwesomeIcon 
                              icon={faCheckCircle} 
                              className="text-success" 
                              style={{ fontSize: '1.5rem' }}
                            />
                          </div>
                          <div>
                            <div className="fw-bold text-success mb-1">
                              🎉 تم تسجيل الدخول بنجاح!
                            </div>
                            <div className="small text-success opacity-75">
                              جاري التوجيه إلى لوحة التحكم...
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* رسالة الخطأ العامة */}
                    {status && status !== 'success' && (
                      <div className="alert alert-danger mb-3" role="alert">
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        {status}
                      </div>
                    )}

                    {/* البريد الإلكتروني */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{fontSize: '0.9rem'}}>
                        <span className="text-danger">*</span> البريد الإلكتروني
                      </label>
                      <Field name="email">
                        {({ field, meta }) => (
                          <div>
                            <input
                              {...field}
                              type="email"
                              className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              style={{borderRadius: '10px', fontSize: '0.9rem'}}
                              placeholder="أدخل بريدك الإلكتروني"
                              onChange={(e) => {
                                const formattedValue = e.target.value.toLowerCase();
                                setFieldValue('email', formattedValue);
                              }}
                            />
                            <ErrorMessage name="email" component="div" className="invalid-feedback">
                              {msg => (
                                <div>
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
                      <label className="form-label fw-semibold" style={{fontSize: '0.9rem'}}>
                        <span className="text-danger">*</span> كلمة المرور
                      </label>
                      <Field name="password">
                        {({ field, meta }) => (
                          <div>
                            <input
                              {...field}
                              type="password"
                              className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              style={{borderRadius: '10px', fontSize: '0.9rem'}}
                              placeholder="أدخل كلمة المرور"
                              onChange={(e) => {
                                const formattedValue = e.target.value.replace(/\s/g, '');
                                setFieldValue('password', formattedValue);
                              }}
                            />
                            <ErrorMessage name="password" component="div" className="invalid-feedback">
                              {msg => (
                                <div>
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
                      className="btn btn-primary w-100 py-2"
                      style={{
                        borderRadius: '10px', 
                        fontSize: '0.9rem', 
                        backgroundColor: status === 'success' ? '#28a745' : '#038FAD', 
                        borderColor: status === 'success' ? '#28a745' : '#038FAD',
                        transition: 'all 0.3s ease'
                      }}
                      disabled={isSubmitting || status === 'success'}
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
                        <>
                          <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                          تسجيل الدخول
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>

              {/* Register Link */}
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  ليس لديك حساب ؟
                  <Link to="/register" className="text-decoration-none fw-semibold ms-1" style={{color: '#038FAD'}}>
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
              <div 
                style={{
                  width: '500px',
                  height: '400px',
                  backgroundImage: `url('/login.svg')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
