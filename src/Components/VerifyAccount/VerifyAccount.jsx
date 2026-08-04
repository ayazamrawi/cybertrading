import React, { useEffect, useState } from "react";
import Style from "../../Styles/Fixedstyles.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import userApi from "../../Services/userApi";
import { useAuth } from "../../Context/AuthContext"; // ✅

export default function VerifyAccount() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { checkAuth } = useAuth(); // ✅ لازم تتوفر في AuthContext

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const goDashboardAfterRefresh = async () => {
    try {
      // ✅ أهم سطر: هات user الجديد بعد verify
      await checkAuth();
    } finally {
      navigate("/userDashboard", { replace: true });
    }
  };

  const handleVerify = async () => {
    try {
      await userApi.post("/email/verify-code", { code });
      setMessage(t("verify.success"));
      setTimeout(goDashboardAfterRefresh, 800);
    } catch (err) {
      const backendMsg = err.response?.data?.message;

      if (backendMsg === "Your Email Has already Verified") {
        setMessage(t("verify.alreadyVerified"));
        setTimeout(goDashboardAfterRefresh, 800);
      } else {
        setError(t("verify.invalidCode"));
      }
    }
  };

  const resendCode = async () => {
    await userApi.post("/email/resend-code");
    setMessage(t("verify.codeResent"));
    setSeconds(30);
    setCanResend(false);
  };

  return (
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}>{t("verify.title")}</h1>
        <p className={Style.text}>{t("verify.subtitle")}</p>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <input
          type="text"
          className={Style.input}
          placeholder={t("verify.placeholder")}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button className={Style.button} onClick={handleVerify}>
          {t("verify.verifyBtn")}
        </button>

        <button
          className={`${Style.button} ${canResend ? Style.secondaryBtn : Style.disabledBtn} mt-3`}
          onClick={resendCode}
          disabled={!canResend}
        >
          {t("verify.resendBtn")}
        </button>

        {!canResend && (
          <div className={Style.countdown}>
            {t("verify.resendIn")} <strong>{seconds}s</strong>
          </div>
        )}
      </div>
    </div>
  );
}