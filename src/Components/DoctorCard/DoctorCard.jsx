import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faStar, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function DoctorCard({ salonData }) {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const navigate = useNavigate();

  // دالة للتعامل مع النقر على زر الحجز
  const handleBookingClick = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // المستخدم مسجل دخول - اذهب للداشبورد
      navigate('/dashboard');
    } else {
      // المستخدم غير مسجل دخول - اذهب لصفحة تسجيل الدخول
      navigate('/login');
    }
  };

  // جلب التصنيفات من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching categories from API...');
        
        const response = await fetch('https://enqlygo.com/api/salons/categories');
        console.log('📊 Categories API Response Status:', response.status);
        
        const data = await response.json();
        console.log('📊 Categories API Response Data:', data);
        
        if (data.status === 'success' && data.data) {
          console.log('✅ Categories loaded successfully:', data.data);
          setCategories(data.data);
        } else {
          console.error('❌ Invalid categories response format:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // جلب الخدمات والسعر من API
  useEffect(() => {
    const fetchServices = async () => {
      if (!salonData?.id) {
        console.log('⚠️ No salon ID provided for services');
        return;
      }

      try {
        setServicesLoading(true);
        console.log(`🔄 Fetching services for salon ID: ${salonData.id}`);
        
        const response = await fetch(`https://enqlygo.com/api/salons/${salonData.id}/services`);
        console.log(`📊 Services API Response Status:`, response.status);
        
        const data = await response.json();
        console.log(`📊 Services API Response Data:`, data);
        
        if (data.status === 'success' && data.data) {
          console.log(`✅ Services loaded successfully:`, data.data);
          // البيانات تأتي في data.data.services
          const servicesData = data.data.services || data.data;
          console.log(`📋 Services array:`, servicesData);
          setServices(servicesData);
        } else {
          console.error(`❌ Invalid services response format:`, data);
        }
      } catch (error) {
        console.error(`❌ Error fetching services:`, error);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [salonData?.id]);

  if (!salonData) {
    return (
      <div className="card bg-white shadow-lg rounded mb-4">
        <div className="card-body text-center">
          <p className="text-muted">لا توجد بيانات للعرض</p>
        </div>
      </div>
    );
  }

  // استخراج المدينة من العنوان
  const getCityFromAddress = (address) => {
    if (!address) return "غير محدد";
    
    // قائمة المدن بالعربية والإنجليزية
    const cityMappings = {
      // السعودية
      "الرياض": "الرياض",
      "Riyadh": "الرياض",
      "جدة": "جدة", 
      "Jeddah": "جدة",
      "الدمام": "الدمام",
      "Dammam": "الدمام",
      "المدينة المنورة": "المدينة المنورة",
      "Medina": "المدينة المنورة",
      "Medina Al Munawwarah": "المدينة المنورة",
      "الطائف": "الطائف",
      "Taif": "الطائف",
      "الخبر": "الخبر",
      "Khobar": "الخبر",
      "الظهران": "الظهران",
      "Dhahran": "الظهران",
      
      // مصر
      "القاهرة": "القاهرة",
      "Cairo": "القاهرة",
      "الفيوم": "الفيوم",
      "Fayoum": "الفيوم",
      "مصر الجديدة": "مصر الجديدة",
      "New Cairo": "مصر الجديدة",
      "Heliopolis": "مصر الجديدة",
      
      // مدن أخرى
      "الإسكندرية": "الإسكندرية",
      "Alexandria": "الإسكندرية",
      "شرم الشيخ": "شرم الشيخ",
      "Sharm El Sheikh": "شرم الشيخ"
    };
    
    // البحث في العنوان (case insensitive)
    const addressLower = address.toLowerCase();
    
    for (const [cityKey, cityValue] of Object.entries(cityMappings)) {
      if (addressLower.includes(cityKey.toLowerCase())) {
        return cityValue;
      }
    }
    
    // إذا لم توجد مدينة معروفة، نحاول استخراج من نهاية العنوان أو الوسط
    const addressParts = address.split(/[-,\s]+/);
    
    // محاولة استخراج من نهاية العنوان
    if (addressParts.length > 1) {
      const lastPart = addressParts[addressParts.length - 1].trim();
      if (lastPart && lastPart.length > 2 && !/\d/.test(lastPart)) {
        return lastPart;
      }
    }
    
    // محاولة استخراج من وسط العنوان
    if (addressParts.length > 2) {
      const middlePart = addressParts[Math.floor(addressParts.length / 2)].trim();
      if (middlePart && middlePart.length > 2 && !/\d/.test(middlePart)) {
        return middlePart;
      }
    }
    
    // كحل أخير، نأخذ أول جزء بدون أرقام
    for (const part of addressParts) {
      const cleanPart = part.trim();
      if (cleanPart && cleanPart.length > 2 && !/\d/.test(cleanPart)) {
        return cleanPart;
      }
    }
    
    return "غير محدد";
  };

  // الحصول على التخصص الحقيقي من التصنيفات
  const getSpecialization = () => {
    // Debug: طباعة شكل البيانات
    console.log('🔍 DoctorCard Debug:', {
      salonData: salonData,
      salon_categories: salonData.salon_categories,
      isArray: Array.isArray(salonData.salon_categories),
      categories: categories,
      categoriesLength: categories.length
    });

    // التحقق من وجود salon_categories
    if (!salonData.salon_categories) {
      console.log('⚠️ No salon_categories found, returning first available category');
      // إذا لم توجد تصنيفات للعيادة، نعرض أول تصنيف متاح من API
      if (categories.length > 0) {
        return categories[0].title_ar || categories[0].title || "تخصص طبي";
      }
      return "تخصص طبي";
    }

    // التحقق من وجود categories
    if (categories.length === 0) {
      console.log('⚠️ Categories not loaded yet, returning default');
      return "تخصص طبي";
    }

    // معالجة salon_categories - قد يكون string أو array
    let categoryIds = salonData.salon_categories;
    
    // إذا كان string، نحوله إلى array
    if (typeof categoryIds === 'string') {
      try {
        categoryIds = JSON.parse(categoryIds);
      } catch (e) {
        // إذا فشل التحويل، نحاول تقسيمه بفواصل
        categoryIds = categoryIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
    }
    
    // التأكد من أنه array
    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds].filter(id => id != null);
    }
    
    console.log(`🔍 Processed category IDs:`, categoryIds);

    // البحث عن التصنيفات المطابقة باستخدام ID
    const matchingCategories = categoryIds
      .map(categoryId => {
        // تحويل إلى رقم للتأكد من المطابقة
        const numericId = parseInt(categoryId);
        console.log(`🔍 Looking for category ID: ${numericId}`);
        const category = categories.find(cat => cat.id === numericId);
        console.log(`📋 Found category:`, category);
        
        if (category) {
          // استخدام title_ar أولاً، ثم title كبديل
          const categoryName = category.title_ar || category.title || `تخصص ${numericId}`;
          console.log(`✅ Category name: ${categoryName}`);
          return categoryName;
        }
        
        console.log(`❌ No category found for ID: ${numericId}`);
        return null;
      })
      .filter(Boolean);

    console.log(`🎯 Final matching categories:`, matchingCategories);

    if (matchingCategories.length > 0) {
      const result = matchingCategories.join(", ");
      console.log(`✅ Final specialization: ${result}`);
      return result;
    }

    console.log('⚠️ No matching categories found, returning first available category');
    // إذا لم يجد مطابقة، نعرض أول تصنيف متاح من API
    if (categories.length > 0) {
      return categories[0].title_ar || categories[0].title || "تخصص طبي";
    }
    return "تخصص طبي";
  };

  // الحصول على السعر الحقيقي من API الخدمات
  const getRealPrice = () => {
    console.log('💰 Getting price from API services:', {
      servicesLoading: servicesLoading,
      services: services,
      servicesType: typeof services,
      isArray: Array.isArray(services),
      salonId: salonData?.id
    });
    
    if (servicesLoading) {
      console.log('⏳ Services still loading...');
      return "جاري التحميل...";
    }

    if (!services) {
      console.log('⚠️ Services is null/undefined');
      return "غير متوفر";
    }

    // التأكد من أن services هو array
    if (!Array.isArray(services)) {
      console.log('⚠️ Services is not an array:', typeof services, services);
      return "غير متوفر";
    }

    if (services.length === 0) {
      console.log('⚠️ No services found in API response');
      return "غير متوفر";
    }

    // طباعة تفاصيل كل خدمة
    console.log('📋 All services details:');
    services.forEach((service, index) => {
      console.log(`Service ${index + 1}:`, {
        id: service.id,
        name: service.name || service.title,
        price: service.price,
        service_price: service.service_price,
        cost: service.cost,
        amount: service.amount,
        currency: service.currency,
        allFields: Object.keys(service)
      });
    });

    // استخراج الأسعار من الخدمات - بناءً على API الحقيقي
    const prices = services
      .map(service => {
        // بناءً على API، السعر في حقل "price"
        const price = service.price;
        
        if (price && price !== null) {
          const numericPrice = parseFloat(price);
          console.log(`💰 Service "${service.title_ar || service.title}" price: ${price} -> ${numericPrice}`);
          return numericPrice;
        }
        
        console.log(`⚠️ No price found for service:`, service.title_ar || service.title);
        return null;
      })
      .filter(price => price && !isNaN(price));

    console.log('💰 All extracted prices:', prices);

    if (prices.length === 0) {
      console.log('❌ No valid prices found in any service');
      return "غير متوفر";
    }

    // حساب السعر الأدنى والأعلى
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      console.log(`✅ Single price from API: ${minPrice}`);
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{minPrice}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1124.14 1256.39"
            width="12"
            height="13"
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
            aria-label="Saudi Riyal"
            title="Saudi Riyal"
          >
            <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
            <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
          </svg>
        </span>
      );
    } else {
      console.log(`✅ Price range from API: ${minPrice} - ${maxPrice}`);
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{minPrice} - {maxPrice}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1124.14 1256.39"
            width="12"
            height="13"
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
            aria-label="Saudi Riyal"
            title="Saudi Riyal"
          >
            <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
            <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
          </svg>
        </span>
      );
    }
  };

  return (
    <>
      <style jsx>{`
        .doctor-card-hover:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
      <div className="card bg-white shadow-lg rounded-4 h-100 doctor-card-hover" style={{
      border: 'none',
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      maxWidth: '100%',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      cursor: 'pointer'
    }}>
      
      {/* Doctor Image - في الأعلى */}
      <div className="text-center pt-4 pb-2" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="doctor-image-wrapper d-inline-block">
          <img
            src={salonData.owner_photo ? 
              (salonData.owner_photo.startsWith('http') ? 
                salonData.owner_photo : 
                `https://enqlygo.com/${salonData.owner_photo}`) : 
              "https://www.w3schools.com/howto/img_avatar.png"}
            alt={salonData.owner_name}
            className="rounded-circle"
            style={{ 
              width: "90px", 
              height: "90px", 
              objectFit: "cover",
              border: "4px solid #ffffff",
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onError={(e) => {
              e.target.src = "https://www.w3schools.com/howto/img_avatar.png";
            }}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '15px',
        minHeight: '200px'
      }}>
        
        {/* Doctor Name */}
        <div className="text-center">
          <h5 className="mb-1" style={{ 
            color: "var(--color-main)", 
            fontWeight: "bold",
            fontSize: "1.3rem",
            margin: 0
          }}>
            {salonData.owner_name || "غير معروف"}
          </h5>

          {/* Specialization */}
          <p className="mb-2" style={{ 
            color: "#6c757d", 
            fontSize: "14px",
            fontWeight: "500",
            margin: 0
          }}>
            {loading ? (
              <span className="text-muted">جاري التحميل...</span>
            ) : (
              getSpecialization()
            )}
          </p>
        </div>

        {/* Location */}
        <div className="text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <FontAwesomeIcon 
            icon={faMapMarkerAlt} 
            style={{ 
              color: "#6c757d", 
              fontSize: "14px"
            }} 
          />
          <span style={{ 
            color: "#6c757d", 
            fontSize: "14px"
          }}>
            {getCityFromAddress(salonData.salon_address)}
          </span>
        </div>

        {/* Rating and Price Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '10px 15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          margin: '10px 0'
        }}>
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '1px' }}>
              {[1,2,3,4,5].map((star) => (
                <FontAwesomeIcon 
                  key={star}
                  icon={faStar} 
                  style={{ 
                    color: "#ffc107", 
                    fontSize: "14px"
                  }} 
                />
              ))}
            </div>
            <div style={{ 
              color: "#495057", 
              fontSize: "14px", 
              fontWeight: "600"
            }}>
              {salonData.top_rated === 1 ? '4.9' : 
               (salonData.rating || salonData.reviews_avg_rating || '4.0')}
            </div>
          </div>

          {/* Price */}
          <div style={{ 
            color: "#495057", 
            fontSize: "16px", 
            fontWeight: "bold"
          }}>
            {getRealPrice()}
          </div>
        </div>

        {/* Bookings Count */}
        <div className="text-center">
          <span style={{ 
            color: "#6c757d", 
            fontSize: "12px"
          }}>
            ({salonData.total_completed_bookings || 127}) حجز مكتمل
          </span>
        </div>
      </div>

      {/* Booking Button */}
      <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
        <button 
          className="btn w-100 booking-btn"
          style={{
            background: '#0171BD',
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(1, 113, 189, 0.3)",
            transition: "all 0.3s ease"
          }}
          onClick={handleBookingClick}
          onMouseEnter={(e) => {
            e.target.style.background = '#015a9a';
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(1, 113, 189, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#0171BD';
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(1, 113, 189, 0.3)";
          }}
        >
          <FontAwesomeIcon icon={faCalendarCheck} />
          احجز الآن
        </button>
      </div>
    </div>
    </>
  );
}

export default DoctorCard;