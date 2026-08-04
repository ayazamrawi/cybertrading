import React, { useEffect, useState } from 'react';
import Style from './Affiliates.module.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../Services/api';


export default function Affiliates() {
  const { t } = useTranslation();
   const [commission, setCommission] = useState("");
     useEffect(() => {
  api.get('/admin/settings')
    .then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCommission(res.data[0].value); // ✅ correct
      }
    })
    .catch(err => console.error(err));
}, []);
  return (
    <>
      {/* HERO */}
      <main>
        <div className={Style.mainHead}>
          <div className={`${Style.layer} d-flex justify-content-center align-items-center`}>
            <div className={`${Style.headContent} ${Style.contentBtn} text-center container`}>
              <h1 className={`h6 ${Style.heading}`}>{t('affiliates.title')}</h1>

              <h2>
                

                {t('affiliates.hero.title')}
                
              </h2>

              <h3 className="container pt-3">
                {t('affiliates.hero.subtitle')}
              </h3>
              <Link to={'/affiliatesApply'}>

              <button type="button" className="gap-2 mt-4">
                {t('affiliates.cta.primary')}
              </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* STEPS */}
      <section className={Style.rightLayer}>
        <div className={Style.startedAffiliate}>
          <div className="pt-5 pb-5">
            <div className="container">
              <div className="row">
                <div className={`col-12 col-md-6 ${Style.contentBtn}`}>
                  <h2>{t('affiliates.steps.title')}</h2>
                  <Link to={'/affiliatesApply'}>

                  <button type="button" className="flex justify-center items-center gap-2 mt-4">
                    {t('affiliates.cta.primary')}
                  </button>
                  </Link>
                </div>

                <div className="col-md-6">
                  <div className="row gy-3">
                    {t('affiliates.steps.items', { returnObjects: true }).map((step, index) => (
                      <div className="col-md-12" key={index}>
                        <div className={`row ${Style.cardAffiliate} d-flex justify-content-center align-items-center`}>
                          <div className="col-md-3 d-flex justify-content-center align-items-center">
                            <i className={`fa-solid fa-${index + 1}`}></i>
                          </div>
                          <div className={`col-md-9 ${Style.cardTextAffiliate}`}>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* BENEFITS */}
          <div className={Style.programBenefits}>
            <div>
              <h2>{t('affiliates.benefits.title')}</h2>

              <div className="container">
                <div className="row">
                  {t('affiliates.benefits.items', { returnObjects: true }).map((benefit, index) => (
                    <div className="col-12 col-md-4 mb-4" key={index}>
                      <div className={Style.card}>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.text} {commission}%</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`${Style.contentBtn} d-flex justify-content-center mt-4 pb-4`}>
                  <Link to={'/affiliatesApply'}>

                  <button type="button" className="flex justify-center items-center gap-2 mt-4">
                    {t('affiliates.cta.primary')}
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* EXPLORE */}
          <div className={Style.explore}>
            <div className="container">
              <div className="row g-4 pt-5 pb-5">

                <div className="col-12 col-md-6">
                  <div className={`${Style.contentBtn} ${Style.card}`}>
                    <h3>{t('about.cta.primary')}</h3>
                    <p>{t('about.cta.subtitle')}</p>

                    <div className={`${Style.contentBtn} d-flex justify-content-start mt-4 pb-4`}>
                      <Link to={'/blog'}>

                      <button type="button" className="mt-4">
                        {t('about.cta.primary')} <i className="fa-solid fa-arrow-right"></i>
                      </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col col-md-6">
                  <div className={`${Style.contentBtn} ${Style.card}`}>
                    <h3>{t('about.cta.secondary')}</h3>
                    <p>{t('about.cta.subtitle')}</p>

                    <div className={`${Style.contentBtn} d-flex justify-content-start mt-4 pb-4`}>
                      <Link to={'/Pricing'}>
                      <button type="button" className="mt-4">
                        {t('about.cta.secondary')} <i className="fa-solid fa-arrow-right"></i>
                      </button>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
