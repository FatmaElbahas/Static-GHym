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
        <title>تواصل معنا - مركز بلسمي الطبي</title>
        <meta name="description" content="تواصل مع مركز بلسمي الطبي للاستفسارات والحجز. نحن هنا لخدمتك في أي وقت" />
        <meta name="keywords" content="تواصل, اتصل بنا, مركز بلسمي, استفسارات طبية, حجز موعد" />
        <meta property="og:title" content="تواصل معنا - مركز بلسمي الطبي" />
        <meta property="og:description" content="تواصل مع مركز بلسمي الطبي للاستفسارات والحجز" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="my-5"> 
     <div className="container py-5" dir="rtl">
      <h4 className="mb-4">
        <span className="text-primary">تواصل معنا</span> ... يسعدنا تلقي استفسارك، و سنكون بخدمتك في أسرع وقت
      </h4>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-lg-6">
            <label className="form-label">
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
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">
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
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">
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
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">
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
            />
          </div>

          <div className="col-12">
            <label className="form-label">
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
            ></textarea>
          </div>

          <div className="col-12 d-flex align-items-center">
            <button type="submit"
              className="btn btn-success px-4"
              disabled={!isValid || submitted}
            >
              {submitted ? "جاري الإرسال..." : "إرسال"}
            </button>
            <div className="ms-3 text-muted">{status}</div>
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center mt-4 text-primary">
        <div>
          <a href="mailto:info@blsmy.com">info@blsmy.com</a>
        </div>
        <div>
          <a href="https://wa.me/966539366005" target="_blank" rel="noreferrer">
            +966539366005
          </a>
        </div>
      </div>
    </div>
 </div>
    </>
  );
}