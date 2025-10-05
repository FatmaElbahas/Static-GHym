# مثال على اختبار API العيادات

## كيفية اختبار الـ API

### 1. اختبار جلب جميع العيادات:
```bash
curl -X GET "https://enqlygo.com/api/salons"
```

### 2. اختبار جلب عيادة محددة:
```bash
curl -X GET "https://enqlygo.com/api/salons/2"
```

### 3. اختبار جلب خدمات عيادة محددة:
```bash
curl -X GET "https://enqlygo.com/api/salons/2/services"
```

### 4. اختبار جلب خدمات قسم محدد:
```bash
curl -X GET "https://enqlygo.com/api/salons/2/services?category_id=1"
```

## مثال على الاستجابة المتوقعة:

### استجابة العيادات:
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "salon_name": "عيادة الأسنان المتميزة",
      "owner_name": "د. مريم علي",
      "salon_categories": "1,2",
      "services": [...]
    }
  ]
}
```

### استجابة الخدمات:
```json
{
  "status": "success",
  "data": {
    "services": [
      {
        "id": 6,
        "title_ar": "٧مل فيلر كونتور وجه كامل",
        "price": 0,
        "service_time": 92,
        "category_id": 1
      }
    ]
  }
}
```

## اختبار في المتصفح:

### 1. فتح Developer Tools (F12)
### 2. الانتقال إلى Console
### 3. تشغيل الكود التالي:

```javascript
// اختبار جلب العيادات
fetch('https://enqlygo.com/api/salons')
  .then(response => response.json())
  .then(data => console.log('العيادات:', data))
  .catch(error => console.error('خطأ:', error));

// اختبار جلب خدمات عيادة محددة
fetch('https://enqlygo.com/api/salons/2/services')
  .then(response => response.json())
  .then(data => console.log('خدمات العيادة:', data))
  .catch(error => console.error('خطأ:', error));
```

## اختبار في React:

```javascript
import { useEffect, useState } from 'react';

const TestAPI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('https://enqlygo.com/api/salons');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      <h2>نتائج API:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestAPI;
```

## نصائح للاختبار:

1. **تحقق من CORS**: تأكد أن API يدعم CORS للطلبات من المتصفح
2. **تحقق من الصيغة**: تأكد أن الاستجابة في الصيغة المتوقعة
3. **اختبر الأخطاء**: جرب IDs غير موجودة لاختبار معالجة الأخطاء
4. **اختبر الفلترة**: جرب معاملات مختلفة للفلترة

## مثال على معالجة الأخطاء:

```javascript
const handleAPICall = async (url) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'فشل في جلب البيانات');
    }
    
    return data.data;
  } catch (error) {
    console.error('خطأ في API:', error);
    throw error;
  }
};
```
