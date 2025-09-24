import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEyeSlash,
  faTimes,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const RegisterStandalone = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { firstName, lastName, email, phone, password, confirmPassword, agreeToTerms } = formData;

    if (!firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!lastName.trim()) newErrors.lastName = 'الاسم الأخير مطلوب';
    
    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^(\+966|0)?[5-9][0-9]{8}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // هنا يمكن إضافة منطق إرسال البيانات الفعلي
      console.log('Registration data:', formData);
      
      // إعادة توجيه أو عرض رسالة نجاح
      alert('تم إنشاء الحساب بنجاح!');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData]);

  return (
    <div className="register-page-full">
      <div className="register-container-full">
        <div className="row g-0 h-100">
          {/* Left Side - Image */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
            <div className="register-image-container">
              <img 
                src="/register.svg" 
                alt="تسجيل الدخول" 
                className="register-image"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="register-card-full">
              {/* Header */}
              <div className="register-header">
                <div className="register-logo">
                  <img 
                    src="https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png" 
                    alt="غيم" 
                    className="logo-img"
                  />
                </div>
                <h2 className="register-title">انشاء حساب مركز طبي جديد</h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="register-form">
                <div className="mb-3">
                  <label className="form-label">
                    <span className="required-star">*</span> اسم الشخص المسؤول
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    placeholder="أدخل اسم الشخص المسؤول"
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <span className="required-star">*</span> رقم الجوال
                  </label>
                  <div className="phone-input-group">
                    <div className="phone-prefix">05</div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-control phone-input ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="XXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <span className="required-star">*</span> البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <span className="required-star">*</span> كلمة المرور
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="أدخل كلمة المرور"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <span className="required-star">*</span> تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="أكد كلمة المرور"
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-register w-100"
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
                      انشاء حساب
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="register-footer">
                <p className="text-center mb-0">
                  هل لديك حساب بالفعل ؟ 
                  <Link to="/login" className="login-link">
                    سجل دخولك
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStandalone;
