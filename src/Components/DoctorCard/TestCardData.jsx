import React from 'react';
import DoctorCard from './DoctorCard';

/**
 * مكون اختبار لعرض الكارد مع بيانات مختلفة
 */
const TestCardData = () => {
  // بيانات تجريبية لاختبار الكارد
  const testSalonData = {
    id: 999,
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
  };

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="text-center">اختبار كارد العيادات</h2>
          <p className="text-center text-muted">
            هذا مكون اختبار لعرض الكارد مع بيانات مختلفة
          </p>
        </div>
      </div>

      <div className="row">
        {/* كارد مع salonId */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="text-center mb-3">
            <h5>كارد مع Salon ID</h5>
            <small className="text-muted">سيجلب البيانات من API</small>
          </div>
          <DoctorCard salonId={2} />
        </div>

        {/* كارد مع salonData مباشرة */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="text-center mb-3">
            <h5>كارد مع بيانات مباشرة</h5>
            <small className="text-muted">بيانات تجريبية</small>
          </div>
          <DoctorCard salonData={testSalonData} />
        </div>

        {/* كارد مع salonId مختلف */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="text-center mb-3">
            <h5>كارد مع Salon ID مختلف</h5>
            <small className="text-muted">salonId = 3</small>
          </div>
          <DoctorCard salonId={3} />
        </div>
      </div>

      {/* معلومات التشخيص */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">🔍 معلومات التشخيص</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>البيانات التجريبية:</h6>
                  <pre style={{ fontSize: '12px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                    {JSON.stringify(testSalonData, null, 2)}
                  </pre>
                </div>
                <div className="col-md-6">
                  <h6>تعليمات التشخيص:</h6>
                  <ul className="list-unstyled">
                    <li>✅ افتح Developer Tools (F12)</li>
                    <li>✅ انتقل إلى Console</li>
                    <li>✅ راقب رسائل API</li>
                    <li>✅ تحقق من قسم "معلومات التشخيص" في الكارد</li>
                  </ul>
                  
                  <h6 className="mt-3">Endpoints المستخدمة:</h6>
                  <ul className="list-unstyled small">
                    <li>• <code>https://enqlygo.com/api/salons/2</code></li>
                    <li>• <code>https://enqlygo.com/api/salons/2/staff</code></li>
                    <li>• <code>https://enqlygo.com/api/salons/categories</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCardData;
