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
    <footer className="mt-4" style={{ backgroundColor: '#ffffff', width: '90%', margin: '0 auto' }}>
      <div className="py-5">
        <div className="foot1" style={{ backgroundColor: '#F9F9F9' }}>
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-5 py-5">
            {/* أيقونات التواصل */}
            <div className="footer-social-icons mx-auto">
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
                  <FontAwesomeIcon icon={item.icon} style={{ color: '#DFD458' }} className="footer-icon" />
                </div>
              ))}
            </div>

            {/* روابط مهمة */}
            <div className="flex-grow-1 footer-links-section" style={{ minWidth: '260px' }}>
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
              <div className="footer-payment-icons mx-auto">
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

        {/* سطر سفلي */}
        <div className="footer-bottom-section">
          <div className="footer-zid-section">
            <span>صنع بواسطة زد</span>
            <img
              src="https://media.zid.store/d297fb8b-c322-412e-a2f4-ffa96dc57022/b6aca386-4eeb-4e0f-8009-35ca7063d184.svg"
              alt="Zid"
              className="footer-zid-logo"
              loading="lazy"
            />
            <div className="footer-vat-box">
              <img src={vatIcon} alt="VAT" className="footer-vat-img" />
            </div>
          </div>
          <div className="footer-registry-text">رقم السجل التجاري: 1010796858</div>
        </div>
      </div>
    </footer>
  );
}