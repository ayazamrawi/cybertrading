import React from "react";
import Style from "./Footer.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <footer className={Style.customFooter}>
        <div className={Style.footerDivider}></div>

        <div className={Style.footerNav}>
          <Link to={'/about'}>{t("footer.nav.about")}</Link>
          <Link to={'/library'}>{t("footer.nav.library")}</Link>
          <Link to={'/Disclaimer'}>{t("footer.nav.disclaimer")}</Link>
          <Link to={'/CookiesPolicy'}>{t("footer.nav.cookiesPolicy")}</Link>
          <Link to={'/PrivacyPolicy'}>{t("footer.nav.privacyPolicy")}</Link>
          <Link to={'/support'}>{t("footer.nav.support")}</Link>
          {/* <a href="">{t("footer.nav.contacts")}</a> */}
        </div>

        <div className={Style.footerDisclaimer}>
          <div className="d-flex align-items-center justify-content-center ">
            <i className={`fa-solid fa-triangle-exclamation ${Style.warningIcon}`}></i>

            <h5>{t("footer.disclaimer.title")}</h5>
          </div>

          <p>{t("footer.disclaimer.p1")}</p>

          <p>{t("footer.disclaimer.p2")}</p>

          <p>
            {t("footer.disclaimer.p3.before")}{" "}
            <strong>Cyber Pips</strong>{" "}
            {t("footer.disclaimer.p3.after")}
          </p>

          <p>
            {t("footer.disclaimer.p4.before")}{" "}
            <a
              href="https://in.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              (www.TradingView.com)
            </a>
            . {t("footer.disclaimer.p4.after")}
          </p>

          <p>
            {t("footer.disclaimer.p5.before")}{" "}
            <strong>{t("footer.disclaimer.p5.strong")}</strong>{" "}
            {t("footer.disclaimer.p5.after")}
          </p>

          <p>{t("footer.disclaimer.copyright")}</p>
        </div>
      </footer>

      <div className={`${Style.footerCyberpips} d-flex justify-content-center align-items-center gap-2`}>
        <a href="https://www.tradingview.com/u/Cyper-Pips/" target="_blank">
        <p className="pt-2 pe-1">CyberPips TradingView</p>
        </a>
        <a href={t("footer.links.telegram")} target="_blank">
          <i className="fa-brands fa-telegram"></i>
        </a>
        <a href={t("footer.links.instagram")} target="_blank">
          <i className="fa-brands fa-instagram"></i>
        </a>
         <a href={t("footer.links.facebook")} target="_blank">
          <i className="fa-brands fa-facebook"></i>
        </a>
      </div>
    </>
  );
}
