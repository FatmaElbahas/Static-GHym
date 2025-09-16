import React, { useState } from 'react';

/**
 * مكون تشخيص لفحص DoctorCard
 */
const DebugTest = () => {
  const [showCard, setShowCard] = useState(false);
  const [testMode, setTestMode] = useState('salonId');

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">تشخيص DoctorCard</h1>
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>اختبارات التشخيص</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="testMode"
                      id="salonIdMode"
                      value="salonId"
                      checked={testMode === 'salonId'}
                      onChange={(e) => setTestMode(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="salonIdMode">
                      اختبار مع salonId
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="testMode"
                      id="salonDataMode"
                      value="salonData"
                      checked={testMode === 'salonData'}
                      onChange={(e) => setTestMode(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="salonDataMode">
                      اختبار مع salonData
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCard(!showCard)}
                  >
                    {showCard ? 'إخفاء الكارد' : 'إظهار الكارد'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCard && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>نتيجة الاختبار</h5>
              </div>
              <div className="card-body">
                {testMode === 'salonId' ? (
                  <div>
                    <h6>اختبار مع salonId={2}</h6>
                    <div className="border p-3" style={{ minHeight: '200px' }}>
                      {(() => {
                        try {
                          const DoctorCard = require('./DoctorCard').default;
                          return <DoctorCard salonId={2} />;
                        } catch (error) {
                          return (
                            <div className="alert alert-danger">
                              <h6>خطأ في تحميل DoctorCard:</h6>
                              <p>{error.message}</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h6>اختبار مع salonData</h6>
                    <div className="border p-3" style={{ minHeight: '200px' }}>
                      {(() => {
                        try {
                          const DoctorCard = require('./DoctorCard').default;
                          return <DoctorCard salonData={{
                            id: 1,
                            owner_name: "د. أحمد محمد",
                            salon_name: "عيادة الأسنان الذهبية",
                            salon_address: "شارع الملك فهد - الرياض",
                            salon_phone: "+966 112345678",
                            rating: 4.5,
                            reviews_avg_rating: 4.8,
                            total_completed_bookings: 150,
                            salon_categories: "1,2",
                            created_at: "2025-01-01T00:00:00.000000Z",
                            updated_at: "2025-01-01T00:00:00.000000Z"
                          }} />;
                        } catch (error) {
                          return (
                            <div className="alert alert-danger">
                              <h6>خطأ في تحميل DoctorCard:</h6>
                              <p>{error.message}</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>خطوات التشخيص</h5>
            </div>
            <div className="card-body">
              <ol>
                <li>تأكد من استيراد DoctorCard بشكل صحيح</li>
                <li>تحقق من وجود جميع المتطلبات (FontAwesome, Bootstrap)</li>
                <li>افتح Developer Console للبحث عن أخطاء</li>
                <li>تأكد من وجود CSS للكارد</li>
                <li>تحقق من البيانات الممررة للكارد</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugTest;
