import React from "react";
import { useTranslation } from "react-i18next";
import Style from "../../Styles/LegalPages.module.css";

export default function Disclaimer() {
  const { t } = useTranslation();

  return (
    <div className={Style.container}>
      <div className={Style.card}>
        <h1 className={Style.title}>{t("disclaimer.title")}</h1>

        <p className={Style.text}>{t("disclaimer.intro")}</p>

        <h3 className={Style.subtitle}>{t("disclaimer.noAdvice.title")}</h3>
        <p className={Style.text}>{t("disclaimer.noAdvice.text")}</p>

        <h3 className={Style.subtitle}>{t("disclaimer.risk.title")}</h3>
        <p className={Style.text}>{t("disclaimer.risk.text")}</p>

        <h3 className={Style.subtitle}>{t("disclaimer.responsibility.title")}</h3>
        <p className={Style.text}>{t("disclaimer.responsibility.text")}</p>

        <p className={Style.footer}>{t("disclaimer.updated")}</p>
      </div>
    </div>
  );
}
