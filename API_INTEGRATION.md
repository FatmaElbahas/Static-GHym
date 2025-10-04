# دليل ربط API مع كومبوننتات Home

## 📡 الـ API المستخدم

### 1. About Endpoint
```
GET https://enqlygo.com/api/about
```

### 2. Reviews Endpoint
```
GET https://enqlygo.com/api/salons/reviews
```

### 3. Most Booked Services Endpoint
```
GET https://enqlygo.com/api/salons/most_booking_services
```

### 4. Salons/Sections Endpoint
```
GET https://enqlygo.com/api/salons
```

### 5. Products/Offers Endpoint
```
GET https://enqlygo.com/api/salons/2/services
```
يجلب جميع خدمات صالون رقم 2 (عيادة الأسنان المتميزة)

## 📁 مسارات الصور الثابتة

**المسار الأساسي:**
```
https://enqlygo.com/storage/app/public
```

**المجلدات الفرعية:**
- `/services/` - صور الخدمات
- `/uploads/` - صور عامة
- `/staff/` - صور الأطباء/الموظفين
- `/profile_images/` - صور البروفايل
- `/admin/` - صور الأدمن

**ملاحظة:** الـ API يرجع المسارات كاملة، لا نحتاج لبناءها يدوياً.

## 🔧 البنية التقنية

### 1. Custom Hook: `useAboutData.js`

تم إنشاء custom hook لجلب بيانات قسم "عن المستشفى" من الـ API:

**الموقع:** `src/hooks/useAboutData.js`

**المميزات:**
- ✅ جلب البيانات تلقائياً عند التحميل
- ✅ معالجة حالات Loading
- ✅ معالجة الأخطاء Error Handling
- ✅ Cache البيانات في الـ state
- ✅ إرجاع `{ data, loading, error }`

**مثال الاستخدام:**
```javascript
import useAboutData from '../../hooks/useAboutData';

const MyComponent = () => {
  const { data, loading, error } = useAboutData();
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage />;
  
  return <div>{data.main_title_ar}</div>;
};
```

### 2. AboutSection Component

تم تحديث `AboutSection.jsx` لاستخدام البيانات من الـ API:

**الموقع:** `src/Components/Home/AboutSection.jsx`

**البيانات المستخدمة من الـ API:**
- `about_ar` - نص الوصف (ديناميكي من API)
- العنوان ثابت: "مجمع غيم الطبي"

**الحالات المدعومة:**
1. **Loading State** - عرض spinner أثناء تحميل البيانات
2. **Error State** - fallback للمحتوى الافتراضي
3. **Success State** - عرض البيانات من الـ API

---

### 3. Custom Hook: `useReviewsData.js`

تم إنشاء custom hook لجلب آراء العملاء من الـ API:

**الموقع:** `src/hooks/useReviewsData.js`

**المميزات:**
- ✅ جلب قائمة التقييمات تلقائياً
- ✅ معالجة حالات Loading
- ✅ معالجة الأخطاء Error Handling
- ✅ إرجاع `{ data, loading, error }`

**مثال الاستخدام:**
```javascript
import useReviewsData from '../../hooks/useReviewsData';

const MyComponent = () => {
  const { data, loading, error } = useReviewsData();
  
  if (loading) return <Spinner />;
  
  return data.map(review => <ReviewCard key={review.id} {...review} />);
};
```

### 4. Testimonials Component

تم تحديث `Testimonials.jsx` لاستخدام البيانات من الـ API:

**الموقع:** `src/Components/Testimonials/Testimonials.jsx`

**البيانات المستخدمة من الـ API:**
- `id` - معرف التقييم
- `rating` - التقييم بالنجوم (1-5)
- `comment` - نص التقييم
- `user.fullname` - اسم العميل
- `user.profile_image` - صورة العميل
- `salon.salon_name` - اسم العيادة/الصالون

**المميزات:**
- ✅ عرض التقييم بالنجوم (Star Rating)
- ✅ اسم العميل (بدون صورة)
- ✅ اسم العيادة/القسم
- ✅ Fallback للبيانات الثابتة عند فشل API
- ✅ Loading state مع spinner

---

### 5. Custom Hook: `useServicesData.js`

تم إنشاء custom hook لجلب أبرز الخدمات (الأكثر حجزاً) من الـ API:

**الموقع:** `src/hooks/useServicesData.js`

**المميزات:**
- ✅ جلب قائمة أبرز الخدمات تلقائياً
- ✅ معالجة حالات Loading
- ✅ معالجة الأخطاء Error Handling
- ✅ إرجاع `{ data, loading, error }`

### 6. Services Component

تم تحديث `Services.jsx` لاستخدام البيانات من الـ API:

**الموقع:** `src/Components/Services/Services.jsx`

**البيانات المستخدمة من الـ API:**
- `id` - معرف الخدمة
- `title_ar` - عنوان الخدمة بالعربي
- `price` - السعر الأساسي
- `discount` - نسبة الخصم (إن وُجدت)
- `images` - مصفوفة الصور (يتم عرض الصورة الأولى)
- `bookings_count` - عدد الحجوزات
- `service_time` - مدة الخدمة بالدقائق

**المميزات:**
- ✅ عرض الصورة الأولى من مصفوفة الصور
- ✅ حساب السعر النهائي بعد الخصم
- ✅ عرض badge الخصم إذا كان موجوداً
- ✅ عرض السعر القديم مشطوب مع السعر الجديد
- ✅ رسالة "اتصل للسعر" عند عدم وجود سعر
- ✅ Fallback للبيانات الثابتة عند فشل API
- ✅ Loading state مع spinner

