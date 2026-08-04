import react from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SubscriptionSuccess(){
const { t } = useTranslation();

return (
  <>
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}>
          {t("subscriptionSuccess.title")}
        </h1>

        <p className={Style.text}>
          {t("subscriptionSuccess.description")}
        </p>

        <Link to={'/tradingviewusername'}>
          <button className={Style.button}>
            {t("subscriptionSuccess.addTvUsername")}
          </button>
        </Link>
      </div>
    </div>
  </>
);
}
