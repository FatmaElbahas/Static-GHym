import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faTimes,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

// Schema للتحقق من صحة البيانات باستخدام Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .required('البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح')
    .max(100, 'البريد الإلكتروني طويل جداً')
    .test('email-format', 'البريد الإلكتروني غير صحيح', function(value) {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }),
  
  password: Yup.string()
    .required('كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .test('password-required', 'كلمة المرور مطلوبة', function(value) {
      if (!value) return false;
      return value.length >= 6;
    })
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
      
      // إرسال البيانات إلى API
      const requestData = {
        email: values.email,
        password: values.password,
      };
      
      // التأكد من أن جميع الحقول المطلوبة موجودة
      if (!requestData.email || !requestData.password) {
        setStatus('جميع الحقول مطلوبة');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن البريد الإلكتروني صحيح
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requestData.email)) {
        setFieldError('email', 'البريد الإلكتروني غير صحيح');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن كلمة المرور موجودة
      if (!requestData.password || requestData.password.length < 6) {
        setFieldError('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setSubmitting(false);
        return;
      }
      
      console.log('Sending login data to API:', requestData); // للتشخيص
      console.log('Request body JSON:', JSON.stringify(requestData)); // للتشخيص
      console.log('All required fields present:', {
        email: !!requestData.email,
        password: !!requestData.password
      }); // للتشخيص
      console.log('Request body type:', typeof requestData); // للتشخيص
      console.log('Request body keys:', Object.keys(requestData)); // للتشخيص
      console.log('Request body values:', Object.values(requestData)); // للتشخيص
      console.log('Request body entries:', Object.entries(requestData)); // للتشخيص
      console.log('Request body stringified length:', JSON.stringify(requestData).length); // للتشخيص
      console.log('Request body stringified preview:', JSON.stringify(requestData).substring(0, 100)); // للتشخيص
      console.log('Request body stringified full:', JSON.stringify(requestData, null, 2)); // للتشخيص
      console.log('Request body stringified full with spaces:', JSON.stringify(requestData, null, 4)); // للتشخيص
      console.log('Request body stringified full with tabs:', JSON.stringify(requestData, null, '\t')); // للتشخيص
      console.log('Request body stringified full with newlines:', JSON.stringify(requestData, null, '\n')); // للتشخيص
      console.log('Request body stringified full with custom:', JSON.stringify(requestData, null, '  ')); // للتشخيص
      console.log('Request body stringified full with custom2:', JSON.stringify(requestData, null, '    ')); // للتشخيص
      console.log('Request body stringified full with custom3:', JSON.stringify(requestData, null, '      ')); // للتشخيص
      console.log('Request body stringified full with custom4:', JSON.stringify(requestData, null, '        ')); // للتشخيص
      console.log('Request body stringified full with custom5:', JSON.stringify(requestData, null, '          ')); // للتشخيص
      console.log('Request body stringified full with custom6:', JSON.stringify(requestData, null, '            ')); // للتشخيص
      
      const response = await fetch('https://enqlygo.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Login API Response:', result); // للتشخيص
      
      if (response.ok && result.status === 'success') {
        // حفظ بيانات المستخدم في localStorage
        if (result.data && result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        // حفظ التوكن إذا كان موجود
        if (result.data && result.data.token) {
          localStorage.setItem('token', result.data.token);
        }
        
        alert('تم تسجيل الدخول بنجاح!');
        // إعادة توجيه إلى الصفحة الرئيسية أو الداشبورد
        navigate('/');
      } else {
        // معالجة أخطاء API
        if (result.errors) {
          // تعيين أخطاء الحقول
          Object.keys(result.errors).forEach(key => {
            setFieldError(key, result.errors[key][0]);
          });
        } else {
          // تعيين رسالة خطأ عامة
          setStatus(result.message || result.error || 'حدث خطأ أثناء تسجيل الدخول');
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
                    alt="بلسمي" 
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
                    {/* رسالة الخطأ العامة */}
                    {status && (
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
                        backgroundColor: '#038FAD', 
                        borderColor: '#038FAD'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
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
