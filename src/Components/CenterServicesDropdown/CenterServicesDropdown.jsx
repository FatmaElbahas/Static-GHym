import React, { useState } from "react";
import { Link } from "react-router-dom";
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
            <li>
              <Link 
                to="/register"
                onClick={() => setIsOpen(false)}
              >
                الانضمام كمركز طبي
              </Link>
            </li>
            <li>
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
              >
                تسجيل الدخول كمركز طبي
              </Link>
            </li>
            <li>
              <a 
                href="/plusmi-services"
                onClick={() => setIsOpen(false)}
              >
                الربط مع خدمات غنيم
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}