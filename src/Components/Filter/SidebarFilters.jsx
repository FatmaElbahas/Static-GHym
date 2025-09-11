import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faHospital,
  faStethoscope,
  faUserMd,
  faStar,
  faCalendarAlt,
  faMoneyBillWave,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
export default function SidebarFilters() {
  return (
    <aside className="col-lg-3 col-md-4">
    <div
      className="p-5 bg-white"
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h5 className="fw-bold mb-4 main-color">تصفية النتائج</h5>
  
      {/* City Filter */}
      <div className="form-group mb-4">
        <label className="form-label d-flex align-items-center mb-2 main-color">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
          المدينة
        </label>
        <select className="form-select rounded-pill border-0 bg-light">
          <option>الكل</option>
          <option>الرياض</option>
          <option>جدة</option>
          <option>الدمام</option>
        </select>
      </div>
  
      {/* Medical Center Filter */}
      <div className="form-group mb-4">
        <label className="form-label main-color d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faHospital} className="me-2" />
          المركز الطبي
        </label>
        <select className="form-select rounded-pill border-0 bg-light">
          <option>الكل</option>
          <option>مركز بلسمي الرئيسي</option>
          <option>فرع الرياض</option>
          <option>فرع جدة</option>
        </select>
      </div>
  
      {/* Specialty Filter */}
      <div className="form-group mb-4">
        <label className="form-label d-flex main-color align-items-center mb-2">
          <FontAwesomeIcon icon={faStethoscope} className="me-2" />
          التخصص
        </label>
        <select className="form-select rounded-pill border-0 bg-light">
          <option>الكل</option>
          <option>الجلدية</option>
          <option>التجميل</option>
          <option>الليزر</option>
        </select>
      </div>
  
      {/* Doctor Filter */}
      <div className="form-group mb-4">
        <label className="form-label main-color d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faUserMd} className="me-2" />
          الطبيب
        </label>
        <select className="form-select rounded-pill border-0 bg-light">
          <option>الكل</option>
          <option>د. أحمد محمد</option>
          <option>د. فاطمة علي</option>
          <option>د. خالد السعد</option>
        </select>
      </div>
  
      {/* Rating Filter */}
      <div className="form-group mb-4">
        <label className="form-label main-color d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faStar} className="me-2" />
          التصنيف
        </label>
        <select className="form-select rounded-pill border-0 bg-light">
          <option>الكل</option>
          <option>5 نجوم</option>
          <option>4 نجوم</option>
          <option>3 نجوم</option>
        </select>
      </div>
  
      {/* Date Filter */}
      <div className="form-group mb-4">
        <label className="form-label main-color d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          التاريخ
        </label>
        <input
          type="date"
          className="form-control rounded-pill border-0 bg-light"
        />
      </div>
  
      {/* Price Range */}
<div className="form-group mb-2">
  <label className="form-label main-color d-flex align-items-center mb-3">
    <FontAwesomeIcon icon={faMoneyBillWave} className="me-5" />
    نطاق السعر
  </label>
  <div className="d-flex flex-column gap-2">
    <div className="form-check d-flex align-items-center gap-5">
      <input type="radio" name="priceRange" id="price1" className="form-check-input" />
      <label htmlFor="price1" className="form-check-label mb-0">أقل من 100 ريال</label>
    </div>
    <div className="form-check d-flex align-items-center gap-5">
      <input type="radio" name="priceRange" id="price2" className="form-check-input" />
      <label htmlFor="price2" className="form-check-label mb-0">100 - 300 ريال</label>
    </div>
    <div className="form-check d-flex align-items-center gap-5">
      <input type="radio" name="priceRange" id="price3" className="form-check-input" />
      <label htmlFor="price3" className="form-check-label mb-0">300 - 500 ريال</label>
    </div>
    <div className="form-check d-flex align-items-center gap-5">
      <input type="radio" name="priceRange" id="price4" className="form-check-input" />
      <label htmlFor="price4" className="form-check-label mb-0">أكثر من 500 ريال</label>
    </div>
  </div>
</div>

    {/* Apply Filters Button */}
    <div className="mt-3">
      <button
        className="btn w-100 text-white fw-bold"
        style={{
          backgroundColor: "var(--color-main)",
          borderColor: "var(--color-main)",
        }}
      >
        <FontAwesomeIcon icon={faFilter} className="me-2" />
        تطبيق الفلاتر
      </button>
    </div>
  </div>
</aside>
  );
}