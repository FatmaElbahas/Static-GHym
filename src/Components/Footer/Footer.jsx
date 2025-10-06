import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faTiktok, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import tabbyIcon from '../../assets/images/tabby2.svg';
import tamaraIcon from '../../assets/images/tamara2.svg';
import amexIcon from '../../assets/images/amex.webp';
import mastercardIcon from '../../assets/images/mastercard-circle.png';
import visaIcon from '../../assets/images/visa-circle.png';
import madaIcon from '../../assets/images/mada-circle.webp';
import applePayIcon from '../../assets/images/apple_pay.svg';
import bankTransferIcon from '../../assets/images/bankTransfer.png';
import vatIcon from '../../assets/images/vat.svg';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const socialIcons = [
    { icon: faInstagram, hoverColor: '#E1306C' },
    { icon: faTiktok, hoverColor: '#000000' },
    { icon: faTwitter, hoverColor: '#1DA1F2' },
    { icon: faSnapchat, hoverColor: '#FFFC00' },
    { icon: faGlobe, hoverColor: null },
    { icon: faEnvelope, hoverColor: '#EA4335' },
    { icon: faPhone, hoverColor: '#25D366' }
  ];

  return (
    <footer style={{ 
      backgroundColor: '#F9F9F9', 
      width: '100%',
      marginTop: isMobile ? '1.5rem' : '1.5rem'
    }}>
      <div style={{ 
        width: isMobile ? '90%' : '90%', 
        margin: '0 auto',
        paddingTop: isMobile ? '1.5rem' : '3rem',
        paddingBottom: isMobile ? '1.5rem' : '3rem'
      }}>
        <div className="foot1">
          <div className="d-flex flex-wrap align-items-start justify-content-between" style={{
            paddingTop: isMobile ? '1rem' : '3rem',
            paddingBottom: isMobile ? '1rem' : '3rem',
            gap: isMobile ? '1.5rem' : '3rem'
          }}>
            {/* أيقونات التواصل */}
            <div className="footer-social-icons" style={{ width: '100%' }}>
              {socialIcons.map((item, idx) => (
                <div 
                  key={idx} 
                  className="footer-social-icon-box"
                  onMouseEnter={(e) => {
                    if (item.hoverColor) {
                      if (item.hoverColor.includes('gradient')) {
                        e.currentTarget.style.background = item.hoverColor;
                      } else {
                        e.currentTarget.style.backgroundColor = item.hoverColor;
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.hoverColor) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ color: '#0171BD' }} className="footer-icon" />
                </div>
              ))}
            </div>

            {/* روابط مهمة */}
            <div className="flex-grow-1 footer-links-section" style={{ minWidth: isMobile ? '100%' : '260px', width: '100%' }}>
              <div className="d-none d-lg-block">
                <h2 className="mb-3" style={{ color: '#484848', fontSize: '30px', fontWeight: '500' }}>روابط مهمة</h2>
                <ul className="list-unstyled m-0" style={{ color: '#484848', lineHeight: 2, paddingRight: 0 }}>
                  <li>- سياسة الخصوصية</li>
                  <li>- تواصل معنا</li>
                  <li>- خريطة الموقع</li>
                  <li>- حجز مواعيد</li>
                </ul>
              </div>

              {/* شعارات وسائل الدفع */}
              <div className="footer-payment-icons" style={{ width: '100%' }}>
                {[
                  { src: applePayIcon, alt: 'Apple Pay' },
                  { src: madaIcon, alt: 'Mada' },
                  { src: visaIcon, alt: 'Visa' },
                  { src: mastercardIcon, alt: 'Mastercard' },
                  { src: amexIcon, alt: 'American Express' },
                  { src: tamaraIcon, alt: 'Tamara' },
                  { src: tabbyIcon, alt: 'Tabby' },
                  { src: bankTransferIcon, alt: 'Bank Transfer' },
                ].map((item, i) => (
                  <div key={i} className="footer-payment-icon-box">
                    <img src={item.src} alt={item.alt} loading="lazy" className="footer-payment-img" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
}