import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';

export default function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [lastSent, setLastSent] = useState(null);
  const CONTACT_URL = 'https://enqlygo.com/api/contact/submit';
  const validationSchema = Yup.object({
    fullName: Yup.string().trim().min(3, 'الاسم لا يقل عن 3 حروف').required('الاسم مطلوب'),
    email: Yup.string().email('البريد غير صالح').required('البريد مطلوب'),
    phone: Yup.string().matches(/^0?\d{9,12}$/, 'رقم الجوال غير صالح').required('رقم الجوال مطلوب'),
    subject: Yup.string().trim().max(150, 'الموضوع طويل جداً').optional(),
    message: Yup.string().trim().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل').required('الرسالة مطلوبة'),
    captcha: Yup.string().oneOf(['7'], 'الإجابة غير صحيحة').required('الإجابة مطلوبة'),
  });

  const initialValues = { fullName: '', email: '', phone: '', subject: '', message: '', captcha: '' };

  const submitForm = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      setStatus('جاري الإرسال...');
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('يجب تسجيل الدخول لإرسال الرسالة');
        setSubmitting(false);
        return;
      }

      const payload = {
        name: values.fullName,
        phone: values.phone,
        email: values.email,
        subject: values.subject,
        message: values.message,
      };

      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.status === 'error') {
        const msg = json?.message || `فشل الإرسال (HTTP ${res.status})`;
        setStatus(msg);
        setSubmitting(false);
        return;
      }

      const okMsg = json?.message || 'تم إرسال الرسالة بنجاح. سنتواصل معك قريباً';
      setStatus(okMsg);
      setSuccessMsg(okMsg);
      setLastSent({ fullName: values.fullName, subject: values.subject });
      setShowSuccess(true);
      resetForm();
    } catch (err) {
      setStatus('حدث خطأ أثناء الإرسال. حاول لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا - مركز غيم الطبي</title>
        <meta name="description" content="تواصل مع مركز غيم الطبي للاستفسارات والحجز. نحن هنا لخدمتك في أي وقت" />
        <meta name="keywords" content="تواصل, اتصل بنا, مركز غيم, استفسارات طبية, حجز موعد" />
        <meta property="og:title" content="تواصل معنا - مركز غيم الطبي" />
        <meta property="og:description" content="تواصل مع مركز غيم الطبي للاستفسارات والحجز" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="" style={{ marginTop: '120px' ,marginBottom: '100px' }}> 
     <div className="container py-3" dir="rtl">
      <h4 className="mb-4" style={{ fontSize: '1.5rem' }}>
        <span style={{ color: 'var(--color-main)', fontWeight: 'bolder' }}>تواصل معنا</span> 
        <span style={{ color: '#6c757d', fontWeight: 'bolder' }}>... يسعدنا تلقي استفسارك، و سنكون بخدمتك في أسرع وقت</span>
      </h4>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {({ isValid, isSubmitting, status }) => (
          <Form className="card p-4 shadow-sm">
            <div className="row g-3">
              <div className="col-lg-6">
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
                  الاسم الكامل <span className="text-danger">(مطلوب)</span>
                </label>
                <Field name="fullName" type="text" className="form-control" placeholder="اكتب اسمك الكامل" />
                <ErrorMessage name="fullName" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
                  البريد الإلكتروني <span className="text-danger">(مطلوب)</span>
                </label>
                <Field name="email" type="email" className="form-control" placeholder="example@mail.com" />
                <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
                  رقم الجوال <span className="text-danger">(مطلوب)</span>
                </label>
                <Field name="phone" type="tel" className="form-control" placeholder="05xxxxxxxx" />
                <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
                  الموضوع (اختياري)
                </label>
                <Field name="subject" type="text" className="form-control" placeholder="اكتب موضوع الرسالة" />
                <ErrorMessage name="subject" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
                  الرسالة <span className="text-danger">(مطلوبة)</span>
                </label>
                <Field as="textarea" name="message" rows="5" className="form-control" placeholder="اكتب رسالتك هنا" />
                <ErrorMessage name="message" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-lg-6">
                <label className="form-label" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6c757d' }}>
                  فضلاً أجب: 7 + 0 = ؟ <span className="text-danger">(مطلوب)</span>
                </label>
                <Field name="captcha" type="text" className="form-control" placeholder="أدخل الإجابة" />
                <ErrorMessage name="captcha" component="div" className="text-danger small mt-1" />
              </div>

              <div className="col-12 d-flex flex-column align-items-center">
                <button type="submit"
                  className="btn px-5"
                  disabled={!isValid || isSubmitting}
                  style={{
                    backgroundColor: (!isValid || isSubmitting) ? 'rgba(3, 143, 173, 0.4)' : 'var(--color-main)',
                    borderColor: (!isValid || isSubmitting) ? 'rgba(3, 143, 173, 0.4)' : 'var(--color-main)',
                    color: 'white',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    padding: '14px 40px',
                    minWidth: '240px',
                    transition: 'all 0.3s ease',
                    cursor: (!isValid || isSubmitting) ? 'not-allowed' : 'pointer',
                    opacity: (!isValid || isSubmitting) ? 0.85 : 1
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
                  {isSubmitting ? "جاري الإرسال..." : "إرسال"}
                </button>
                {status && (
                  <div className="mt-3 text-center" style={{ color: status.includes('نجاح') ? 'green' : '#6c757d' }}>{status}</div>
                )}
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
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title" style={{ color: 'var(--color-main)' }}>تم إرسال رسالتك</h5>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3" style={{ fontSize: '3rem', lineHeight: 1 }}>✅</div>
                <p className="mb-1" style={{ fontWeight: 600 }}>{successMsg}</p>
                {lastSent && (
                  <p className="text-muted small mb-0">
                    {lastSent.fullName ? `شكراً ${lastSent.fullName}` : 'شكراً لك'}{lastSent.subject ? ` • الموضوع: ${lastSent.subject}` : ''}
                  </p>
                )}
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button type="button" className="btn" style={{ background: 'var(--color-main)', color: '#fff', borderRadius: '24px', padding: '8px 20px' }} onClick={() => setShowSuccess(false)}>
                  حسناً
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
 </div>
    </>
  );
}