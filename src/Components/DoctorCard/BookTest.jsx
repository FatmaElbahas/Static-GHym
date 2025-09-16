import React from 'react';
import DoctorCard from './DoctorCard';

/**
 * مكون اختبار لـ DoctorCard في سياق صفحة Book
 */
const BookTest = () => {
  // بيانات تجريبية تحاكي البيانات من API
  const testData = [
    {
      id: 1,
      owner_name: "د. أحمد محمد السعد",
      salon_name: "عيادة الأسنان المتميزة",
      salon_address: "شارع الملك فهد، حي النخيل، الرياض 12345",
      salon_phone: "+966 11 234 5678",
      rating: 4.8,
      reviews_avg_rating: 4.9,
      total_completed_bookings: 156,
      salon_categories: "1,2",
      owner_photo: null,
      created_at: "2024-01-15T10:30:00.000000Z",
      updated_at: "2024-12-01T14:20:00.000000Z"
    },
    {
      id: 2,
      owner_name: "د. سارة أحمد الزهراني",
      salon_name: "مركز طب الأسنان المتقدم",
      salon_address: "طريق الملك عبدالعزيز، حي الروضة، جدة 21432",
      salon_phone: "+966 12 345 6789",
      rating: 4.2,
      reviews_avg_rating: 4.6,
      total_completed_bookings: 89,
      salon_categories: "1,3",
      owner_photo: null,
      created_at: "2024-02-20T08:15:00.000000Z",
      updated_at: "2024-11-15T16:45:00.000000Z"
    },
    {
      id: 3,
      owner_name: "د. محمد علي الشريف",
      salon_name: "عيادة الأسنان الذهبية",
      salon_address: "شارع البحر، حي العليا، الدمام 31411",
      salon_phone: "+966 13 456 7890",
      rating: 4.9,
      reviews_avg_rating: 5.0,
      total_completed_bookings: 234,
      salon_categories: "2,4",
      owner_photo: null,
      created_at: "2024-03-10T14:20:00.000000Z",
      updated_at: "2024-12-05T10:30:00.000000Z"
    }
  ];

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="text-center">اختبار DoctorCard في صفحة Book</h2>
          <p className="text-center text-muted">
            هذا اختبار لـ DoctorCard مع البيانات التي تأتي من API في صفحة Book
          </p>
        </div>
      </div>

      <div className="row g-4">
        {testData.map((salon) => (
          <div key={salon.id} className="col-lg-4 col-md-6">
            <div className="mb-3">
              <h6 className="text-center text-primary">
                <small>Salon ID: {salon.id}</small>
              </h6>
            </div>
            <DoctorCard salonData={salon} />
          </div>
        ))}
      </div>

      {/* معلومات التشخيص */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">✅ تم استبدال SearchResultCard بـ DoctorCard</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>التغييرات المطبقة:</h6>
                  <ul className="list-unstyled">
                    <li>✅ استبدال import SearchResultCard بـ DoctorCard</li>
                    <li>✅ تغيير &lt;SearchResultCard result={doctor} /&gt;</li>
                    <li>✅ إلى &lt;DoctorCard salonData={doctor} /&gt;</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>البيانات المعروضة:</h6>
                  <ul className="list-unstyled small">
                    <li>• اسم العيادة (أزرق)</li>
                    <li>• التخصص من API الفئات</li>
                    <li>• اسم الطبيب</li>
                    <li>• التقييم والحجوزات</li>
                    <li>• العنوان والهاتف</li>
                    <li>• زر الحجز الأخضر</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-light rounded">
                <h6>📋 ملاحظات:</h6>
                <p className="mb-0">
                  الآن صفحة Book تستخدم DoctorCard المحسن الذي يعرض جميع البيانات من API 
                  مع التصميم الجديد والتحسينات المطلوبة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTest;