---

### 7. Custom Hook: `useSalonsData.js`

تم إنشاء custom hook لجلب الأقسام/الصالونات من الـ API:

**الموقع:** `src/hooks/useSalonsData.js`

**المميزات:**
- ✅ جلب قائمة الصالونات/الأقسام تلقائياً
- ✅ معالجة حالات Loading
- ✅ معالجة الأخطاء Error Handling
- ✅ إرجاع `{ data, loading, error }`

### 8. SectionsCarousel Component

تم تحديث `SectionsCarousel.jsx` لاستخدام البيانات من الـ API:

**الموقع:** `src/Components/Home/SectionsCarousel.jsx`

**البيانات المستخدمة من الـ API:**
- `id` - معرف القسم
- `salon_name` - اسم القسم/الصالون
- `owner_photo` - صورة القسم
- `images` - مصفوفة الصور (يتم عرض الأولى إن وُجدت)
- `status` - حالة القسم (يعرض فقط الأقسام النشطة)

**المميزات:**
- ✅ عرض الأقسام النشطة فقط (status === 1)
- ✅ استخدام صورة من images أو owner_photo
- ✅ تجاهل الأقسام بدون صور
- ✅ Loading state مع spinner
- ✅ إخفاء القسم إذا لم توجد بيانات
- ✅ تأثيرات hover جميلة

## 📊 شكل البيانات (Response Structure)

### About API Response
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "main_title_ar": "عن المستشفى",
    "title_ar": "رؤيتنا ورسالتنا",
    "about_ar": "نص الوصف هنا...",
    "image": "https://example.com/image.jpg",
    "created_at": "2025-09-24T11:01:42.000000Z",
    "updated_at": "2025-09-29T08:09:32.000000Z"
  },
  "message": "تم الجلب بنجاح"
}
```

### Reviews API Response
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 6,
        "user_id": 1,
        "salon_id": 2,
        "booking_id": null,
        "rating": 5,
        "comment": "انصحكم بالعيادة والموظفات خلوقات رائعات ممتازات",
        "created_at": "2025-10-02T18:00:24.000000Z",
        "updated_at": "2025-10-02T18:00:24.000000Z",
        "user": {
          "id": 1,
          "fullname": "Ahmed Ibrahim",
          "profile_image": "https://enqlygo.com/storage/..."
        },
        "salon": {
          "id": 2,
          "salon_name": "عيادة الأسنان المتميزة"
        }
      }
    ],
    "per_page": 20,
    "total": 6
  },
  "message": "تم جلب التقييمات بنجاح"
}
```

### Services API Response
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "title_ar": "تنظيف الأسنان",
      "title_en": "Dental Cleaning",
      "price": 150,
      "discount": 25,
      "service_time": 30,
      "bookings_count": 56,
      "about_ar": "تنظيف احترافي للأسنان وإزالة الجير",
      "images": [
        {
          "id": 4,
          "service_id": 2,
          "image": "https://enqlygo.com/storage/..."
        }
      ]
    }
  ],
  "message": "تم جلب خدمات أكثر الصالونات حجزًا بنجاح"
}
```

### Salons API Response
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "status": 1,
      "salon_name": "عيادة الأسنان المتميزة",
      "owner_name": "د. مريم علي",
      "owner_photo": "https://enqlygo.com/storage/...",
      "salon_about": "عيادة أسنان متخصصة...",
      "salon_phone": "+966 502624351",
      "reviews_avg_rating": 5,
      "reviews_count": 4,
      "images": [
        {
          "id": 1,
          "image": "https://enqlygo.com/storage/..."
        }
      ]
    }
  ],
  "message": "Salons retrieved successfully"
}
```

## 🎨 المميزات الإضافية

### Fallback Content
في حالة فشل الـ API، يتم عرض المحتوى الافتراضي:
- العنوان: "مجمع غيم الطبي"
- الوصف: النص الافتراضي عن المجمع

### Performance
- ✅ **Lazy Loading** للصورة
- ✅ **Single API Call** عند تحميل الكومبوننت
- ✅ **No Re-fetching** - البيانات تُجلب مرة واحدة فقط
- ✅ **Error Recovery** - استمرار العمل حتى مع فشل الـ API

### Responsive Design
- ✅ تصميم متجاوب للموبايل والتابلت
- ✅ أحجام خطوط ديناميكية
- ✅ عرض مثالي للصورة على جميع الشاشات

## 🚀 التطوير المستقبلي

### إضافة APIs أخرى:
يمكن إنشاء custom hooks مشابهة لـ:
- Services (الخدمات)
- Sections (الأقسام)
- Testimonials (آراء العملاء)
- Contact Info (معلومات التواصل)

### مثال لإنشاء hook جديد:
```javascript
// src/hooks/useServicesData.js
import { useState, useEffect } from 'react';

const useServicesData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://enqlygo.com/api/services');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useServicesData;
```

## 📝 ملاحظات مهمة

1. **CORS**: تأكد من أن الـ API يسمح بالطلبات من domain موقعك
2. **Loading State**: دائماً اعرض loading indicator للمستخدم
3. **Error Handling**: لا تترك المستخدم في صفحة فارغة عند حدوث خطأ
4. **Caching**: فكر في استخدام React Query أو SWR للـ caching المتقدم

## 🔗 روابط مفيدة

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Error Handling Best Practices](https://react.dev/learn/error-boundaries)

