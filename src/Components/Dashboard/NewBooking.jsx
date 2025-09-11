import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faStethoscope, 
  faUserMd, 
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const NewBooking = () => {
  const [formData, setFormData] = useState({
    service: '',
    doctor: '',
    date: '',
    time: '',
    location: '',
    notes: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: 1, name: 'استشارة طبية عامة', price: '150 ريال', duration: '30 دقيقة' },
    { id: 2, name: 'فحص القلب', price: '300 ريال', duration: '45 دقيقة' },
    { id: 3, name: 'علاج الأسنان', price: '200 ريال', duration: '60 دقيقة' },
    { id: 4, name: 'فحص العيون', price: '250 ريال', duration: '40 دقيقة' },
    { id: 5, name: 'استشارة نفسية', price: '400 ريال', duration: '50 دقيقة' }
  ];

  const doctors = [
    { id: 1, name: 'د. أحمد محمد', specialty: 'الطب العام', available: true },
    { id: 2, name: 'د. فاطمة علي', specialty: 'أمراض القلب', available: true },
    { id: 3, name: 'د. خالد السعد', specialty: 'طب الأسنان', available: false },
    { id: 4, name: 'د. نورا أحمد', specialty: 'طب العيون', available: true },
    { id: 5, name: 'د. محمد حسن', specialty: 'الصحة النفسية', available: true }
  ];

  const timeSlots = [
    '9:00 ص', '9:30 ص', '10:00 ص', '10:30 ص', '11:00 ص', '11:30 ص',
    '12:00 م', '12:30 م', '1:00 م', '1:30 م', '2:00 م', '2:30 م',
    '3:00 م', '3:30 م', '4:00 م', '4:30 م', '5:00 م', '5:30 م'
  ];

  const locations = [
    'مستشفى بلسمي - الرياض',
    'عيادة القلب - جدة',
    'عيادة الأسنان - الدمام',
    'عيادة العيون - الرياض',
    'عيادة الصحة النفسية - جدة'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setStep(4); // صفحة التأكيد
  };

  const selectedService = services.find(s => s.id === parseInt(formData.service));
  const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctor));

  return (
    <div className="new-booking-section">
      <div className="section-header">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
          حجز موعد جديد
        </h3>
      </div>

      <div className="booking-form-container">
        {/* Progress Steps */}
        <div className="progress-steps mb-4">
          <div className="row">
            <div className={`col-3 step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-title">اختيار الخدمة</div>
            </div>
            <div className={`col-3 step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-title">اختيار الطبيب</div>
            </div>
            <div className={`col-3 step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-title">التوقيت والملاحظات</div>
            </div>
            <div className={`col-3 step ${step >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-title">التأكيد</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="step-content">
              <h5 className="step-title">اختر الخدمة المطلوبة</h5>
              <div className="row">
                {services.map((service) => (
                  <div key={service.id} className="col-md-6 mb-3">
                    <div className="service-option">
                      <input
                        type="radio"
                        id={`service-${service.id}`}
                        name="service"
                        value={service.id}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label htmlFor={`service-${service.id}`} className="form-check-label">
                        <div className="service-option-content">
                          <FontAwesomeIcon icon={faStethoscope} className="service-icon" />
                          <div className="service-details">
                            <h6>{service.name}</h6>
                            <p className="text-muted">{service.price} - {service.duration}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Doctor Selection */}
          {step === 2 && (
            <div className="step-content">
              <h5 className="step-title">اختر الطبيب</h5>
              <div className="row">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="col-md-6 mb-3">
                    <div className={`doctor-option ${!doctor.available ? 'unavailable' : ''}`}>
                      <input
                        type="radio"
                        id={`doctor-${doctor.id}`}
                        name="doctor"
                        value={doctor.id}
                        onChange={handleInputChange}
                        className="form-check-input"
                        disabled={!doctor.available}
                      />
                      <label htmlFor={`doctor-${doctor.id}`} className="form-check-label">
                        <div className="doctor-option-content">
                          <FontAwesomeIcon icon={faUserMd} className="doctor-icon" />
                          <div className="doctor-details">
                            <h6>{doctor.name}</h6>
                            <p className="text-muted">{doctor.specialty}</p>
                            {!doctor.available && (
                              <span className="unavailable-text">غير متاح حالياً</span>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time and Notes */}
          {step === 3 && (
            <div className="step-content">
              <h5 className="step-title">اختر التوقيت وأضف ملاحظات</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">التاريخ</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">الوقت</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">اختر الوقت</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">الموقع</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">اختر الموقع</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">ملاحظات إضافية</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    placeholder="أي ملاحظات أو معلومات إضافية..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="step-content text-center">
              <FontAwesomeIcon icon={faCheckCircle} size="4x" className="text-success mb-3" />
              <h4 className="text-success">تم تأكيد الحجز بنجاح!</h4>
              <div className="booking-summary mt-4">
                <h5>ملخص الحجز</h5>
                <div className="summary-details">
                  <p><strong>الخدمة:</strong> {selectedService?.name}</p>
                  <p><strong>الطبيب:</strong> {selectedDoctor?.name}</p>
                  <p><strong>التاريخ:</strong> {formData.date}</p>
                  <p><strong>الوقت:</strong> {formData.time}</p>
                  <p><strong>الموقع:</strong> {formData.location}</p>
                  {formData.notes && <p><strong>ملاحظات:</strong> {formData.notes}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="form-navigation mt-4">
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrevious}
                  disabled={step === 1}
                >
                  السابق
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!formData.service || (step === 2 && !formData.doctor)}
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري الحجز...' : 'تأكيد الحجز'}
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewBooking;
