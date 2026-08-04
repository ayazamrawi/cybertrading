import React from "react";
import { FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Style from "./Support.module.css";

export default function Support() {
  const { t } = useTranslation();

  return (
    <div className={`${Style.wrapper} container py-5`}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <div className={Style.card}>
            <h1 className={Style.title}>
              {t("support_system.title")}
            </h1>

            <p className={Style.subtitle}>
              {t("support_system.subtitle")}
            </p>

            <div className="row g-4 mt-4">

              {/* Email Support */}
              <div className="col-md-6">
                <div className={Style.supportItem}>
                  <FaEnvelope className={Style.icon} />
                  <h5>{t("support_system.email.title")}</h5>
                  <p>{t("support_system.email.desc")}</p>
                  <a
                    href="mailto:support@cyberpips.com"
                    className={Style.link}
                  >
                    support@cyberpips.com
                  </a>
                </div>
              </div>

              {/* Telegram Support */}
              <div className="col-md-6">
                <div className={Style.supportItem}>
                  <FaTelegramPlane className={Style.icon} />
                  <h5>{t("support_system.telegram.title")}</h5>
                  <p>{t("support_system.telegram.desc")}</p>
                  <a
                    href="https://t.me/Cyberpips_Support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={Style.link}
                  >
                    @Cyberpips_Support
                  </a>
                </div>
              </div>

            </div>

            <div className={Style.footerNote}>
              {t("support_system.footer")}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
