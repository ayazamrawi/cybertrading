import React from "react";
import Style from "./Community.module.css";
import { FaTelegram } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Community() {
  const { t } = useTranslation();

  return (
    <div className={Style.pageWrapper}>
      <div className={Style.card}>
        <FaTelegram className={Style.discordIcon} />

        <h2 className={Style.titleSmall}>{t("community.title")}</h2>

        <p className={Style.subtitle}>
          {t("community.subtitle")}
        </p>

        <a
          href={t("community.link")}
          target="_blank"
          className={Style.primaryBtn}
        >
          {t("community.button")}
        </a>
      </div>
    </div>
  );
}
