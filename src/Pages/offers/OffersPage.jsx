import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Offer1 from '../../assets/images/Offer_1.png';
import Offer2 from '../../assets/images/Offer_2.png';
import Offer3 from '../../assets/images/Offer_3.png';
import Offer4 from '../../assets/images/Offer_4.png';
import Offer5 from '../../assets/images/Offer_5.png';
import Offer6 from '../../assets/images/Offer_6.png';
import Offer7 from '../../assets/images/Offer_7.png';
import Offer8 from '../../assets/images/Offer_8.png';
import Offer9 from '../../assets/images/Offer_9.png';

export default function Offers() {
  const [isLoading, setIsLoading] = useState(true);

  const offers = [
    { id: 1, title: "باقات اليوم الوطني", desc: "95 ر.س", img: Offer1, category: "جلدية" },
    { id: 2, title: "فركشنال ليزر", desc: "295 ر.س", img: Offer2, category: "جلدية" },
    { id: 3, title: "فحص الرخصة", desc: "795 ر.س", img: Offer3, category: "جلدية" },
    { id: 4, title: "الفحص المدرسي", desc: "115 ر.س", img: Offer4, category: "جلدية" },
    { id: 5, title: "باقات اليوم الوطني", desc: "95 ر.س", img: Offer5, category: "جلدية" },
    { id: 6, title: "باقات اليوم الوطني", desc: "1345 ر.س", img: Offer6, category: "جلدية" },
    { id: 7, title: "باقات اليوم الوطني", desc: "795 ر.س", img: Offer7, category: "جلدية" },
    { id: 8, title: "باقات اليوم الوطني", desc: "195 ر.س", img: Offer8, category: "أخرى" },
    { id: 9, title: "باقات اليوم الوطني", desc: "1495 ر.س", img: Offer9, category: "أخرى" },
  ];

  // محاكاة تحميل البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // تحميل لمدة 1.5 ثانية

    return () => clearTimeout(timer);
  }, []);

  const renderOffers = (filteredOffers) =>
    filteredOffers.map((offer) => (
      <div className="col-12 col-sm-6 col-md-3 d-flex justify-content-center" key={offer.id}>
        <div className="card w-100 h-100 border-0 text-center" style={{ 
          maxWidth: "250px", 
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          background: "white"
        }}>
          <img
            src={offer.img}
            alt={offer.title}
            className="img-fluid shadow rounded-5 mt-3"
            style={{ width: "100%", height: "260px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title fw-semibold">{offer.title}</h5>
            <p className="card-text text-muted">{offer.desc}</p>
            <button className="btn bg-main text-white mt-2">
              <FontAwesomeIcon icon={faClock} className="me-2" />
              حجز موعد
            </button>
            
          </div>
        </div>
      </div>
    ));

  // مكون Loading
  const LoadingComponent = () => (
    <div className="offers d-flex align-items-center justify-content-center my-5">
      <div className="container shadow custom-border rounded p-5 my-5">
        <div className="text-center">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div>
              <FontAwesomeIcon 
                icon={faSpinner} 
                spin 
                size="3x" 
                className="text-primary mb-3"
                style={{ color: '#038FAD' }}
              />
              <h4 className="text-muted">جاري تحميل العروض...</h4>
              <p className="text-muted">يرجى الانتظار قليلاً</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>العروض والخدمات - مركز بلسمي الطبي</title>
          <meta name="description" content="استفد من عروضنا المميزة على الخدمات الطبية والجلدية. احجز موعدك الآن واستثمر في صحتك مع باقاتنا الشاملة" />
          <meta name="keywords" content="عروض طبية, خدمات جلدية, فحص الرخصة, فحص مدرسي, فركشنال ليزر, مركز بلسمي" />
          <meta property="og:title" content="العروض والخدمات - مركز بلسمي الطبي" />
          <meta property="og:description" content="استفد من عروضنا المميزة على الخدمات الطبية والجلدية" />
          <meta property="og:type" content="website" />
        </Helmet>
        <LoadingComponent />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>العروض والخدمات - مركز بلسمي الطبي</title>
        <meta name="description" content="استفد من عروضنا المميزة على الخدمات الطبية والجلدية. احجز موعدك الآن واستثمر في صحتك مع باقاتنا الشاملة" />
        <meta name="keywords" content="عروض طبية, خدمات جلدية, فحص الرخصة, فحص مدرسي, فركشنال ليزر, مركز بلسمي" />
        <meta property="og:title" content="العروض والخدمات - مركز بلسمي الطبي" />
        <meta property="og:description" content="استفد من عروضنا المميزة على الخدمات الطبية والجلدية" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="offers d-flex align-items-center justify-content-center my-5">
      <div className="container shadow custom-border rounded p-5 my-5">
        <h1 className="color-main fs-2">احجز موعدك الآن واستفد من عروضنا</h1>
        <p className="text-muted">
          عروضنا تمنحك الصحة والعافية بأسعار لا تقبل المنافسة. استثمر في صحتك
          مع باقاتنا الشاملة التي تلبي جميع احتياجاتك الصحية ...
        </p>

        <div className="d-inline-block border w-100 rounded-pill p-2">
          <ul className="nav nav-pills mb-3 justify-content-center gap-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button className="nav-link active rounded-pill px-4" id="pills-all-tab" data-bs-toggle="pill" data-bs-target="#pills-all" type="button" role="tab">الكل</button>
            </li>
            <li className="nav-item">
              <button className="nav-link rounded-pill px-4" id="pills-skin-tab" data-bs-toggle="pill" data-bs-target="#pills-skin" type="button" role="tab">جلدية</button>
            </li>
            <li className="nav-item">
              <button className="nav-link rounded-pill px-4" id="pills-other-tab" data-bs-toggle="pill" data-bs-target="#pills-other" type="button" role="tab">أخرى</button>
            </li>
          </ul>
        </div>

        <div className="tab-content mt-3" id="pills-tabContent">
          <div className="tab-pane fade show active" id="pills-all" role="tabpanel">
            <div className="row justify-content-center gx-2 gy-3">
              {renderOffers(offers)}
            </div>
          </div><div className="tab-pane fade" id="pills-skin" role="tabpanel">
            <div className="row gx-2 gy-3">
              {renderOffers(offers.filter((o) => o.category === "جلدية"))}
            </div>
          </div>

          <div className="tab-pane fade" id="pills-other" role="tabpanel">
            <div className="row gx-2 gy-3">
              {renderOffers(offers.filter((o) => o.category === "أخرى"))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}