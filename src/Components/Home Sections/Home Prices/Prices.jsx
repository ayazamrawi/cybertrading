import React, { useState, useEffect } from "react";
import Style from './Prices.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api from "../../../Services/api";


export default function Prices(){
    const { t } = useTranslation();
    const [monthlyPlan, setMonthlyPlan] = useState(null);
    const [yearlyPlan, setYearlyPlan] = useState(null);
    


    useEffect(() => {
    api.get("/plans/prices")
        .then(response => {
            const plans = response.data;
            
            // غيّر من duration لـ interval
            const firstMonthly = plans.find(p => p.plan_name === 'pro' && p.is_active === 1);
            const firstYearly = plans.find(p => p.plan_name === 'pro_max' && p.is_active === 1);
            
            console.log("📅 Monthly plan:", firstMonthly);
            console.log("📅 Yearly plan:", firstYearly);
            
            setMonthlyPlan(firstMonthly);
            setYearlyPlan(firstYearly);
        })
        .catch(error => console.error('Error:', error));
    
}, []);
    
    return(
        <>
        <section className={`${Style.plans} pb-5`}>
                        <div className="container mt-5">
                            <div className={`${Style.plansHeading} text-center`}>
                                <h2 className="pb-5">{t("prices.heading.title")}</h2>
                                <p> 
                                    {t("prices.heading.subtitle1")}
                                    <br/>
                                    {t("prices.heading.subtitle2")}
                                </p>
                            </div>
                            <div className="row container m-auto row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4 justify-content-center">
                               
        
                                {/* Premium Plan */}
                                <div className="col">
                                    <div className={`${Style.plan} p-1`}>
                                        <div className={`${Style.basicOffer} ${Style.premium} pt-4`}>
                                            <h3>{monthlyPlan?.plan_name === 'pro' ?t("pricing.plans.premium.title"):t("pricing.plans.enterprise.title")}</h3>
                                            <p>{t("pricing.plans.premium.badge")}</p>
                                        </div> 
                                        {monthlyPlan?.onSale == 1 && monthlyPlan?.percentage?(
                  <div className={Style.saleBadge}>
                    <i className="fa-solid fa-tag"></i>
                    <span>{monthlyPlan.percentage}%</span>
                  </div>
                ):''}
                                        <h4 className="h1 text-center">
 <span className="h5 pe-1">
    {monthlyPlan?.currency === "eur"
      ? "€"
      : monthlyPlan?.currency === "usd"
      ? "$"
      : monthlyPlan?.currency || "$"}
  </span>

  {monthlyPlan?.onSale == 1 ? (
    <>
      <span className={Style.oldPrice}>
        {monthlyPlan?.amount_before_sale}
      </span>
      <span className={Style.salePrice}>
        {monthlyPlan?.amount}
      </span>
    </>
  ) : (
    <span>{monthlyPlan?.amount || 5}</span>
  )}
</h4>

                                        <div className="ps-3">
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.indicators")}</span>
                                            </p>
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.advancedScreeners")}</span>
                                            </p>
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.unlimitedBacktests")}</span>
                                            </p>
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.prioritySupport")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.aiAssistant")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.customStrategies")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.apiAccess")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.whiteLabel")}</span>
                                            </p>
                                        </div>
                                        <Link to={'/Pricing'}>
                                        <button type="button" className={Style.orderPayment}>{t("pricing.actions.orderNow")}</button>
                                        </Link>
                                    </div>
                                </div>
        
                                {/* Enterprise Plan */}
                                <div className="col">
                                    <div className={`${Style.plan} p-1`}>
                                        <div className={Style.popularBadge}> {t("prices.plans.popular")}</div>
                                        <div className={`${Style.basicOffer} ${Style.enterprise} pt-4`}>
                                            <h3>{yearlyPlan?.plan_name === 'pro_max' ?t("pricing.plans.enterprise.title"):t("pricing.plans.premium.title")}</h3>
                                            <p>{t("pricing.plans.enterprise.badge")}</p>
                                        </div>
                                            {yearlyPlan?.onSale == 1 && yearlyPlan?.percentage?(
                                      <div className={Style.saleBadge}>
                                      <i className="fa-solid fa-tag"></i>
                                      <span>{yearlyPlan.percentage}%</span>
                                      </div>
                                      ):''}
                                        <h4 className="h1"><span className="h5 pe-1">
    {yearlyPlan?.currency === "eur"
      ? "€"
      : yearlyPlan?.currency === "usd"
      ? "$"
      : yearlyPlan?.currency || "$"}
  </span>{yearlyPlan?.amount || 10}</h4>
                                        <div className="ps-3">
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.indicators500")}</span>
                                            </p>
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.customScreeners")}</span>
                                            </p>
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.unlimitedEverything")}</span>
                                            </p>
                                            <p>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.phoneSupport")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.aiAssistantPro")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.unlimitedStrategies")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.fullApiAccess")}</span>
                                            </p>
                                            <p className={Style.notacceptedOffer}>
                                                <span className={Style.accepted}>◉</span>
                                                <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.whiteLabelOptions")}</span>
                                            </p>
                                        </div>
                                        <Link to={'/Pricing'}>
                                        <button type="button" className={Style.orderPayment}>{t("pricing.actions.orderNow")}</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
        </>
    )
}