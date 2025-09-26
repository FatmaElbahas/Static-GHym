import React from 'react';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faUserMd, faHospital, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

export default function Stats() {
  const statsData = [
    {
      icon: faStar,
      number: 5000,
      text: "تقييم حقيقي",
      suffix: " +"
    },
    {
      icon: faUsers,
      number: 30000,
      text: "مستخدم راضي",
      suffix: " +"
    },
    {
      icon: faUserMd,
      number: 500,
      text: "الأطباء",
      suffix: " +"
    },
    {
      icon: faHospital,
      number: 70,
      text: "المراكز",
      suffix: " +"
    },
    {
      icon: faCalendarCheck,
      number: 100000,
      text: "حجز ناجح",
      suffix: " +"
    }
  ];

  return (
    <section className="stats-section py-5" style={{ 
      marginTop: '-48px',
      backgroundColor: '#1e40af',
      borderRadius: '0px'
    }}>
      <div className="container-fluid">
        <div className="row g-4 justify-content-center">
          {statsData.map((stat, index) => (
            <div key={index} className="col-6 col-sm-6 col-md-3 col-lg-2 col-xl-2">
              <div className="text-center d-flex flex-column align-items-center h-100 p-3">
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <FontAwesomeIcon 
                    icon={stat.icon} 
                    style={{ color: 'var(--color-main)', fontSize: '2rem' }}
                  />
                </div>
                <div className="mb-2">
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    separator="," 
                    className="fw-bold stats-number"
                    style={{ color: '#ffffff', fontSize: '2.5rem' }}
                  />
                  <span className="fw-bold stats-suffix" style={{color: '#ffffff', fontSize: '2.5rem'}}>
                    {stat.suffix}
                  </span>
                </div>
                <p className="mb-0 fw-semibold stats-text" style={{color: '#ffffff', fontSize: '1.1rem'}}>
                  {stat.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 992px) {
          .stats-section { 
            margin-top: '-72px !important';
          }
        }
        @media (max-width: 767px) {
          .stats-section { 
            margin-top: '-48px !important';
          }
        }
      `}</style>
    </section>
  );
}
