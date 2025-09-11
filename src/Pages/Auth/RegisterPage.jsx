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
  faUserPlus
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
        
        alert('تم إنشاء الحساب بنجاح!');
        // إعادة توجيه إلى صفحة تسجيل الدخول
        navigate('/login');
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
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container-fluid">
        <div className="row g-0 min-vh-100">
          {/* النموذج */}
          <div className="col-lg-6 d-flex align-items-center">
            <div className="w-100 px-4 px-lg-5">
              <div className="bg-white rounded-3 shadow-sm p-4 p-lg-5" style={{maxWidth: '500px', margin: '0 auto'}}>
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <img 
                      src={logo} 
                      alt="Logo" 
                      style={{width: '40px', height: '40px', objectFit: 'contain'}}
                    />
                  </div>
                  <h2 className="h4 fw-bold text-dark mb-0">انشاء حساب مركز طبي جديد</h2>
                </div>

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

                      {/* اسم الشخص المسؤول */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold" style={{fontSize: '0.9rem'}}>
                          <span className="text-danger">*</span> اسم الشخص المسؤول
                        </label>
                        <Field name="firstName">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{borderRadius: '10px', fontSize: '0.9rem'}}
                                placeholder="أدخل اسم الشخص المسؤول"
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
                                placeholder="أدخل البريد الإلكتروني"
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
                      <div className="mb-3">
                        <label className="form-label fw-semibold" style={{fontSize: '0.9rem'}}>
                          <span className="text-danger">*</span> رقم الجوال
                        </label>
                        <Field name="phone">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="tel"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{borderRadius: '10px', fontSize: '0.9rem'}}
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
                      <div className="mb-3">
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

                      {/* تأكيد كلمة المرور */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold" style={{fontSize: '0.9rem'}}>
                          <span className="text-danger">*</span> تأكيد كلمة المرور
                        </label>
                        <Field name="confirmPassword">
                          {({ field, meta }) => (
                            <div>
                              <input
                                {...field}
                                type="password"
                                className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                                style={{borderRadius: '10px', fontSize: '0.9rem'}}
                                placeholder="أعد إدخال كلمة المرور"
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
                            جاري إنشاء الحساب...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            إنشاء حساب
                          </>
                        )}
                      </button>

                      {/* رابط تسجيل الدخول */}
                      <div className="text-center mt-3">
                        <p className="text-muted mb-0" style={{fontSize: '0.9rem'}}>
                          لديك حساب بالفعل؟{' '}
                          <Link 
                            to="/login" 
                            className="text-decoration-none fw-semibold"
                            style={{color: '#038FAD'}}
                          >
                            تسجيل الدخول
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>

          {/* الصورة */}
          <div className="col-lg-6 d-none d-lg-block">
            <div 
              className="h-100 d-flex align-items-center justify-content-center"
              style={{
                backgroundImage: 'url(/register.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;