import react from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function SubscriptionFailed(){
  const { t } = useTranslation();

  return (
    <>
      <div className={Style.wrapper}>
        <div className={Style.card}>
          <h1 className={Style.title}>
            {t("subscriptionFailed.title")}
          </h1>

          <p className={Style.text}>
            {t("subscriptionFailed.description")}
          </p>

          <Link to={'/Pricing'}>
          <button className={Style.button}>
            {t("subscriptionFailed.tryAgain")}
          </button>
          </Link>
        </div>
      </div>
    </>
  );
}
