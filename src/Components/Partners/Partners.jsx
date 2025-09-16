import React from 'react';
// Import all partner images
import alsahha from '../../assets/images/alsahha.png';
import dammam from '../../assets/images/dammam.png';
import ghaym from '../../assets/images/ghaym.png';
import wecare from '../../assets/images/wecare.png';
import ghayatcom from '../../assets/images/ghayatcom (1).png';
import ahaleena from '../../assets/images/ahaleena (1).png';
import anfas from '../../assets/images/anfas.jpeg';
import ozone from '../../assets/images/ozone.png';
import bright from '../../assets/images/bright.png';
import caremark from '../../assets/images/caremark.jpeg';
import hayatClinics from '../../assets/images/hayatClinics.png';
import deryaq from '../../assets/images/deryaq.png';
import dpmc from '../../assets/images/dpmc.jpeg';
import ruhaimi from '../../assets/images/ruhaimi.jpeg';
import baseem from '../../assets/images/baseem.png';
import somu from '../../assets/images/somu.png';
import bella from '../../assets/images/bella.png';
import faraby from '../../assets/images/faraby.png';
import fmg from '../../assets/images/fmg.jpeg';
import alhesn from '../../assets/images/alhesn.jpeg';
import adwaa from '../../assets/images/adwaa.jpg';
import smiles from '../../assets/images/smiles.jpg';
import badri from '../../assets/images/badri.png';
import pearl from '../../assets/images/pearl.png';

export default function Partners() {
  const partners = [
    { name: 'الصحة والسلامة الطبي', logo: alsahha },
    { name: 'الدمام الأهلي', logo: dammam },
    { name: 'مجمع غيم الطبي', logo: ghaym },
    { name: 'مستشفى وي كير', logo: wecare },
    { name: 'عيادات غايتكم', logo: ghayatcom },
    { name: 'عيادات أهالينا', logo: ahaleena },
    { name: 'عيادات أنفاس', logo: anfas },
    { name: 'عيادات أوزون', logo: ozone },
    { name: 'عيادات برايت', logo: bright },
    { name: 'رعاية منزلية كيرمارك', logo: caremark },
    { name: 'عيادات الحياة', logo: hayatClinics },
    { name: 'مجمع رعاية درياق الطبي', logo: deryaq },
    { name: 'مجمع د.خالد الرحيمي الطبي', logo: ruhaimi },
    { name: 'عيادات بسم', logo: baseem },
    { name: 'مجمع سمو الطبي', logo: somu },
    { name: 'مركز بيلا للعلاج الطبيعي', logo: bella },
    { name: 'مجموعة الفارابي الطبية', logo: faraby },
    { name: 'مجموعة فجر الدمام الطبية', logo: fmg },
    { name: 'الحصن المنيع', logo: alhesn },
    { name: 'أضواء الحكمة', logo: adwaa },
    { name: 'بسمات سمايلز', logo: smiles },
    { name: 'مجمع عيادات البدري الطبي', logo: badri },
    { name: 'عيادات اللؤلؤ', logo: pearl }
  ];

  return (
    <section className="partners-section py-5">
      <div className="container">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">شركاؤنا</span>
        </div>
        
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-card">
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="img-fluid"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
