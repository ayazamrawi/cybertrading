import React from "react";
import { useTranslation } from "react-i18next";
import Style from "../../Styles/LegalPages.module.css";

export default function CookiesPolicy() {
  const { t } = useTranslation();

  return (
    <div className={Style.container}>
      <div className={Style.card}>
        <h1 className={Style.title}>{t("cookies.title")}</h1>
        <p className={Style.text}>{t("cookies.intro")}</p>

        <h3 className={Style.subtitle}>{t("cookies.what.title")}</h3>
        <p className={Style.text}>{t("cookies.what.text")}</p>

        <h3 className={Style.subtitle}>{t("cookies.why.title")}</h3>
        <ul className={Style.list}>
          <li>{t("cookies.why.one")}</li>
          <li>{t("cookies.why.two")}</li>
          <li>{t("cookies.why.three")}</li>
        </ul>

        <h3 className={Style.subtitle}>{t("cookies.control.title")}</h3>
        <p className={Style.text}>{t("cookies.control.text")}</p>

        <p className={Style.text}>{t("cookies.updated")}</p>
      </div>
    </div>
  );
}
