/**
 * بيانات محلية كبديل للـ APIs في حالة فشل الخادم
 */

// بيانات العيادات المحلية
export const mockSalonsData = [
  {
    id: 1,
    salon_name: "عيادة الأسنان المتميزة",
    owner_name: "د. مريم علي",
    owner_photo: "https://www.w3schools.com/howto/img_avatar.png",
    salon_address: "شارع البحر - المدينة المنورة",
    salon_phone: "+966 502624351",
    salon_categories: "1,2",
    rating: 4.5,
    reviews_avg_rating: 4.5,
    total_completed_bookings: 150,
    services: [
      {
        id: 1,
        title_ar: "تنظيف الأسنان",
        title_en: "Teeth Cleaning",
        price: 100,
        service_time: 30
      },
      {
        id: 2,
        title_ar: "حشو الأسنان",
        title_en: "Dental Filling",
        price: 200,
        service_time: 60
      },
      {
        id: 3,
        title_ar: "تبييض الأسنان",
        title_en: "Teeth Whitening",
        price: 300,
        service_time: 90
      }
    ],
    staff: [
      {
        id: 1,
        name: "د. مريم علي",
        specialization: "طب الأسنان العام",
        photo: "https://www.w3schools.com/howto/img_avatar.png"
      }
    ],
    created_at: "2025-06-22T07:28:17.000000Z",
    updated_at: "2025-06-22T07:38:32.000000Z"
  },
  {
    id: 2,
    salon_name: "عيادة الأسنان المتقدمة",
    owner_name: "د. أحمد محمد",
    owner_photo: "https://www.w3schools.com/howto/img_avatar.png",
    salon_address: "الفيوم - الممشى السياحي",
    salon_phone: "+966 502624352",
    salon_categories: "2,1",
    rating: 4.8,
    reviews_avg_rating: 4.8,
    total_completed_bookings: 200,
    services: [
      {
        id: 4,
        title_ar: "تقويم الأسنان",
        title_en: "Orthodontics",
        price: 500,
        service_time: 120
      },
      {
        id: 5,
        title_ar: "زراعة الأسنان",
        title_en: "Dental Implant",
        price: 800,
        service_time: 180
      }
    ],
    staff: [
      {
        id: 2,
        name: "د. أحمد محمد",
        specialization: "تقويم الأسنان",
        photo: "https://www.w3schools.com/howto/img_avatar.png"
      }
    ],
    created_at: "2025-06-22T07:28:17.000000Z",
    updated_at: "2025-06-22T07:38:32.000000Z"
  },
  {
    id: 3,
    salon_name: "عيادة الأسنان المتخصصة",
    owner_name: "د. فاطمة السعد",
    owner_photo: "https://www.w3schools.com/howto/img_avatar.png",
    salon_address: "القاهرة - مصر الجديدة",
    salon_phone: "+966 502624353",
    salon_categories: "1,2",
    rating: 4.2,
    reviews_avg_rating: 4.2,
    total_completed_bookings: 120,
    services: [
      {
        id: 6,
        title_ar: "علاج الجذور",
        title_en: "Root Canal",
        price: 400,
        service_time: 90
      },
      {
        id: 7,
        title_ar: "تركيب الأسنان",
        title_en: "Crown Installation",
        price: 600,
        service_time: 120
      }
    ],
    staff: [
      {
        id: 3,
        name: "د. فاطمة السعد",
        specialization: "جراحة الفم والأسنان",
        photo: "https://www.w3schools.com/howto/img_avatar.png"
      }
    ],
    created_at: "2025-06-22T07:28:17.000000Z",
    updated_at: "2025-06-22T07:38:32.000000Z"
  }
];

// بيانات التصنيفات المحلية
export const mockCategoriesData = [
  {
    id: 1,
    title_ar: "علاج الأسنان",
    title_en: "Dental Treatment",
    about_ar: "جميع أنواع علاجات الأسنان واللثة",
    about_en: "All types of dental and gum treatments",
    icon: "uploads/dental-icon.png",
    icon_url: "https://enqlygo.com/uploads/dental-icon.png"
  },
  {
    id: 2,
    title_ar: "تقويم الأسنان",
    title_en: "Orthodontics",
    about_ar: "تقويم الأسنان وتصحيح الإطباق",
    about_en: "Teeth alignment and bite correction",
    icon: "uploads/ortho-icon.png",
    icon_url: "https://enqlygo.com/uploads/ortho-icon.png"
  }
];

// بيانات العناوين المحلية
export const mockAddressesData = [
  "شارع البحر - المدينة المنورة",
  "الفيوم - الممشى السياحي",
  "القاهرة - مصر الجديدة",
  "الرياض - حي الملز",
  "جدة - حي الزهراء"
];

// دالة لمحاكاة استجابة API
export const createMockApiResponse = (data, message = "success") => {
  return {
    status: "success",
    data: data,
    message: message
  };
};

// دالة للحصول على بيانات عيادة محددة
export const getMockSalonById = (salonId) => {
  return mockSalonsData.find(salon => salon.id == salonId) || null;
};

// دالة للحصول على خدمات عيادة محددة
export const getMockServicesBySalonId = (salonId) => {
  const salon = getMockSalonById(salonId);
  return salon ? salon.services : [];
};

// دالة للحصول على طاقم عيادة محددة
export const getMockStaffBySalonId = (salonId) => {
  const salon = getMockSalonById(salonId);
  return salon ? salon.staff : [];
};
