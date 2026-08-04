import React from "react";
import Style from "./Docs.module.css";
import { useTranslation } from "react-i18next";
import EarthScene from "../EarthScene/EarthScene";

export default function Docs() {
  const { t } = useTranslation();

  return (
    <>
      <main>
        <div className={`${Style.mainHead} d-flex align-items-center`}>
          <div className="container">
            <div className={`${Style.headContent} ps-5 pb-5`}>
              <h1 className={`h6 ${Style.heading}`}>
                {t("docs.getStarted.title")}
              </h1>
              <br />
              <h2>
                <span>{t("docs.getStarted.intro")}</span>
              </h2>
            </div>
          </div>
        </div>
      </main>

      <section className={`${Style.docsCyber} pt-5`}>
        <div className="container">
          <div className="row d-flex gap-5 flex-column">

            {/* What is CyberPips */}
            <div className="col-lg-8 col-12 m-auto">
              <h2>{t("docs.getStarted.whatIsTitle")}</h2>
              <br />
              <p>{t("docs.getStarted.whatIsText")}</p>
            </div>

            <EarthScene/>
            {/* How it works */}
            <div className="col-lg-8 col-12 m-auto pt-5">
              <h2>{t("docs.getStarted.howItWorksTitle")}</h2>
              <br />
              <p>{t("docs.getStarted.howItWorksText")}</p>
            </div>

            {/* Requirements */}
            <div className="col-lg-8 col-12 m-auto pt-5">
              <h2>{t("docs.getStarted.requirementsTitle")}</h2>
              <br />
              <ul>
                {t("docs.getStarted.requirementsList", {
                  returnObjects: true,
                }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            

            {/* Notice */}
            <div className="col-lg-8 col-12 m-auto pt-5">
              <h2>{t("docs.getStarted.noticeTitle")}</h2>
              <br />
              <p>{t("docs.getStarted.noticeText")}</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
