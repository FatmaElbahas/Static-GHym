import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { fullname, email, phone_number, password, confirmPassword, agreeToTerms } = formData;

    if (!fullname.trim()) newErrors.fullname = 'الاسم الكامل مطلوب';
    
    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!phone_number.trim()) {
      newErrors.phone_number = 'رقم الهاتف مطلوب';
    } else if (!/^(\+966|0)?[5-9][0-9]{8}$/.test(phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'رقم الهاتف غير صحيح';
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
      const response = await fetch("https://enqlygo.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          phone_number: formData.phone_number
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("تم إنشاء الحساب بنجاح!");
        console.log("Response:", data);
      } else {
        alert(data.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData]);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-6">
            <div className="bg-white rounded-4 shadow p-5">
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

              {/* Form */}<form onSubmit={handleSubmit}>
                {/* الاسم الكامل */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '10px',
                      fontSize: '16px',
                      padding: '1rem',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff'
                    }}
                    placeholder="الاسم الكامل"
                  />
                  {errors.fullname && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.fullname}
                    </div>
                  )}
                </div>

                {/* الهاتف */}
                <div className="mb-4">
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '10px',
                      fontSize: '16px',
                      padding: '1rem',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff'
                    }}
                    placeholder="رقم الجوال"
                  />
                  {errors.phone_number && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.phone_number}
                    </div>
                  )}
                </div>

                {/* الإيميل */}
                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '10px',
                      fontSize: '16px',
                      padding: '1rem',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff'
                    }}
                    placeholder="البريد الإلكتروني"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* كلمة المرور */}
                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '10px',
                      fontSize: '16px',
                      padding: '1rem',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff'
                    }}
                    placeholder="كلمة المرور"
                    />
                  {errors.password && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="mb-4">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '10px',
                      fontSize: '16px',
                      padding: '1rem',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff'
                    }}
                    placeholder="تأكيد كلمة المرور"
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* زرار الإنشاء */}
                <button
                  type="submit"
                  className="btn w-100 mt-2"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: '10px',
                    fontSize: '16px',
                    backgroundColor: '#DFD458',
                    borderColor: '#DFD458',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '1rem',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#C5B34E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor = '#DFD458';
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
              </form>

              {/* Login Link */}
              <div className="text-end mt-5">
                <Link 
                  to="/login" 
                  className="text-decoration-none d-inline-flex align-items-center gap-2"
                  style={{ 
                    color: '#DFD458', 
                    fontSize: '15px', 
                    fontWeight: '500' 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#C5B34E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#DFD458'}
                >
                  <span>هل لديك حساب؟ تسجيل الدخول</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
