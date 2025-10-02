import React from 'react';
import DoctorCard from './DoctorCard';

/**
 * صفحة اختبار بسيطة لـ DoctorCard
 */
const TestPage = () => {
  // بيانات تجريبية
  const testSalonData = {
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
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#333',
          fontSize: '2.5rem'
        }}>
          اختبار DoctorCard
        </h1>
        
        <div className="row">
          <div className="col-md-6 mb-4">
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3>اختبار مع salonData</h3>
              <DoctorCard salonData={testSalonData} />
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3>اختبار مع salonId</h3>
              <DoctorCard salonId={2} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3>البيانات المستخدمة:</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px',
            maxHeight: '300px'
          }}>
            {JSON.stringify(testSalonData, null, 2)}
          </pre>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '20px'
        }}>
          <h3>كيفية الاستخدام:</h3>
          <div className="row">
            <div className="col-md-6">
              <h5>مع salonData:</h5>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '12px'
              }}>
{`<DoctorCard 
  salonData={salonData} 
/>`}
              </pre>
            </div>
            <div className="col-md-6">
              <h5>مع salonId:</h5>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '12px'
              }}>
{`<DoctorCard 
  salonId={2} 
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
