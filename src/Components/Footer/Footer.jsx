import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faTiktok, faSnapchatGhost } from "@fortawesome/free-brands-svg-icons";
import { faCcMastercard, faCcVisa, faCcApplePay } from "@fortawesome/free-brands-svg-icons";

const logo1 = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";
import sbc from "../../assets/images/sbc.png";
import vat from "../../assets/images/vat.png";

export default function Footer() {
  return (
    <footer className="bg-main py-5 text-white">
      <div className="container">
        {/* التصميم الأصلي للشاشات الكبيرة */}
        <div className="d-none d-md-block">
          {/* الجزء العلوي */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
            
            {/* تحميل التطبيق */}
            <div className="text-center text-md-start" style={{ marginTop: '10px' }}>
              <h5 className="fw-bold mb-3 footer-title">حمل تطبيق غنيم لحجز مواعيدك بسهولة</h5>
              <div className="d-flex gap-3 justify-content-center justify-content-md-start flex-wrap mt-5">
                {/* زر جوجل بلاي */}
                <button className="d-flex align-items-center gap-2 rounded-pill px-5 py-3 bg-transparent text-white border border-white fw-bold">
                  <i className="fab fa-google-play" style={{ fontSize: '1.5em' }}></i>
                  جوجل بلاي
                </button>

                {/* زر ابل استور */}
                <button className="d-flex align-items-center gap-2 rounded-pill px-5 py-3 bg-transparent text-white border border-white fw-bold">
                  ابل استور <FontAwesomeIcon icon={faAppleAlt} style={{ fontSize: '1.5em' }} />
                </button>
              </div>
            </div>

            {/* اللوجو + السوشيال + الدفع */}
            <div className="text-center d-flex flex-column justify-content-center align-items-center">
              <img src={logo1} alt="Logo" style={{ width: "100px" }} />

              {/* أيقونات السوشيال */}
              <ul className="list-unstyled d-flex gap-3 justify-content-center mt-3 mb-3">
                <li><a href="#" className="text-white"><FontAwesomeIcon icon={faFacebookF} size="lg" /></a></li>
                <li><a href="#" className="text-white"><FontAwesomeIcon icon={faTwitter} size="lg" /></a></li>
                <li><a href="#" className="text-white"><FontAwesomeIcon icon={faInstagram} size="lg" /></a></li>
                <li><a href="#" className="text-white"><FontAwesomeIcon icon={faTiktok} size="lg" /></a></li>
                <li><a href="#" className="text-white"><FontAwesomeIcon icon={faSnapchatGhost} size="lg" /></a></li>
              </ul>

              {/* أيقونات الدفع */}
              <ul className="list-unstyled d-flex gap-3 justify-content-center mb-0">
                <li><FontAwesomeIcon icon={faCcMastercard} size="2x" style={{ color: '#FF5F00' }} /></li>
                <li><FontAwesomeIcon icon={faCcVisa} size="2x" style={{ color: '#1A1F71' }} /></li>
                <li><FontAwesomeIcon icon={faCcApplePay} size="2x" style={{ color: '#000' }} /></li>
              </ul>
            </div>
          </div>

          {/* الجزء السفلي */}
          <div className="copyRight mt-4 pt-3 border-top border-light">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              {/* VAT + SBC */}
              <div className="d-flex align-items-center gap-3 footer-certificates">
                <div className="d-flex align-items-center gap-2 footer-vat-section">
                  <img src={vat} alt="VAT" className="footer-vat-img" style={{ width: "40px" }} />
                  <span className="footer-text">الرقم الضريبي: 312066452700003</span>
                </div>
                <div className="footer-divider" style={{ width: '2px', height: '40px', backgroundColor: 'white' }}></div>
                <div className="footer-sbc-section">
                  <img src={sbc} alt="SBC" className="footer-sbc-img" style={{ width: "90px" }} />
                </div>
              </div>

              {/* حقوق النشر */}
              <div className="text-center text-md-end">
                <p className="mb-1 footer-copyright">جميع الحقوق محفوظة لشركة فن التطبيقات لتقنية المعلومات © 2025</p>
                <p className="mb-0 footer-copyright">سجل تجاري رقم ٢٠٥٠١٤٢٦٣٧ | سياسة الخصوصية</p>
              </div>
            </div>
          </div>
        </div>

        {/* التصميم الجديد للموبايل والتابلت */}
        <div className="d-block d-md-none">
          {/* الجزء العلوي - تحميل التطبيق */}
          <div className="text-center mb-4">
            {/* اللوجو مع النص */}
            <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
              <img src={logo1} alt="Logo" className="footer-logo" style={{ width: "60px", height: "60px" }} />
              <h5 className="fw-bold mb-0 footer-title">حمل تطبيق غنيم لحجز مواعيدك بسهولة</h5>
            </div>
            
            {/* أزرار التحميل */}
            <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
              {/* زر جوجل بلاي */}
              <button className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 bg-transparent text-white border border-white fw-bold download-btn">
                <i className="fab fa-google-play" style={{ fontSize: '1.2em' }}></i>
                جوجل بلاي
              </button>

              {/* زر ابل استور */}
              <button className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 bg-transparent text-white border border-white fw-bold download-btn">
                ابل استور <FontAwesomeIcon icon={faAppleAlt} style={{ fontSize: '1.2em' }} />
              </button>
            </div>

            {/* تابعنا */}
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
              <span className="footer-text">تابعنا</span>
              <ul className="list-unstyled d-flex gap-2 mb-0">
                <li><a href="#" className="text-white social-link"><FontAwesomeIcon icon={faFacebookF} size="sm" /></a></li>
                <li><a href="#" className="text-white social-link"><FontAwesomeIcon icon={faSnapchatGhost} size="sm" /></a></li>
                <li><a href="#" className="text-white social-link"><FontAwesomeIcon icon={faFacebookF} size="sm" /></a></li>
                <li><a href="#" className="text-white social-link"><FontAwesomeIcon icon={faTiktok} size="sm" /></a></li>
                <li><a href="#" className="text-white social-link"><FontAwesomeIcon icon={faTwitter} size="sm" /></a></li>
                <li><a href="#" className="text-white social-link"><FontAwesomeIcon icon={faInstagram} size="sm" /></a></li>
              </ul>
            </div>

            {/* خط فاصل */}
            <hr className="border-light mb-3" />

            {/* طرق الدفع */}
            <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
              <FontAwesomeIcon icon={faCcVisa} size="lg" style={{ color: '#1A1F71' }} />
              <FontAwesomeIcon icon={faCcApplePay} size="lg" style={{ color: '#000' }} />
              <span className="footer-text">مدى</span>
              <span className="footer-text">tabby</span>
            </div>

            {/* خط فاصل */}
            <hr className="border-light mb-3" />

            {/* حقوق النشر */}
            <div className="text-center">
              <p className="mb-1 footer-copyright">جميع الحقوق محفوظة لشركة فن التطبيقات لتقنية المعلومات © 2025</p>
              <p className="mb-2 footer-copyright">سجل تجاري رقم ٢٠٥٠١٤٢٦٣٧ | سياسة الخصوصية</p>
              
              {/* VAT */}
              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <div className="bg-warning px-2 py-1 rounded" style={{ fontSize: '0.7rem' }}>
                  <div className="text-dark fw-bold">ضريبة القيمة المضافة</div>
                  <div className="text-dark fw-bold">VAT</div>
                </div>
                <span className="footer-text">الرقم الضريبي: 312066452700003</span>
              </div>

              {/* SBC */}
              <div className="d-flex justify-content-center align-items-center gap-2">
                <span className="footer-text">موثق لدى</span>
                <span className="footer-text">المركز السعودي للأعمال</span>
                <span className="footer-text">Saudi Business Center</span>
                <img src={sbc} alt="SBC" className="footer-sbc-img" style={{ width: "60px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* زر الواتساب */}
        <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
          <a href="https://wa.me/966500000000" className="btn btn-success rounded-circle shadow-lg" style={{ 
            width: '70px', 
            height: '70px', 
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#25D366',
            border: 'none',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
          }}>
            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '2.5em', color: 'white' }} />
          </a>
        </div>

      </div>
    </footer>
  );
}