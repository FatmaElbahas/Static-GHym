import React, { useState } from "react";
import styles from "./DropDown.module.css";

export default function DropDownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("كل المدن");

  const cities = ["كل المدن", "الرياض", "الدمام", "جدة"];

  const handleSelect = (city) => {
    setSelectedCity(city);
    setIsOpen(false); // يقفل القائمة بعد الاختيار
  };

  return (
    <div className={styles.dropdownContainer}>
      {/* الزرار الرئيسي */}
      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCity}
        <span className={styles.arrow}></span>
      </div>

      {/* القايمة */}
      {isOpen && (
        <ul className={styles.dropdownList}>
          {cities.map((city, index) => (
            <li
              key={index}
              className={`${styles.dropdownItem} ${
                selectedCity === city ? styles.selected : ""
              }`}
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

