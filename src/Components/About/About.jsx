import React from 'react';
import { useTranslation } from 'react-i18next';
import Style from './About.module.css';
import trophyImage from '../../Assets/Images/trophy.png';
import { Trans } from 'react-i18next';
export default function About() {
  const { t } = useTranslation();
  const stats = t('about.stats.items', { returnObjects: true });

  return (
    <>
      <div className={Style.about}>
        <main className={Style.main}>
          <div className={Style.mainHead}>
            <div className={`${Style.layer} d-flex align-items-center `}>
              <div className={`${Style.headContent} ps-5 container`}>
                <h1 className={`h6 ${Style.heading}`}>{t('about.hero.title')}</h1>
                <br />
                <h2>
                <Trans i18nKey="about.hero.subtitle">
                    The complete trading <br />
                    workspace with <br />
                    <span> 
                    automated <br /> 
                    technical trading
                    </span>
                </Trans>
                </h2>
              </div>
            </div>
          </div>
        </main>

        {/* Company */}
        <section>
          <div className={`container ${Style.company}`}>
            <div className="row">
              <div className="col-md-6">
                <h3>{t('about.company.title')}</h3>
              </div>
              <div className="col-md-6">
                <p>{t('about.company.text')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        {/* <section>
          <div className={`container ${Style.statsContainer}`}>
            {stats.map((item, index) => (
              <div key={index} className={Style.statCard}>
                <h2>{item.value}</h2>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Innovation */}
        <section>
          <div className={`container ${Style.innovation} text-center flex-column`}>
            <h2>{t('about.innovation.title')}</h2>
            <p className="w-75 m-auto">
              {t('about.innovation.text')}
            </p>
          </div>
        </section>

        {/* Vision / Achievement */}
        <section>
          <div className={`container ${Style.achievements}`}>
            <div className="row">
              <div className="col-md-8">
                <h2>{t('about.vision.title')}</h2>
                <p>{t('about.vision.text')}</p>
              </div>
              <div className={`col-md-4 d-flex ${Style.trophy}`}>
                <img src={trophyImage} width="70%" alt="Trophy" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="container pt-5 pb-5">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className={`${Style.contentBtn} ${Style.card}`}>
                  <h3>{t('about.cta.title')}</h3>
                  <p>{t('about.cta.subtitle')}</p>
                  <div className="d-flex justify-content-start mt-4 pb-4">
                    <button type="button" className="mt-4">
                      {t('about.cta.primary')} <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className={`${Style.contentBtn} ${Style.card}`}>
                  <h3>{t('about.cta.secondary')}</h3>
                  <p>{t('about.cta.subtitle')}</p>
                  <div className="d-flex justify-content-start mt-4 pb-4">
                    <button type="button" className="mt-4">
                      {t('about.cta.secondary')} <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
