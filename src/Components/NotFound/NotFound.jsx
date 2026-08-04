import react from "react";
import Style from './NotFound.module.css';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NatFound(){
  const { t } = useTranslation();

  return (
    <>
      <div className={Style.pageWrapper}>
        <div className={Style.card}>
          <h1 className={Style.title}>404</h1>

          <p className={Style.subtitle}>
            {t("notFound.subtitle")}
          </p>

          <Link to={'/'} className={Style.primaryBtn}>
            {t("notFound.goHome")}
          </Link>
        </div>
      </div>
    </>
  );
}
