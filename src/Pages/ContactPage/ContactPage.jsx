import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
    captcha: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("الزر معطّل حتى يتم التحقق");

  useEffect(() => {
    const phonePattern = /^0?\d{9,12}$/;
    const emailPattern = /\S+@\S+\.\S+/;
    const valid =
      formData.fullName.trim().length >= 3 &&
      phonePattern.test(formData.phone) &&
      emailPattern.test(formData.email) &&
      formData.message.trim().length > 5 &&
      formData.captcha.trim() === "7";
    setIsValid(valid);
    setStatus(valid ? "النموذج صالح، يمكنك الإرسال" : "الزر معطّل حتى يتم التحقق");
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitted(true);
    setStatus("جاري الإرسال...");

    setTimeout(() => {
      setStatus("تم إرسال الرسالة بنجاح.");
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا - مركز غنيم الطبي</title>
        <meta name="description" content="تواصل مع مركز غنيم الطبي للاستفسارات والحجز. نحن هنا لخدمتك في أي وقت" />
        <meta name="keywords" content="تواصل, اتصل بنا, مركز غنيم, استفسارات طبية, حجز موعد" />
        <meta property="og:title" content="تواصل معنا - مركز غنيم الطبي" />
        <meta property="og:description" content="تواصل مع مركز غنيم الطبي للاستفسارات والحجز" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="" style={{ marginTop: '120px' ,marginBottom: '100px' }}> 
     <div className="container py-3" dir="rtl">
      <h4 className="mb-4" style={{ fontSize: '1.5rem' }}>
        <span style={{ color: 'var(--color-main)', fontWeight: 'bolder' }}>تواصل معنا</span> 
        <span style={{ color: '#6c757d', fontWeight: 'bolder' }}>... يسعدنا تلقي استفسارك، و سنكون بخدمتك في أسرع وقت</span>
      </h4>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-lg-6">
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
              الاسم الكامل <span className="text-danger">(مطلوب)</span>
            </label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="اكتب اسمك الكامل"
              required
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
              البريد الإلكتروني <span className="text-danger">(مطلوب)</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
              رقم الجوال <span className="text-danger">(مطلوب)</span>
            </label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              placeholder="05xxxxxxxx"
              required
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
              فضلاً أجب: 7 + 0 = ؟ <span className="text-danger">(مطلوب)</span>
            </label>
            <input
              type="text"
              name="captcha"
              className="form-control"
              value={formData.captcha}
              onChange={handleChange}
              placeholder="أدخل الإجابة"
              required
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
              الرسالة <span className="text-danger">(مطلوبة)</span>
            </label>
            <textarea
              name="message"
              rows="5"
              className="form-control"
              value={formData.message}
              onChange={handleChange}
              placeholder="اكتب رسالتك هنا"
              required
              style={{ fontSize: '0.95rem' }}
            ></textarea>
          </div>

          <div className="col-12 d-flex justify-content-center">
            <button type="submit"
              className="btn px-5"
              disabled={!isValid || submitted}
              style={{
                backgroundColor: (!isValid || submitted) ? 'rgba(3, 143, 173, 0.4)' : 'var(--color-main)',
                borderColor: (!isValid || submitted) ? 'rgba(3, 143, 173, 0.4)' : 'var(--color-main)',
                color: 'white',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                padding: '14px 40px',
                minWidth: '240px',
                transition: 'all 0.3s ease',
                cursor: (!isValid || submitted) ? 'not-allowed' : 'pointer',
                opacity: (!isValid || submitted) ? 0.85 : 1
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#027a8a';
                  e.target.style.borderColor = '#027a8a';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(3, 143, 173, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--color-main)';
                  e.target.style.borderColor = 'var(--color-main)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {submitted ? "جاري الإرسال..." : "إرسال"}
            </button>
          </div>
        </div>
        {/* Contact info box inside the form matching the message input width */}
        <div className="row g-3 mt-2">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center p-4 rounded shadow-sm" style={{ backgroundColor: '#ffffff', width: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
              <a href="mailto:info@ghanim.com" style={{ color: 'var(--color-main)', fontSize: '1rem', fontWeight: 'bold' }}>
                info@ghanim.com
              </a>
              <a href="https://wa.me/966539366005" target="_blank" rel="noreferrer" style={{ color: 'var(--color-main)', fontSize: '1rem', fontWeight: 'bold' }}>
                +966539366005
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
 </div>
    </>
  );
}