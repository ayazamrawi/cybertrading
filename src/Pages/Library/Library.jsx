import indicators from "../../Data/indicators";
import IndicatorCard from "../../Components/IndicatorCard/IndicatorCard";
import Style from "./Library.module.css";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function Library() {
  const { t } = useTranslation();
 console.log(indicators);
 
  console.log("Indicators:", indicators);
console.log("First indicator ID:", indicators[0]?.id);
  return (
      <div className={`${Style.container} container`}>
      <h1 className={Style.title}>{t("indicators.title")}</h1>
      <p className={Style.subtitle}>{t("indicators.subtitle")}</p>

       <div className={Style.grid}>
        {indicators.map(ind => (
          <IndicatorCard key={ind.id} indicator={ind} />
        ))}
      </div>
        <Outlet /> {/* هنا سيظهر IndicatorDetails */}
    </div>
  );
}