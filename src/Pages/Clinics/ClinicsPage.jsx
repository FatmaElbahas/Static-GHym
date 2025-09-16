import React from 'react'
import { Helmet } from 'react-helmet-async'
import image1 from '../../assets/images/card1.png';
import image2 from '../../assets/images/card2.png';
import image3 from '../../assets/images/card3.png';
import image4 from '../../assets/images/card4.png';
import image5 from '../../assets/images/card5.png';
import image6 from '../../assets/images/card6.png';
import image7 from '../../assets/images/card7.png';
import image8 from '../../assets/images/card8.png';
const clinics = [
  {
    id: 1,
    name: "مجمع الدمام الأهلي الطبي",
    city: "الدمام - الجلوية",
    rating: 4.8,
    doctors: 51,
    clinics: 13,
    reviews: 4077,
    link: "/details/1",
    image: image1,
  },
  {
    id: 2,
    name: "عيادات برايت التخصصية",
    city: "الخبر - الهدا",
    rating: 5.0,
    doctors: 8,
    clinics: 6,
    reviews: 1,
    link: "/details/2",
    image:image2,
  },
  {
    id: 3,
    name: "مجمع سمو الطبي",
    city: "الخبر - قرطبة",
    rating: 4.9,
    doctors: 11,
    clinics: 8,
    reviews: 100,
    link: "/details/3",
    image:image3
  },
  {
    id: 4,
    name: "مجمع غيم الطبي",
    city: "جدة - الحمدانية",
    rating: 4.8,
    doctors: 10,
    clinics: 4,
    reviews: 1341,
    link: "/details/4",
    image:image4,
  },
  {
    id: 5,
    name: "مجمع عناية السنابل الطبي",
    city: "جدة - السنابل",
    rating: 5.0,
    doctors: 6,
    clinics: 3,
    reviews: 250,
    link: "/details/5",
    image: image5,
  },
  {
    id: 6,
    name: "عيادات اللؤلؤة لطب الأسنان",
    city: "الدمام - المزروعية",
    rating: 5.0,
    doctors: 7,
    clinics: 2,
    reviews: 98,
    link: "/details/6",
    image: image6
  },
  {
    id: 7,
    name: "مجمع باسم الطبي",
    city: "الدمام",
    rating: 5.0,
    doctors: 2,
    clinics: 2,
    reviews: 50,
    link: "/details/7",
    image:image7
  },
  {
    id: 8,
    name: "مجمع آخر للتجربة",
    city: "الرياض",
    rating: 4.7,
    doctors: 5,
    clinics: 3,
    reviews: 70,
    link: "/details/8",
    image: image8
  }
];
export default function Clinics() {
  return (
    <>
      <Helmet>
        <title>المراكز الطبية - مركز غنيم الطبي</title>
        <meta name="description" content="اكتشف أفضل المراكز الطبية الشريكة مع مركز غنيم. عيادات متخصصة في مختلف التخصصات الطبية" />
        <meta name="keywords" content="مراكز طبية, عيادات, أطباء, تخصصات طبية, غنيم" />
        <meta property="og:title" content="المراكز الطبية - مركز غنيم الطبي" />
        <meta property="og:description" content="اكتشف أفضل المراكز الطبية الشريكة مع مركز غنيم" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className='my-5'>
      <div className="container">
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <h2 className='color-main'>المراكز الطبية</h2>
            <p>قصص النجاح لشركائنا الموقرين من المراكز الطبية</p>
          </div>
          <div>
            <input type="search" className='form-control rounded-pill py-2 px-5'placeholder='.....ابحث عن المركز الطبي' />
          </div>
        </div>
            <div className="row">
        {clinics.map((clinic) => (
          <div className="col-md-3 mb-4" key={clinic.id}>
          <div className="card h-100 shadow p-3" style={{ cursor: "pointer" }}
     onClick={() => (window.location.href = clinic.link)}>
<div className='d-flex justify-content-between align-items-center' >
  <img src={clinic.image} className="card-img-top w-25 h-25 rounded" alt={clinic.name} />
  <div className="card-body">
   <div className='d-flex flex-column gap-0' >
     <h5 className="card-title  fs-6">{clinic.name}</h5>
    <p className="card-text text-secondary my-0 ">{clinic.city}</p>
    <p className="card-text ">⭐ {clinic.rating}</p>
   </div>

  </div>
  </div>
<hr />
<div className="d-flex justify-content-around text-center">
  <div>
    <h5 className="mb-0">{clinic.doctors}</h5>
    <small className="text-muted">طبيب</small>
  </div>
  <div>
    <h5 className="mb-0">{clinic.clinics}</h5>
    <small className="text-muted">عيادة</small>
  </div>
  <div>
    <h5 className="mb-0">{clinic.reviews}</h5>
    <small className="text-muted">تقييم</small>
  </div>
</div>

</div>
</div>
      
        ))}
      </div>
    </div>
      </div>
    </>
  )
}
