import React, { useState } from "react";

export default function SearchBox() {
  const [activeTab, setActiveTab] = useState("doctor");

  return (
    <div
      className="p-4 rounded shadow-sm bg-white"
      style={{ borderRadius: "12px" }}
      dir="rtl"
    >
      {/* Tabs */}
      <ul className="nav nav-tabs border-0 mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "doctor" ? "active text-primary fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("doctor")}
          >
            دكتور
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "clinic" ? "active text-primary fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("clinic")}
          >
            عيادة
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "general" ? "active text-primary fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("general")}
          >
            عام
          </button>
        </li>
      </ul>

      {/* Search Inputs */}
      <div className="row g-2 align-items-center">
        {/* Doctor Name / Specialty */}
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={
              activeTab === "doctor"
                ? "اسم الدكتور أو التخصص"
                : activeTab === "clinic"
                ? "اسم العيادة"
                : "كلمة البحث"
            }
          />
        </div>

        {/* City Select */}
        <div className="col-md-3">
          <select className="form-select">
            <option>الرياض</option>
            <option>جدة</option>
            <option>الدمام</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="col-md-3">
          <button className="btn btn-primary w-100">
            <i className="fas fa-search ms-2"></i>
            بحث
          </button>
        </div>
      </div>
    </div>
  );
}