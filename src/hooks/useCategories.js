import { useState, useEffect, useCallback } from 'react';

/**
 * Hook مخصص لجلب وإدارة فئات العيادات
 * يحسن الأداء بتخزين الفئات في الذاكرة وتجنب استدعاءات API المتكررة
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching categories from API...');
      const response = await fetch('https://enqlygo.com/api/salons/categories', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // إضافة timeout
        signal: AbortSignal.timeout(10000) // 10 ثواني
      });
      
      console.log('📊 Categories API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Categories API Response Data:', data);
        
        if (data.status === 'success' && data.data) {
          // معالجة البيانات وإضافة URL الصور
          const processedCategories = data.data.map(category => ({
            ...category,
            icon_url: category.icon ? `https://enqlygo.com/${category.icon}` : null
          }));
          
          setCategories(processedCategories);
          console.log('✅ Categories loaded successfully:', processedCategories.length);
        } else {
          throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Categories API error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError(err.message);
      
      // استخدام فئات احتياطية بناءً على البيانات الحقيقية من API
      setCategories([
        { 
          id: 1, 
          title: 'علاج الأسنان',
          title_ar: 'علاج الأسنان', 
          title_en: 'Dental Treatment',
          about_ar: 'جميع أنواع علاجات الأسنان واللثة',
          about_en: 'All types of dental and gum treatments',
          icon: 'uploads/PzgadVisNCGNnGTV0mE3XuUXJ9QYrPBdIBYh2S7K.png',
          icon_url: 'https://enqlygo.com/uploads/PzgadVisNCGNnGTV0mE3XuUXJ9QYrPBdIBYh2S7K.png',
          is_deleted: 0
        },
        { 
          id: 2, 
          title: 'تقويم الأسنان',
          title_ar: 'تقويم الأسنان', 
          title_en: 'Orthodontics',
          about_ar: 'تقويم الأسنان وتصحيح الإطباق',
          about_en: 'Teeth alignment and bite correction',
          icon: 'uploads/KppLdtrspWtSWfOU0T5EpOIqPOTF3K2EfE78Bwbn.png',
          icon_url: 'https://enqlygo.com/uploads/KppLdtrspWtSWfOU0T5EpOIqPOTF3K2EfE78Bwbn.png',
          is_deleted: 0
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // جلب الفئات عند تحميل المكون
    fetchCategories();
  }, [fetchCategories]);

  // دالة للحصول على اسم الفئة بالعربية
  const getCategoryName = useCallback((categoryId) => {
    if (!categoryId) return 'غير محدد';
    
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    
    console.log('🏷️ getCategoryName Debug:', {
      categoryId: categoryId,
      category: category,
      title_ar: category?.title_ar,
      title: category?.title,
      availableCategories: categories.map(c => ({ id: c.id, title_ar: c.title_ar, title: c.title }))
    });
    
    // استخدام title_ar أولاً، ثم title كبديل
    const result = category?.title_ar || category?.title || `تخصص ${categoryId}`;
    console.log('🏷️ getCategoryName Result:', result);
    
    return result;
  }, [categories]);

  // دالة للحصول على وصف الفئة بالعربية
  const getCategoryDescription = useCallback((categoryId) => {
    if (!categoryId) return null;
    
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category?.about_ar || null;
  }, [categories]);

  return {
    categories,
    isLoading,
    error,
    getCategoryName,
    getCategoryDescription,
    refetch: fetchCategories
  };
};
