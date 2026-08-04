import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Style from "./PaymentSuccess.module.css";
import userApi from "../../Services/userApi";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [hasTradingViewUsername, setHasTradingViewUsername] = useState(false);
  

  useEffect(() => {
    const run = async () => {
      try {
        if (sessionId) {
          console.log("Payment successful! Session ID:", sessionId);
        }

        // ✅ جيبي بيانات اليوزر عشان نعرف عنده username ولا لأ
        const res = await userApi.get("/user");
        const username = res?.data?.user?.username;

        setHasTradingViewUsername(!!username);
      } catch (e) {
        console.error("Failed to fetch user after payment:", e);
        // لو حصل مشكلة في الجلب، نخليها تروح للداشبورد كـ fallback
        setHasTradingViewUsername(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [sessionId]);

  const handleNext = () => {
    if (hasTradingViewUsername) {
      navigate("/userDashboard");
    } else {
      navigate("/tradingviewusername");
    }
  };

  return (
    <div className={Style.container}>
      <div className={Style.card}>
        <div className={Style.iconWrapper}>
          <svg
            className={Style.successIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M8 12.5L10.5 15L16 9.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className={Style.title}>{t("paymentSuccess.title")}</h1>

        <p className={Style.message}>{t("paymentSuccess.message")}</p>

        <p className={Style.subMessage}>
          {hasTradingViewUsername
            ? t("paymentSuccess.subMessageDashboard")
            : t("paymentSuccess.subMessageTradingView")}
        </p>

        <button className={Style.button} onClick={handleNext} disabled={loading}>
          {loading
            ? t("paymentSuccess.loading")
            : hasTradingViewUsername
              ? t("paymentSuccess.goDashboard")
              : t("paymentSuccess.goTradingView")}
        </button>
      </div>
    </div>
  );
}
