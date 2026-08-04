import React from "react";
import { useTranslation } from "react-i18next";
import Style from "../../Styles/LegalPages.module.css";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className={Style.container}>
      <div className={Style.card}>
        <h1 className={Style.title}>{t("privacy.title")}</h1>

        <p className={Style.text}>{t("privacy.intro")}</p>

        <h3 className={Style.subtitle}>{t("privacy.collect.title")}</h3>
        <ul className={Style.list}>
          <li>{t("privacy.collect.one")}</li>
          <li>{t("privacy.collect.two")}</li>
          <li>{t("privacy.collect.three")}</li>
        </ul>

        <h3 className={Style.subtitle}>{t("privacy.use.title")}</h3>
        <p className={Style.text}>{t("privacy.use.text")}</p>

        <h3 className={Style.subtitle}>{t("privacy.security.title")}</h3>
        <p className={Style.text}>{t("privacy.security.text")}</p>

        <h3 className={Style.subtitle}>{t("privacy.rights.title")}</h3>
        <p className={Style.text}>{t("privacy.rights.text")}</p>

        <p className={Style.footer}>{t("privacy.updated")}</p>
      </div>
    </div>
  );
}
