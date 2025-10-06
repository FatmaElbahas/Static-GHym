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
      marginTop: isMobile ? '1.5rem' : '3rem'
    }}>
      <div style={{ 
        width: isMobile ? '90%' : '85%', 
        maxWidth: '1400px',
        margin: '0 auto',
        paddingTop: isMobile ? '1.5rem' : '3.5rem',
        paddingBottom: isMobile ? '1.5rem' : '3.5rem'
      }}>
        <div className="foot1">
          <div className={isMobile ? 'd-flex flex-column gap-3' : 'row'} style={{
            paddingTop: isMobile ? '1rem' : '2rem',
            paddingBottom: isMobile ? '1rem' : '2rem'
          }}>
            {/* على Desktop: أيقونات التواصل على اليمين */}
            {!isMobile && (
              <div className="col-lg-4">
                <h3 className="mb-4" style={{ color: '#484848', fontSize: '26px', fontWeight: '700' }}>تواصل معنا</h3>
                <div className="footer-social-icons d-flex flex-wrap gap-3">
                  {socialIcons.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="footer-social-icon-box"
                      style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e9ecef',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        if (item.hoverColor) {
                          e.currentTarget.style.backgroundColor = item.hoverColor;
                          e.currentTarget.querySelector('svg').style.color = '#ffffff';
                        } else {
                          e.currentTarget.style.backgroundColor = '#0171BD';
                          e.currentTarget.querySelector('svg').style.color = '#ffffff';
                        }
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.querySelector('svg').style.color = '#0171BD';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon} style={{ color: '#0171BD', fontSize: '22px', transition: 'color 0.3s ease' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* روابط مهمة - على Desktop */}
            {!isMobile && (
              <div className="col-lg-4">
                <h3 className="mb-4" style={{ color: '#484848', fontSize: '26px', fontWeight: '700' }}>روابط مهمة</h3>
                <ul className="list-unstyled m-0" style={{ color: '#484848', lineHeight: 2.2, paddingRight: 0, fontSize: '16px', fontWeight: '500' }}>
                  <li style={{ 
                    padding: '0.4rem 0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0171BD';
                    e.currentTarget.style.paddingRight = '10px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#484848';
                    e.currentTarget.style.paddingRight = '0';
                  }}
                  >- سياسة الخصوصية</li>
                  <li style={{ 
                    padding: '0.4rem 0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0171BD';
                    e.currentTarget.style.paddingRight = '10px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#484848';
                    e.currentTarget.style.paddingRight = '0';
                  }}
                  >- تواصل معنا</li>
                  <li style={{ 
                    padding: '0.4rem 0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0171BD';
                    e.currentTarget.style.paddingRight = '10px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#484848';
                    e.currentTarget.style.paddingRight = '0';
                  }}
                  >- خريطة الموقع</li>
                  <li style={{ 
                    padding: '0.4rem 0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0171BD';
                    e.currentTarget.style.paddingRight = '10px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#484848';
                    e.currentTarget.style.paddingRight = '0';
                  }}
                  >- حجز مواعيد</li>
                </ul>
              </div>
            )}

            {/* شعارات وسائل الدفع */}
            <div className={isMobile ? 'w-100' : 'col-lg-4'}>
              {!isMobile && <h3 className="mb-4" style={{ color: '#484848', fontSize: '26px', fontWeight: '700' }}>وسائل الدفع</h3>}
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

            {/* أيقونات التواصل - على الموبايل */}
            {isMobile && (
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
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}