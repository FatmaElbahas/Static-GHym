import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';

export default function JobApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    nationality: "",
    appliedJob: "",
    notes: "",
    cv: null,
  });

  const [isValid, setIsValid] = useState(false);
  const [statusText, setStatusText] = useState("الزر معطّل حتى يتحقق التحقق");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const phonePattern = /^0?\d{9,12}$/;
    const valid =
      formData.fullName.trim().length >= 3 &&
      phonePattern.test(formData.phone) &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.appliedJob.trim() !== "";
    setIsValid(valid);
    setStatusText(valid ? "النموذج صالح، يمكنك الإرسال" : "الزر معطّل حتى يتحقق التحقق");
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitted(true);
    setStatusText("جاري الإرسال...");

    setTimeout(() => {
      setStatusText("تم إرسال الطلب بنجاح.");
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>الوظائف المتاحة - مركز غنيم الطبي</title>
        <meta name="description" content="انضم إلى فريق عمل مركز غنيم الطبي. وظائف متاحة في مختلف التخصصات" />
        <meta name="keywords" content="وظائف طبية, توظيف, مدير نمو, مركز غنيم" />
        <meta property="og:title" content="الوظائف المتاحة - مركز غنيم الطبي" />
        <meta property="og:description" content="انضم إلى فريق عمل مركز غنيم الطبي" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="my-5">
      <div className="container  py-5" dir="rtl">
      <div className="mb-4">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th style={{ width: "40%" }}>الوظيفة المتقدم لها</th>
              <th>الوصف</th>
              <th style={{ width: "100px" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>مدير النمو</td>
              <td>
                مدير نمو لقيادة استراتيجيات التوسع، والتسويق، والمبيعات، وتنفيذ
                مبادرات اكتساب العملاء (المراكز الطبية والمستخدمين)، وتحسين
                معدلات التحويل وتحقيق نمو مستدام.
              </td>
              <td>
                <button className="btn btn-outline-primary btn-sm">تقديم</button>
              </td>
            </tr>
            <tr>
              <td>تقديم عام</td>
              <td>تقديم عام</td>
              <td>
                <button className="btn btn-outline-primary btn-sm">تقديم</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-lg-6">
            <label className="form-label">
              الاسم الكامل <span className="text-danger">مطلوب</span>
            </label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="اكتب اسمك الكامل"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">
              رقم الجوال <span className="text-danger">مطلوب</span>
            </label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="05xxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">
              البريد الإلكتروني <span className="text-danger">مطلوب</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">الجنسية</label>
            <select name="nationality"
              className="form-control"
              value={formData.nationality}
              onChange={handleChange}
            >
              <option value="">اختر الجنسية</option>
              <option>مصري</option>
              <option>سعودي</option>
              <option>أردني</option>
              <option>لبناني</option>
              <option>غير ذلك</option>
            </select>
          </div>

          <div className="col-lg-6">
            <label className="form-label">
              الوظيفة المتقدم لها <span className="text-danger">مطلوب</span>
            </label>
            <input
              type="text"
              name="appliedJob"
              className="form-control"
              placeholder="اكتب الوظيفة"
              value={formData.appliedJob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-lg-6">
            <label className="form-label">السيرة الذاتية (تحميل)</label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">ملاحظات</label>
            <textarea
              name="notes"
              rows="5"
              className="form-control"
              placeholder="اكتب ملاحظاتك هنا"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="col-12 d-flex align-items-center">
            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={!isValid || submitted}
            >
              {submitted ? "جاري الإرسال..." : "إرسال"}
            </button>
            <div className="ms-3 text-muted">{statusText}</div>
          </div>
        </div>
      </form>
    </div>
</div>
    </>
  );
}