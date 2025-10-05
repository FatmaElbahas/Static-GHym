# ملخص إصلاح خطأ الاستيراد

## المشكلة:
```
Uncaught SyntaxError: The requested module '/src/hooks/useSalonsData.js?t=1759651589891' does not provide an export named 'default'
```

## السبب:
في ملف `src/Components/Home/SectionsCarousel.jsx` كان يتم استيراد `useSalonsData` كـ default export:
```javascript
import useSalonsData from '../../hooks/useSalonsData'; // ❌ خطأ
```

لكن في ملف `src/hooks/useSalonsData.js` لا يوجد default export، بل named exports فقط.

## الحل:
تم تغيير الاستيراد إلى named export:
```javascript
import { useSalonsData } from '../../hooks/useSalonsData'; // ✅ صحيح
```

## الملفات المحدثة:
1. `src/Components/Home/SectionsCarousel.jsx` - السطر 7

## التحقق:
- ✅ لا توجد أخطاء في البناء
- ✅ جميع الاستيرادات صحيحة الآن
- ✅ الكود يعمل بشكل طبيعي

## ملاحظة:
جميع الـ hooks في `useSalonsData.js` هي named exports:
- `useSalonsData`
- `useSalonData`
- `useSalonServices`
- `useSalonCategories`
- `useSalonServicesByCategory`

لذلك يجب استيرادها باستخدام `{ }` وليس كـ default import.
