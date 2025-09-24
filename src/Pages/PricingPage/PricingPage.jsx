import React, { useState, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
export default function PricingPage() {
  const [isMonthly, setIsMonthly] = useState(true)

  // Memoize plans data to prevent unnecessary re-renders
  const plans = useMemo(() => [
    {
      name: "البداية",
      monthlyPrice: "حتى 30 حجز شهرياً",
      annualPrice: "حتى 30 حجز شهرياً",
      features: [
        { name: "نظام حجز المواعيد", included: true, note: "حتى 30 حجز شهرياً" },
        { name: "الانضمام لتطبيق بلسمى", included: true },
        { name: "نظام التذكيرات", included: false },
        { name: "نظام التقييمات", included: false },
        { name: "متجر العروض", included: false },
        { name: "الأكواد الترويجية", included: false },
        { name: "حجوزات الزيارات المنزلية", included: false },
        { name: "السداد الإلكتروني", included: false },
        { name: "الموقع التعريفي للمركز", included: false },
        { name: "نظام التوظيف", included: false },
        { name: "الربط البرمجي", included: false },
        { name: "تطوير تطبيق خاص", included: false }
      ]
    },
    {
      name: "النمو",
      monthlyPrice: "نسبة من الحجوزات",
      annualPrice: "نسبة من الحجوزات",
      features: [
        { name: "نظام حجز المواعيد", included: true },
        { name: "الانضمام لتطبيق بلسمى", included: true },
        { name: "نظام التذكيرات", included: true },
        { name: "نظام التقييمات", included: false },
        { name: "متجر العروض", included: false },
        { name: "الأكواد الترويجية", included: false },
        { name: "حجوزات الزيارات المنزلية", included: false },
        { name: "السداد الإلكتروني", included: false },
        { name: "الموقع التعريفي للمركز", included: false },
        { name: "نظام التوظيف", included: false },
        { name: "الربط البرمجي", included: false },
        { name: "تطوير تطبيق خاص", included: false }
      ]
    },
    {
      name: "التميز",
      monthlyPrice: "700 ر.س",
      annualPrice: "560 ر.س",
      isPopular: true,
      features: [
        { name: "نظام حجز المواعيد", included: true },
        { name: "الانضمام لتطبيق بلسمى", included: true },
        { name: "نظام التذكيرات", included: true },
        { name: "نظام التقييمات", included: true },
        { name: "متجر العروض", included: true },
        { name: "الأكواد الترويجية", included: true },
        { name: "حجوزات الزيارات المنزلية", included: true },
        { name: "السداد الإلكتروني", included: true },
        { name: "الموقع التعريفي للمركز", included: true },
        { name: "نظام التوظيف", included: true },
        { name: "الربط البرمجي", included: true, note: "بتكلفة خاصة" },
        { name: "تطوير تطبيق خاص", included: false }
      ]
    },
    {
      name: "الاحترافية",
      monthlyPrice: "4,000 ر.س",
      annualPrice: "3,200 ر.س",
      features: [
        { name: "نظام حجز المواعيد", included: true },
        { name: "الانضمام لتطبيق بلسمى", included: true },
        { name: "نظام التذكيرات", included: true },
        { name: "نظام التقييمات", included: true },
        { name: "متجر العروض", included: true },
        { name: "الأكواد الترويجية", included: true },
        { name: "حجوزات الزيارات المنزلية", included: true },
        { name: "السداد الإلكتروني", included: true },
        { name: "الموقع التعريفي للمركز", included: true },
        { name: "نظام التوظيف", included: true },
        { name: "الربط البرمجي", included: true, note: "بتكلفة خاصة" },
        { name: "تطوير تطبيق خاص", included: true, note: "4 أشهر مقدماً" }
      ]
    }
  ], []) // Empty dependency array since plans data is static

  // Memoize toggle handlers to prevent unnecessary re-renders
  const handleMonthlyToggle = useCallback(() => setIsMonthly(true), [])
  const handleAnnualToggle = useCallback(() => setIsMonthly(false), [])

  return (
    <>
      <Helmet>
        <title>خطط التسعير - مركز غيم الطبي</title>
        <meta name="description" content="اختر الخطة المناسبة لمركزك الطبي. باقات متنوعة تبدأ من البداية حتى الاحترافية" />
        <meta name="keywords" content="تسعير, باقات, اشتراك, مركز طبي, غيم" />
        <meta property="og:title" content="خطط التسعير - مركز غيم الطبي" />
        <meta property="og:description" content="اختر الخطة المناسبة لمركزك الطبي" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="pricing-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="mb-4">
            <img 
              src="https://www.w3schools.com/howto/img_avatar.png" 
              alt="صورة تعبيرية" 
              className="rounded-circle"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              loading="lazy"
              decoding="async"
            />
          </div>
          <h1 className="display-4 fw-bold color-main mb-3">خطط التسعير</h1>
          <p className="lead text-muted">اختر الخطة المناسبة لمركزك الطبي</p>
        </div>

        <div className="d-flex justify-content-center mb-5">
          <div className="pricing-toggle">
            <button 
              className={`toggle-btn ${isMonthly ? 'active' : ''}`}
              onClick={handleMonthlyToggle}
            >
              شهرياً
            </button>
            <button 
              className={`toggle-btn ${!isMonthly ? 'active' : ''}`}
              onClick={handleAnnualToggle}
            >
              سنوياً (خصم 20%)
            </button>
          </div>
        </div>

        <div className="pricing-table-container">
          <div className="table-responsive">
            <table className="table pricing-table">
              <thead>
                <tr>
                  <th className="service-column">الخدمة</th>
                  {plans.map((plan, index) => (
                    <th key={index} className={`plan-column ${plan.isPopular ? 'popular' : ''}`}>
                      <div className="plan-header">
                        <h5 className="plan-name">{plan.name}</h5>
                        {plan.isPopular && <span className="popular-badge">الأكثر طلباً</span>}
                        <div className="plan-price">
                          {isMonthly ? plan.monthlyPrice : plan.annualPrice}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((feature, featureIndex) => (
                  <tr key={featureIndex}>
                    <td className="feature-name">
                      {feature.name}
                      {feature.note && <sup>[1]</sup>}
                    </td>
                    {plans.map((plan, planIndex) => (
                      <td key={planIndex} className={`feature-cell ${plan.isPopular ? 'popular' : ''}`}>
                        {plan.features[featureIndex].included ? (
                          <span className="check-mark">✓</span>
                        ) : (
                          <span className="cross-mark">✗</span>
                        )}
                        {plan.features[featureIndex].note && (
                          <small className="feature-note d-block mt-1">
                            {plan.features[featureIndex].note}
                          </small>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="footnotes mt-4">
          <div className="row">
            <div className="col-md-8">
              <p className="footnote">
                <sup>[1]</sup> الربط البرمجي مع النظام الداخلي للمركز بتكلفة خاصة
              </p>
              <p className="footnote">
                <sup>[2]</sup> الباقة الاحترافية تتطلب سداد 4 أشهر مقدماً عند الاشتراك لأول مرة
              </p>
              <p className="footnote">
                <sup>[3]</sup> يضاف 15% مبلغ ضريبة القيمة المضافة
              </p>
            </div>
          </div>
        </div>

        <div className="subscription-section mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="subscription-form">
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="termsCheck" />
                  <label className="form-check-label" htmlFor="termsCheck">
                    أوافق على الشروط والأحكام
                  </label>
                </div>
                <button className="btn btn-primary btn-lg w-100 subscribe-btn">
                  اشترك الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
