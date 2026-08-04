import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Style from "./IndicatorCard.module.css";

export default function IndicatorCard({ indicator }) {
  const { t } = useTranslation();

  
  return (
    <div  className={Style.card}
  onClick={() => console.log("🟢 CARD CLICKED!")}>
      {indicator.image && (
        <img
          src={indicator.image}
          alt={t(indicator.titleKey)}
        />
      )}
      
      <h4>{t(indicator.titleKey)}</h4>
      <p>{t(indicator.subtitle)}</p>
      
      {/* تأكد من الأقواس المعقوفة {} مش backticks */}
      <Link
        to={`/library/${indicator.id}`}
        className={Style.detailsBtn}
        onClick={(e) => {
          console.log("🔴🔴🔴 A TAG CLICKED!", indicator.id);
        }}
      >
        {t("indicators.button")}
      </Link>
    </div>
  );
}