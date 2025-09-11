import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    birthDate: '1990-05-15',
    gender: 'ذكر'
  });

  const [formData, setFormData] = useState(userData);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          البروفايل الشخصي
        </h3>
        {!isEditing && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            تعديل البيانات
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="row">
          <div className="col-md-4">
            <div className="profile-image-section text-center">
              <div className="profile-image">
                <FontAwesomeIcon icon={faUser} size="4x" />
              </div>
              <button className="btn btn-outline-primary mt-3">
                تغيير الصورة
              </button>
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="profile-info">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">الاسم الكامل</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="form-control-plaintext">{userData.name}</p>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">البريد الإلكتروني</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="form-control-plaintext">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                      {userData.email}
                    </p>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">رقم الهاتف</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="form-control-plaintext">
                      <FontAwesomeIcon icon={faPhone} className="me-2" />
                      {userData.phone}
                    </p>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">تاريخ الميلاد</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="form-control"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="form-control-plaintext">{userData.birthDate}</p>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">الجنس</label>
                  {isEditing ? (
                    <select
                      className="form-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  ) : (
                    <p className="form-control-plaintext">{userData.gender}</p>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">العنوان</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="form-control-plaintext">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      {userData.address}
                    </p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="form-actions mt-4">
                  <button className="btn btn-success me-2" onClick={handleSave}>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    حفظ التغييرات
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
