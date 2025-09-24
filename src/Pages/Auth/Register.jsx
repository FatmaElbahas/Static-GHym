import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEyeSlash,
  faTimes,
  faUserPlus
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
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row g-0 min-vh-100 d-flex align-items-center justify-content-start ">
          <div className="col-lg-6 ">
            <div className="w-full p-4">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <img 
                    src="https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png" 
                    alt="غيم" 
                    className="img-fluid"
                    style={{width: '80px', height: '80px'}}
                  />
                </div>
                <h2 className="h3 fw-bold text-dark mb-0">انشاء حساب مركز طبي جديد</h2>
              </div>

              {/* Form */}<form onSubmit={handleSubmit}>
                {/* الاسم الكامل */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <span className="text-danger">*</span> الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className={`form-control form-control-lg ${errors.fullname ? 'is-invalid' : ''}`}
                    placeholder="أدخل الاسم الكامل"
                  />
                  {errors.fullname && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.fullname}
                    </div>
                  )}
                </div>

                {/* الهاتف */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <span className="text-danger">*</span> رقم الجوال
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className={`form-control form-control-lg ${errors.phone_number ? 'is-invalid' : ''}`}
                    placeholder="05XXXXXXXX"
                  />
                  {errors.phone_number && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.phone_number}
                    </div>
                  )}
                </div>

                {/* الإيميل */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <span className="text-danger">*</span> البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* كلمة المرور */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <span className="text-danger">*</span> كلمة المرور
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="أدخل كلمة المرور"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="mb-4"><label className="form-label fw-semibold">
                    <span className="text-danger">*</span> تأكيد كلمة المرور
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="أكد كلمة المرور"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
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
                  className="btn btn-primary btn-lg w-100 py-3"
                  disabled={isSubmitting}
                  style={{backgroundColor: '#038FAD', borderColor: '#038FAD'}}
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
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  هل لديك حساب بالفعل ؟ 
                  <Link to="/login" className="text-decoration-none fw-semibold ms-1" style={{color: '#038FAD'}}>
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

export default Register;
