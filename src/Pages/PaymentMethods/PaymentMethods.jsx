import React, { memo, useMemo } from 'react';
import tabbyIcon from '../../assets/images/tabby2.svg';
import tamaraIcon from '../../assets/images/tamara2.svg';
import amexIcon from '../../assets/images/amex.webp';
import mastercardIcon from '../../assets/images/mastercard-circle.png';
import visaIcon from '../../assets/images/visa-circle.png';
import madaIcon from '../../assets/images/mada-circle.webp';
import applePayIcon from '../../assets/images/apple_pay.svg';
import bankTransferIcon from '../../assets/images/bankTransfer.png';

// Memoized Payment Icon Component
const PaymentIcon = memo(({ icon, name }) => (
  <div 
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '85px',
      height: '85px',
      background: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      margin: '0 15px 30px 15px',
      padding: '20px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
    }}
  >
    <img 
      src={icon} 
      alt={name} 
      loading="lazy"
      width="45"
      height="45"
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'contain' 
      }} 
    />
  </div>
));

PaymentIcon.displayName = 'PaymentIcon';

// Memoized Shipping Option Component
const ShippingOption = memo(({ option }) => (
  <div className="col-6 col-lg-3">
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: '1.2rem 0.8rem',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <p style={{ 
        color: '#484848', 
        fontWeight: '700', 
        fontSize: '18px', 
        margin: 0,
        lineHeight: 1.4
      }}>
        {option}
      </p>
    </div>
  </div>
));

ShippingOption.displayName = 'ShippingOption';

const PaymentMethods = () => {
  // Use useMemo to prevent recreating arrays on every render
  const paymentMethods = useMemo(() => [
    { icon: applePayIcon, name: 'Apple Pay' },
    { icon: madaIcon, name: 'مدى' },
    { icon: tamaraIcon, name: 'tamara' },
    { icon: amexIcon, name: 'American Express' },
    { icon: mastercardIcon, name: 'Mastercard' },
    { icon: visaIcon, name: 'Visa' },
    { icon: tabbyIcon, name: 'tabby' },
    { icon: bankTransferIcon, name: 'تحويل بنكي' }
  ], []);

  const shippingOptions = useMemo(() => [
    'خيارات الشحن',
    'تكلفة الشحن',
    'للمدن التي يتم تغطيتها',
    'التوقع عند الإستلام'
  ], []);

  const bankAccounts = useMemo(() => [
    { label: 'اسم المحول له', value: 'Root Medical Complex' },
    { label: 'رقم الحساب', value: '5896080102888487' },
    { label: 'رقم الآيبان', value: 'SA1080000589608010288487' },
    { label: 'رقم السويفت', value: 'RJHISARI' }
  ], []);

  return (
    <div className="mt-5 payment-methods-page-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '40px' }}>
      <div className="py-4" style={{ width: '100%', margin: '0 auto' }}>
        
        {/* العنوان الرئيسي */}
        <div className="text-end mb-4" style={{
          backgroundColor: '#F9F9F9',
          padding: '1.5rem 2rem',
          borderRadius: '12px'
        }}>
          <div style={{ 
            color: '#484848', 
            fontWeight: '700', 
            fontSize: '30px',
            marginBottom: '0',
            letterSpacing: '-0.5px',
            wordSpacing: '-2px',
            padding: '0 15px'
          }}>
            خيارات الدفع و التوصيل
          </div>
        </div>

        {/* خيارات الشحن */}
        <div className="mb-5" style={{ width: '100%' }}>
          <div style={{ width: '95%', margin: '0 auto', padding: '0 15px' }}>
            <h2 style={{ 
              color: '#484848', 
              fontWeight: '700', 
              fontSize: '25px',
              marginBottom: '1rem',
              textAlign: 'right'
            }}>
              خيارات الشحن
            </h2>
          </div>
          
          {/* Horizontal Line */}
          <hr style={{ 
            width: '95%', 
            border: 'none', 
            borderTop: '2px solid #e0e0e0',
            margin: '0 auto 1.5rem auto'
          }} />
          
          <div className="row g-3" style={{ width: '95%', margin: '0 auto', padding: '0 15px',backgroundColor: '#f9f9f9' }}>
            {shippingOptions.map((option, idx) => (
              <ShippingOption key={idx} option={option} />
            ))}
          </div>
        </div>

        {/* خيارات الدفع */}
        <div className="mb-5" style={{ width: '100%' }}>
          <div style={{ width: '95%', margin: '0 auto', padding: '0 15px' }}>
            <h2 style={{ 
              color: '#484848', 
              fontWeight: '700', 
              fontSize: '25px',
              marginBottom: '1rem',
              textAlign: 'right'
            }}>
              خيارات الدفع
            </h2>
          </div>
          
          {/* Horizontal Line */}
          <hr style={{ 
            width: '95%', 
            border: 'none', 
            borderTop: '2px solid #e0e0e0',
            margin: '0 auto 1.5rem auto'
          }} />
          
          <div style={{ width: '95%', margin: '0 auto', padding: '0 15px' }}>
            <div className="d-flex flex-wrap justify-content-start gap-3 align-items-center" style={{ direction: 'rtl' }}>
              {paymentMethods.map((method, idx) => (
                <PaymentIcon key={idx} icon={method.icon} name={method.name} />
              ))}
            </div>
          </div>
        </div>

        {/* الحسابات البنكية */}
        <div className="mb-5" style={{ width: '100%' }}>
          <div style={{ width: '95%', margin: '0 auto', padding: '0 15px' }}>
            <h2 style={{ 
              color: '#484848', 
              fontWeight: '700', 
              fontSize: '25px',
              marginBottom: '1rem',
              textAlign: 'right'
            }}>
              الحسابات البنكية
            </h2>
          </div>
          
          {/* Horizontal Line */}
          <hr style={{ 
            width: '95%', 
            border: 'none', 
            borderTop: '2px solid #e0e0e0',
            margin: '0 auto 1.5rem auto'
          }} />
          
          <div style={{ width: '95%', margin: '0 auto', padding: '0 15px' }}>
            <div className="card-body bank-account-card" style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            transition: 'box-shadow 0.3s ease',
            width: '50%',
            marginRight: '0',
            marginLeft: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
          >
            <div className="bank-card-title" style={{ 
              color: '#DFD458', 
              fontWeight: '700', 
              fontSize: '24px',
              marginBottom: '1.5rem',
              textAlign: 'right'
            }}>
              مصرف الراجحي
            </div>
            
            <div>
              {bankAccounts.map((account, idx) => (
                <div 
                  key={`${account.label}-${idx}`}
                  className="d-flex justify-content-between align-items-center bank-account-row"
                  style={{
                    padding: '1.2rem 0',
                    borderBottom: idx !== bankAccounts.length - 1 ? '1px solid #e9ecef' : 'none'
                  }}
                >
                  <div className="bank-account-label" style={{ 
                    color: '#484848', 
                    fontSize: '18px',
                    fontWeight: '500',
                    textAlign: 'right',
                    minWidth: '160px'
                  }}>
                    {account.label}
                  </div>
                  <div className="bank-account-value" style={{ 
                    color: '#484848', 
                    fontSize: '18px', 
                    fontWeight: '500',
                    textAlign: 'left',
                    flex: 1,
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px',
                    paddingLeft: '0.5rem',
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                    maxWidth: '100%'
                  }}>
                    {account.value}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>

      </div>

      {/* WhatsApp Fixed Button */}
      <a
        href="https://wa.me/966YOUR_NUMBER"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg
          width="35"
          height="35"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
};

export default PaymentMethods;