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
    <section className="stats-section py-5 ">
      <div className="container-fluid">
        <div className="row g-2 g-md-3 g-lg-4 justify-content-center">
          {statsData.map((stat, index) => (
            <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
              <div className="text-center d-flex flex-column align-items-center h-100 p-2">
                <div className="mb-2 mb-md-3 mb-lg-4">
                  <FontAwesomeIcon 
                    icon={stat.icon} 
                    className="stats-icon"
                    style={{ color: 'var(--color-main)' }}
                  />
                </div>
                <div className="mb-1 mb-md-2">
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    separator="," 
                    className="fw-bold text-muted stats-number"
                  />
                  <span className="fw-bold stats-suffix" style={{color: 'var(--color-main)'}}>
                    {stat.suffix}
                  </span>
                </div>
                <p className="mb-0 fw-semibold stats-text" style={{color: 'var(--color-main)'}}>
                  {stat.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
