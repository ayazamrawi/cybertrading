import React from 'react';
import { useNavigate } from 'react-router-dom';
import Style from './PaymentCancel.module.css';
import { useTranslation } from "react-i18next";

export default function PaymentCancel() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={Style.container}>
      <div className={Style.card}>
        <div className={Style.iconWrapper}>
          <svg className={Style.cancelIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className={Style.title}>
         {t("paymentCancel.title")}
        </h1>

        <p className={Style.message}>
         {t("paymentCancel.message")}
        </p>

        <p className={Style.subMessage}>
         {t("paymentCancel.subMessage")}
        </p>

        <div className={Style.buttonGroup}>
          <button
            className={Style.primaryButton}
            onClick={() => navigate('/Pricing')}
          >
            {t("paymentCancel.viewPlans")}
          </button>

          <button
            className={Style.secondaryButton}
            onClick={() => navigate('/userDashboard')}
          >
            {t("paymentCancel.dashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}
