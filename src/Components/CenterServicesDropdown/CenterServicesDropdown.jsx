import React, { useState } from "react";
import styles from "./CenterServicesDropdown.module.css";

export default function CenterServicesDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.dropdownContainer}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* زر خدمات المراكز مع سهم */}
      <button className={styles.dropdownButton}>
        خدمات المراكز <span className={styles.arrow}>▼</span>
      </button>

      {/* قائمة الـ Dropdown تظهر عند Hover */}
      {isOpen && (
        <div className={styles.dropdownBox}>
          <ul className={styles.dropdownList}>
            <li><a href="/join-center">الانضمام كمركز طبي</a></li>
            <li><a href="/login-center">تسجيل الدخول كمركز طبي</a></li>
            <li><a href="/plusmi-services">الربط مع خدمات بلسمي</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}