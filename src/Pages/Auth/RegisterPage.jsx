import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faTimes,
  faUserPlus,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const logo = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

// Schema للتحقق من صحة البيانات باستخدام Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('اسم الشخص المسؤول مطلوب')
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف')
    .matches(/^[ء-ي\s]+$/, 'الاسم يجب أن يحتوي على أحرف عربية فقط')
    .test('name-format', 'الاسم غير صحيح', function(value) {
      if (!value) return true;
      return /^[ء-ي\s]+$/.test(value) && value.trim().length >= 2;
    }),
  
  email: Yup.string()
    .required('البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح')
    .max(100, 'البريد الإلكتروني طويل جداً')
    .test('email-format', 'البريد الإلكتروني غير صحيح', function(value) {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }),
  
  phone: Yup.string()
    .required('رقم الجوال مطلوب')
    .matches(/^05[0-9]{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام')
    .length(10, 'رقم الجوال يجب أن يكون 10 أرقام')
    .test('phone-format', 'رقم الجوال غير صحيح', function(value) {
      if (!value) return true;
      return /^05[0-9]{8}$/.test(value);
    }),
  
  password: Yup.string()
    .required('كلمة المرور مطلوبة')
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    )
    .test('password-strength', 'كلمة المرور ضعيفة', function(value) {
      if (!value) return true;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      return hasUpperCase && hasLowerCase && hasNumbers;
    }),
  
  confirmPassword: Yup.string()
    .required('تأكيد كلمة المرور مطلوب')
    .oneOf([Yup.ref('password')], 'كلمة المرور غير متطابقة')
    .test('password-match', 'كلمة المرور غير متطابقة', function(value) {
      if (!value) return true;
      return value === this.parent.password;
    })
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = React.useState(true);

  // القيم الافتراضية للنموذج
  const initialValues = {
    firstName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  // دالة إرسال النموذج
  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    try {
      setStatus(''); // مسح الرسائل السابقة
      
      // إرسال البيانات إلى API
      const requestData = {
        fullname: values.firstName,
        email: values.email,
        phone_number: values.phone,
        password: values.password,
      };
      
      // التأكد من أن جميع الحقول المطلوبة موجودة
      if (!requestData.fullname || !requestData.email || !requestData.password || !requestData.phone_number) {
        setStatus('جميع الحقول مطلوبة');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن رقم الهاتف موجود ومُنسق
      if (!requestData.phone_number || requestData.phone_number.length !== 10) {
        setFieldError('phone', 'رقم الهاتف مطلوب ويجب أن يكون 10 أرقام');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن كلمة المرور وتأكيدها متطابقتان
      if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', 'كلمة المرور غير متطابقة');
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
      
      // التأكد من أن الاسم صحيح
      if (!requestData.fullname || requestData.fullname.trim().length < 2) {
        setFieldError('firstName', 'الاسم يجب أن يكون حرفين على الأقل');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن كلمة المرور قوية
      if (requestData.password.length < 8) {
        setFieldError('password', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن كلمة المرور تحتوي على حرف كبير وصغير ورقم
      const hasUpperCase = /[A-Z]/.test(requestData.password);
      const hasLowerCase = /[a-z]/.test(requestData.password);
      const hasNumbers = /\d/.test(requestData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        setFieldError('password', 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن رقم الهاتف يبدأ بـ 05
      if (!requestData.phone_number.startsWith('05')) {
        setFieldError('phone', 'رقم الهاتف يجب أن يبدأ بـ 05');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن رقم الهاتف يحتوي على أرقام فقط
      if (!/^[0-9]+$/.test(requestData.phone_number)) {
        setFieldError('phone', 'رقم الهاتف يجب أن يحتوي على أرقام فقط');
        setSubmitting(false);
        return;
      }
      
      // التأكد من أن رقم الهاتف صحيح
      if (requestData.phone_number.length !== 10) {
        setFieldError('phone', 'رقم الهاتف يجب أن يكون 10 أرقام');
        setSubmitting(false);
        return;
      }
      
      console.log('Sending data to API:', requestData); // للتشخيص
      console.log('Phone number:', requestData.phone_number); // للتشخيص
      console.log('Phone number length:', requestData.phone_number.length); // للتشخيص
      console.log('Phone number starts with 05:', requestData.phone_number.startsWith('05')); // للتشخيص
      console.log('Phone number is numeric:', /^[0-9]+$/.test(requestData.phone_number)); // للتشخيص
      console.log('All required fields present:', {
        fullname: !!requestData.fullname,
        email: !!requestData.email,
        phone_number: !!requestData.phone_number,
        password: !!requestData.password
      }); // للتشخيص
      console.log('Request body JSON:', JSON.stringify(requestData)); // للتشخيص
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
      console.log('Request body stringified full with custom7:', JSON.stringify(requestData, null, '              ')); // للتشخيص
      console.log('Request body stringified full with custom8:', JSON.stringify(requestData, null, '                ')); // للتشخيص
      console.log('Request body stringified full with custom9:', JSON.stringify(requestData, null, '                  ')); // للتشخيص
      console.log('Request body stringified full with custom10:', JSON.stringify(requestData, null, '                    ')); // للتشخيص
      console.log('Request body stringified full with custom11:', JSON.stringify(requestData, null, '                      ')); // للتشخيص
      console.log('Request body stringified full with custom12:', JSON.stringify(requestData, null, '                        ')); // للتشخيص
      
      const response = await fetch('https://enqlygo.com/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('API Response:', result); // للتشخيص
      
      if (response.ok && result.status === 'success') {
        // حفظ بيانات المستخدم في localStorage
        if (result.data && result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        // إعادة توجيه إلى صفحة تسجيل الدخول بدون alert
        setTimeout(() => {
          navigate('/login');
        }, 500);
      } else {
        // معالجة أخطاء API
        if (result.errors) {
          // تعيين أخطاء الحقول
          Object.keys(result.errors).forEach(key => {
            let fieldName = key;
            if (key === 'fullname') fieldName = 'firstName';
            if (key === 'phone_number') fieldName = 'phone';
            
            setFieldError(fieldName, result.errors[key][0]);
          });
        } else {
          // تعيين رسالة خطأ عامة
          setStatus(result.message || result.error || 'حدث خطأ أثناء إنشاء الحساب');
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
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

  // دالة تنسيق رقم الهاتف
  const formatPhoneNumber = (value) => {
    // إزالة جميع الأحرف غير الرقمية
    const numbers = value.replace(/\D/g, '');
    
    // التأكد من أن الرقم يبدأ بـ 05
    if (numbers.length > 0 && !numbers.startsWith('05')) {
      return '05' + numbers.replace(/^05/, '');
    }
    
    // تحديد الطول الأقصى
    return numbers.substring(0, 10);
  };

  // دالة تنسيق الاسم
  const formatName = (value) => {
    // إزالة الأرقام والرموز الخاصة
    const cleanValue = value.replace(/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/g, '');
    
    // تحويل أول حرف إلى كبير
    if (cleanValue.length > 0) {
      return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
    }
    
    return cleanValue;
  };

  return (
    <>
      <style>{`
        body {
          margin-top: 0 !important;
          padding-top: 3rem !important;
        }
      `}</style>
      
      {/* Alert */}
      {showAlert && (
        <div 
          className="alert alert-warning mb-0 text-center national-day-alert" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1001,
            borderRadius: 0,
            padding: '0.5rem 0.75rem',
            fontSize: '13px'
          }}
        >
          <div className="container d-flex justify-content-between align-items-center">
            <span style={{ fontSize: '13px' }}>⚠️ هذا تنبيه مهم - يرجى قراءته قبل المتابعة</span>
            <button
              type="button"
              onClick={() => setShowAlert(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#856404',
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Register Navbar */}
      <nav className="bg-white shadow-sm register-navbar" style={{ padding: '0.7rem 0', marginTop: 0, position: 'fixed', top: showAlert ? '42px' : 0, left: 0, right: 0, zIndex: 1000, transition: 'top 0.3s ease' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Back Arrow */}
            <button
              onClick={() => navigate('/login')}
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

    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: showAlert ? '8rem' : '6rem', paddingBottom: '2rem', transition: 'padding-top 0.3s ease' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-6">
            <div className="bg-white rounded-4 shadow p-5">
              {/* Header */}
              <div className="text-end mb-5">
                <h2 style={{ 
                  color: '#484848', 
                  fontWeight: '700', 
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  marginBottom: '2.5rem'
                }}>
                  إنشاء حساب جديد
                </h2>
              </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, status, setFieldValue }) => (
                    <Form className="py-3">
                      {/* رسالة الخطأ العامة */}
                      {status && (
                        <div className="alert alert-danger mb-3" role="alert">
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          {status}
                        </div>
                      )}

                      {/* اسم الشخص المسؤول */}
                      <div className="mb-4">
                        <Field name="firstName">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{
                                  borderRadius: '10px',
                                  fontSize: '16px',
                                  padding: '1rem',
                                  border: '1px solid #e9ecef',
                                  backgroundColor: '#ffffff'
                                }}
                                placeholder="الاسم الكامل"
                                onChange={(e) => {
                                  const formattedValue = formatName(e.target.value);
                                  setFieldValue('firstName', formattedValue);
                                }}
                              />
                              <ErrorMessage name="firstName" component="div" className="invalid-feedback">
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

                      {/* البريد الإلكتروني */}
                      <div className="mb-4">
                        <Field name="email">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="email"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{
                                  borderRadius: '10px',
                                  fontSize: '16px',
                                  padding: '1rem',
                                  border: '1px solid #e9ecef',
                                  backgroundColor: '#ffffff'
                                }}
                                placeholder="البريد الإلكتروني"
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

                      {/* رقم الجوال */}
                      <div className="mb-4">
                        <Field name="phone">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="tel"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{
                                  borderRadius: '10px',
                                  fontSize: '16px',
                                  padding: '1rem',
                                  border: '1px solid #e9ecef',
                                  backgroundColor: '#ffffff'
                                }}
                                placeholder="05XXXXXXXX"
                                onChange={(e) => {
                                  const formattedValue = formatPhoneNumber(e.target.value);
                                  setFieldValue('phone', formattedValue);
                                }}
                              />
                              <ErrorMessage name="phone" component="div" className="invalid-feedback">
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
                        <Field name="password">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="password"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{
                                  borderRadius: '10px',
                                  fontSize: '16px',
                                  padding: '1rem',
                                  border: '1px solid #e9ecef',
                                  backgroundColor: '#ffffff'
                                }}
                                placeholder="كلمة المرور"
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

                      {/* تأكيد كلمة المرور */}
                      <div className="mb-4">
                        <Field name="confirmPassword">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="password"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{
                                  borderRadius: '10px',
                                  fontSize: '16px',
                                  padding: '1rem',
                                  border: '1px solid #e9ecef',
                                  backgroundColor: '#ffffff'
                                }}
                                placeholder="تأكيد كلمة المرور"
                                onChange={(e) => {
                                  const formattedValue = e.target.value.replace(/\s/g, '');
                                  setFieldValue('confirmPassword', formattedValue);
                                }}
                              />
                              <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback">
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

                      {/* زر التسجيل */}
                      <button
                        type="submit"
                        className="btn w-100 mt-2"
                        disabled={isSubmitting}
                        style={{
                          borderRadius: '10px',
                          fontSize: '16px',
                          backgroundColor: '#0171BD',
                          borderColor: '#0171BD',
                          color: '#ffffff',
                          fontWeight: '600',
                          padding: '1rem',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.setProperty('background-color', '#ffffff', 'important');
                            e.currentTarget.style.setProperty('color', '#0171BD', 'important');
                            e.currentTarget.style.setProperty('border-color', '#0171BD', 'important');
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(1, 113, 189, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.setProperty('background-color', '#0171BD', 'important');
                            e.currentTarget.style.setProperty('color', '#ffffff', 'important');
                            e.currentTarget.style.setProperty('border-color', '#0171BD', 'important');
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            جاري إنشاء الحساب...
                          </>
                        ) : (
                          'إنشاء حساب'
                        )}
                      </button>

                      {/* رابط تسجيل الدخول */}
                      <div className="text-end mt-5">
                        <Link 
                          to="/login" 
                          className="text-decoration-none d-inline-flex align-items-center gap-2"
                          style={{ 
                            color: '#0171BD', 
                            fontSize: '15px', 
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#015a94';
                            e.currentTarget.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#0171BD';
                            e.currentTarget.style.textDecoration = 'none';
                          }}
                        >
                          <span>هل لديك حساب؟ تسجيل الدخول</span>
                        </Link>
                      </div>
                    </Form>
                  )}
                </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;