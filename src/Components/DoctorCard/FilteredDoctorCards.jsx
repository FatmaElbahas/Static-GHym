import React from 'react';
import { useFilter } from '../../context/FilterContext';
import DoctorCard from './DoctorCard';

const FilteredDoctorCards = () => {
  const { getDisplayData, isFiltered, filteredData, allData } = useFilter();
  
  const displayData = getDisplayData();
  
  return (
    <div className="col-lg-9 col-md-8">
      <div className="row">
        {/* معلومات الفلترة */}
        <div className="col-12 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="main-color fw-bold mb-0">
              {isFiltered ? `النتائج المفلترة (${filteredData.length})` : `جميع النتائج (${allData.length})`}
            </h5>
            {isFiltered && (
              <small className="text-muted">
                تم تطبيق الفلاتر على {filteredData.length} من أصل {allData.length} نتيجة
              </small>
            )}
          </div>
        </div>
        
        {/* عرض الـ Cards */}
        {displayData.length > 0 ? (
          displayData.map((doctor, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <DoctorCard doc={doctor} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <div className="alert alert-info">
                <h6>لا توجد نتائج</h6>
                <p className="mb-0">
                  {isFiltered 
                    ? 'لم يتم العثور على نتائج تطابق الفلاتر المحددة. جرب تغيير معايير البحث.'
                    : 'لا توجد بيانات متاحة للعرض حالياً.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredDoctorCards;






