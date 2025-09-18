import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  // Debug: Log current state
  console.log('Profile component render - userProfileImage:', userProfileImage);

  const PROFILE_URL = 'https://enqlygo.com/api/user/profile';
  const UPDATE_URL = 'https://enqlygo.com/api/user/update';

  // Helper function to build absolute image URL
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('storage/')) return `https://enqlygo.com/${imagePath}`;
    if (imagePath === 'https://enqlygo.com/storage/profile_images') {
      // This is just a directory path, not a specific image
      return null;
    }
    return `https://enqlygo.com/${imagePath.replace(/^\/+/, '')}`;
  };

  // Load profile from localStorage first, then from API
  useEffect(() => {
    const controller = new AbortController();
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First, try to load from localStorage
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
          try {
            const userObj = JSON.parse(storedUserData);
            const localData = {
              name: userObj.name || '',
              email: userObj.email || '',
              phone: userObj.phone || '',
              address: userObj.address || '',
            };
            console.log('Loaded from localStorage:', localData);
            setUserData(localData);
            setFormData(localData);
            
            // Load profile image from localStorage
            if (userObj.profile_image) {
              const imageUrl = buildImageUrl(userObj.profile_image);
              console.log('Found profile image in localStorage:', userObj.profile_image);
              console.log('Built image URL:', imageUrl);
              setUserProfileImage(imageUrl);
              console.log('Set userProfileImage state to:', imageUrl);
            } else {
              console.log('No profile image found in localStorage');
            }
          } catch (e) {
            console.warn('Could not parse localStorage user data:', e);
          }
        }
        
        // Then try to load from API
        const token = localStorage.getItem('token');
        console.log('Profile load token:', token);
        if (!token) {
          throw new Error('Token is missing');
        }
        
        const res = await fetch(PROFILE_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          console.log('Profile load error response:', errorData);
          
          if (errorData.message && errorData.message.includes('سجل الدخول ثم حاول مره اخري')) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        }
        const json = await res.json();
        console.log('Profile API response:', json);
        
        // Normalize API response into our fields
        const p = json?.data || json;
        const normalized = {
          name: p?.fullname || '',
          email: p?.email || '',
          phone: p?.phone_number || '',
          address: p?.address || '',
        };
        
        console.log('Normalized profile data:', normalized);
        
        // Merge with localStorage data to preserve address
        const storedUserData2 = localStorage.getItem('user');
        if (storedUserData2) {
          try {
            const userObj = JSON.parse(storedUserData2);
            if (userObj.address && !normalized.address) {
              normalized.address = userObj.address;
              console.log('Preserved address from localStorage:', userObj.address);
            }
          } catch (e) {
            console.warn('Could not merge localStorage data:', e);
          }
        }
        
        setUserData(normalized);
        setFormData(normalized);
        
        // Set profile image from API or localStorage
        if (p?.profile_image) {
          const imageUrl = buildImageUrl(p.profile_image);
          console.log('API returned profile image:', p.profile_image);
          console.log('Built image URL from API:', imageUrl);
          if (imageUrl) {
            setUserProfileImage(imageUrl);
          } else {
            console.log('Profile image path is invalid or directory only');
            setUserProfileImage(null);
          }
        }
        
        // Save to localStorage for persistence
        const storedUserData5 = localStorage.getItem('user');
        if (storedUserData5) {
          try {
            const userObj = JSON.parse(storedUserData5);
            const updatedUser = { ...userObj, ...normalized };
            
            // Preserve profile image from localStorage if API doesn't have it
            if (userObj.profile_image && !p?.profile_image) {
              setUserProfileImage(userObj.profile_image);
              updatedUser.profile_image = userObj.profile_image;
              console.log('Loaded profile image from localStorage:', userObj.profile_image);
            }
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (e) {
            console.warn('Could not update localStorage user data:', e);
          }
        }
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
        return () => controller.abort();
      }, []);


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
  
    try {
      setIsLoading(true);
      setError(null);
  
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');
  
      const addressData = {
        name: formData.name || 'المستخدم',
        mobile: formData.phone || '',
        address: newAddress.trim(),
        city: 'القاهرة'
      };
  
      const res = await fetch('https://enqlygo.com/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization':` Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Add address error:', errorData);
        throw new Error(errorData.message || 'فشل إضافة العنوان');
      }
  
      const responseData = await res.json();
      console.log('Address added successfully:', responseData);
  
      // تحديث العنوان في الفورم بشكل مؤقت
      setFormData({
        ...formData,
        address: newAddress.trim()
      });
  
      setNewAddress('');
      setShowAddAddress(false);
  
    } catch (e) {
      console.error('Error adding address:', e);
      setError(e.message || 'حدث خطأ أثناء إضافة العنوان');
    } finally {
      setIsLoading(false);
    }
  };








  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate phone number format
      if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
        setError('رقم الهاتف غير صحيح');
        return;
      }
      
      const token = localStorage.getItem('token');
      console.log('Save profile token:', token);
      if (!token) throw new Error('Token is missing');
      
      let res;
      
      // Update user profile data - always send name and phone
      const changedFields = {};
      
      // Try different field names for name
      changedFields.fullname = formData.name;
      changedFields.name = formData.name;
      changedFields.user_name = formData.name;
      changedFields.first_name = formData.name;
      changedFields.display_name = formData.name;
      changedFields.phone_number = formData.phone;
      changedFields.address = formData.address;
      
      console.log('Sending fields to API:', changedFields);
      
      // If there's a profile image or changed fields, send update
      if (profileImage || Object.keys(changedFields).length > 0) {
        if (profileImage) {
          const formDataToSend = new FormData();
          
          // Try different field names for name
          formDataToSend.append('fullname', changedFields.fullname);
          formDataToSend.append('name', changedFields.name);
          formDataToSend.append('user_name', changedFields.user_name);
          formDataToSend.append('first_name', changedFields.first_name);
          formDataToSend.append('display_name', changedFields.display_name);
          formDataToSend.append('phone_number', changedFields.phone_number);
          formDataToSend.append('address', changedFields.address);
          
          // Try different field names for profile image
          formDataToSend.append('profile_image', profileImage);
          formDataToSend.append('image', profileImage);
          formDataToSend.append('avatar', profileImage);
          formDataToSend.append('photo', profileImage);
          formDataToSend.append('user_image', profileImage);
          
          console.log('FormData contents:', {
            fullname: changedFields.fullname,
            name: changedFields.name,
            user_name: changedFields.user_name,
            phone_number: changedFields.phone_number,
            address: changedFields.address,
            profile_image: 'File object',
            image: 'File object',
            avatar: 'File object',
            photo: 'File object',
            user_image: 'File object',
            hasImage: true
          });
          
          console.log('Sending FormData with:', {
            ...changedFields,
            hasImage: true
          });
          
          console.log('Sending POST request to:', UPDATE_URL);
          console.log('Request method: POST');
          console.log('Request headers:', {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          });
          console.log('FormData entries:');
          for (let [key, value] of formDataToSend.entries()) {
            if (value instanceof File) {
              console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
            } else {
              console.log(`  ${key}:`, value);
            }
          }
          
          res = await fetch(UPDATE_URL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: formDataToSend,
          });
        } else {
          // If no image, use JSON
          console.log('Sending JSON with:', changedFields);
          console.log('Sending POST request to:', UPDATE_URL);
          console.log('Request method: POST');
          console.log('Request headers:', {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          });
          console.log('Request body (JSON):', JSON.stringify(changedFields));
          
          res = await fetch(UPDATE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(changedFields),
          });
        }
      } else {
        // No changes, skip API call
        console.log('No changes detected, skipping update');
        res = { ok: true, json: () => Promise.resolve({}) };
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        console.log('Update error response:', errorData);
        
        // Handle specific error messages
        if (errorData.message && errorData.message.includes('رقم الهاتف مسجل بالفعل')) {
          throw new Error('رقم الهاتف مسجل بالفعل، يرجى استخدام رقم هاتف آخر');
        } else if (errorData.message && errorData.message.includes('سجل الدخول ثم حاول مره اخري')) {
          // Token expired or invalid - redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      }
      
      // Get response data
      const responseData = await res.json();
      console.log('Update response:', responseData);
      console.log('Update response status:', res.status);
      console.log('Update response headers:', res.headers);
      
      // Update profile image if returned from API
      if (responseData?.data?.profile_image) {
        setUserProfileImage(responseData.data.profile_image);
        console.log('API returned updated profile image:', responseData.data.profile_image);
      } else {
        console.log('API did not return profile image, keeping current one');
      }
      
      // Update state immediately with form data
      setUserData(formData);
      setFormData(formData);
      
      // Save updated data to localStorage
      const storedUserData3 = localStorage.getItem('user');
      if (storedUserData3) {
        try {
          const userObj = JSON.parse(storedUserData3);
          userObj.name = formData.name;
          userObj.phone = formData.phone;
          userObj.address = formData.address;
          
          // Save profile image if available
          if (responseData?.data?.profile_image) {
            userObj.profile_image = responseData.data.profile_image;
            console.log('API returned profile image:', responseData.data.profile_image);
            console.log('Saving profile image to localStorage:', responseData.data.profile_image);
          } else {
            console.log('No profile image in API response');
          }
          
          localStorage.setItem('user', JSON.stringify(userObj));
          console.log('Updated user data in localStorage:', userObj);
        } catch (e) {
          console.warn('Could not update localStorage:', e);
        }
      }
      
      // Reset image states after successful save
      setProfileImage(null);
      setImagePreview(null);
      
      // Reload profile data from API to ensure database is updated
      console.log('Reloading profile data from API...');
      try {
        const reloadRes = await fetch(PROFILE_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (reloadRes.ok) {
          const reloadData = await reloadRes.json();
          console.log('=== DATABASE DATA AFTER UPDATE ===');
          console.log('Full reload response:', reloadData);
          
          const p = reloadData?.data || reloadData;
          console.log('User data from database:', p);
          console.log('Database fields:');
          console.log('  - fullname:', p?.fullname);
          console.log('  - email:', p?.email);
          console.log('  - phone_number:', p?.phone_number);
          console.log('  - profile_image:', p?.profile_image);
          console.log('  - address:', p?.address);
          console.log('================================');
          
          if (p?.fullname) {
            setUserData(prev => ({ ...prev, name: p.fullname }));
            setFormData(prev => ({ ...prev, name: p.fullname }));
            console.log('Updated name in UI:', p.fullname);
          }
          if (p?.profile_image) {
            const imageUrl = buildImageUrl(p.profile_image);
            console.log('Reloaded profile image from database:', p.profile_image);
            console.log('Built reloaded image URL:', imageUrl);
            if (imageUrl) {
              setUserProfileImage(imageUrl);
            } else {
              console.log('Reloaded profile image path is invalid or directory only');
              setUserProfileImage(null);
            }
          }
        }
      } catch (reloadError) {
        console.warn('Failed to reload profile data:', reloadError);
      }
      
    setIsEditing(false);
    } catch (e) {
      setError(e.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملف صورة صالح');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div className="profile-section">
      {/* Header */}
      <div className="section-header mb-4">
        <h3 className="section-title mb-0">
          <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
          البروفايل الشخصي
        </h3>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <p className="text-muted">جاري التحميل...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Profile Content */}
      {!isLoading && (
      <div className="profile-content">
        <div className="row">
            {/* Profile Image Section */}
            <div className="col-lg-4 col-md-5 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="profile-image-container mb-4">
                    <div 
                      className="profile-image mx-auto position-relative" 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        borderRadius: '50%', 
                        overflow: 'hidden'
                      }}
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="صورة البروفايل" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : userProfileImage ? (
                        <img 
                          src={userProfileImage} 
                          alt="صورة البروفايل" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onLoad={() => console.log('Profile image loaded successfully:', userProfileImage)}
                          onError={(e) => {
                            console.log('Profile image failed to load:', userProfileImage);
                            // إذا فشل تحميل صورة المستخدم، استخدم الصورة الافتراضية
                            e.target.src = "https://www.w3schools.com/howto/img_avatar.png";
                          }}
                        />
                      ) : (
                        <img
                          src="https://www.w3schools.com/howto/img_avatar.png"
                          alt="صورة البروفايل الافتراضية"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            // إذا فشل تحميل الصورة، استخدم أيقونة FontAwesome
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const icon = document.createElement('div');
                              icon.className = 'fallback-icon d-flex align-items-center justify-content-center h-100';
                              icon.style.color = '#6c757d';
                              icon.innerHTML = '<i class="fas fa-user" style="font-size: 4rem;"></i>';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <input 
                      type="file" 
                      id="profile-image-input" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      style={{ display: 'none' }} 
                    />
                    <label 
                      htmlFor="profile-image-input" 
                      className="btn btn-outline-primary btn-sm px-3"
                      style={{ borderRadius: '20px' }}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      تغيير الصورة
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="col-lg-8 col-md-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="card-title mb-4 text-primary">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    المعلومات الشخصية
                  </h5>
                  
              <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                        الاسم الكامل
                      </label>
                  {isEditing ? (
                    <input
                      type="text"
                          className="form-control form-control-lg" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          style={{ borderRadius: '10px' }}
                    />
                  ) : (
                        <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px' }}>
                          {userData.name || 'غير محدد'}
                        </div>
                  )}
                </div>
                
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                        البريد الإلكتروني
                      </label>
                      <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px' }}>
                        {userData.email || 'غير محدد'}
                      </div>
                </div>
                
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
                        رقم الهاتف
                      </label>
                  {isEditing ? (
                    <input
                      type="tel"
                          className="form-control form-control-lg" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                          placeholder="أدخل رقم هاتفك"
                          style={{ borderRadius: '10px' }}
                    />
                  ) : (
                        <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px' }}>
                          {userData.phone || 'غير محدد'}
                </div>
                  )}
                </div>
                
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold text-dark">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                        العنوان
                      </label>
                  {isEditing ? (
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-lg" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="أدخل عنوانك"
                        style={{ borderRadius: '10px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        style={{ borderRadius: '10px', minWidth: '40px' }}
                        title="إضافة عنوان سريع"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </div>
                  ) : (
                        <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px' }}>
                          {userData.address || 'غير محدد'}
                        </div>
                  )}
                  
                  {/* Quick Add Address */}
                  {showAddAddress && (
                    <div className="mt-2 p-3 bg-light rounded">
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder="اكتب العنوان هنا..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                        />
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={handleAddAddress}
                          disabled={!newAddress.trim()}
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setShowAddAddress(false);
                            setNewAddress('');
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
                  {/* Action Buttons */}
                  {isEditing ? (
                    <div className="form-actions mt-4 pt-4 border-top">
                      <div className="d-flex gap-3 justify-content-end">
                        <button 
                          className="btn btn-success btn-lg px-4" 
                          onClick={handleSave}
                          style={{ borderRadius: '25px' }}
                        >
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    حفظ التغييرات
                  </button>
                        <button 
                          className="btn btn-outline-secondary btn-lg px-4" 
                          onClick={handleCancel}
                          style={{ borderRadius: '25px' }}
                        >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    إلغاء
                  </button>
                      </div>
                    </div>
                  ) : (
                    <div className="form-actions mt-4 pt-4 border-top">
                      <div className="d-flex justify-content-center">
                        <button 
                          className="btn btn-primary btn-lg px-5" 
                          onClick={() => setIsEditing(true)}
                          style={{ borderRadius: '25px' }}
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-2" />
                          تعديل البروفايل
                        </button>
                      </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Profile;