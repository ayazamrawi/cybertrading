import react, { useEffect, useState } from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useNavigate } from "react-router-dom";
import affiliateApi from "../../Services/affiliateApi";
import { useTranslation } from "react-i18next";


export default function AffiliateVerifyAccount(){
  const { t } = useTranslation();
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [seconds, setSeconds] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
  // Countdown effect
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleVerify = async () => {
    try {
      const { data } = await affiliateApi.post("affiliate/verify-code", { code });
      setMessage(data.message);
      setTimeout(() => {
                navigate("/affiliateDashboard"); 
            }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
      if(err.response?.data?.message == 'Your Email Has already Verified'){
         setTimeout(() => {
                navigate("/affiliateDashboard"); 
            }, 2000);
      }
    }
  };

  const resendCode = async () => {
    await affiliateApi.post("affiliate/resend-code");
    setMessage("Code resent");
  };
    return<>
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}>{t("affiliate.verify.title")}</h1>
        <p className={Style.text}>{t("affiliate.verify.subtitle")}</p>

        {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

        <input
  type="text"
  className={Style.input}
  placeholder={t("affiliate.verify.codePlaceholder")}
  value={code}
  onChange={(e) => setCode(e.target.value)}
/>

        <button className={Style.button} onClick={handleVerify}>
  {t("affiliate.verify.verifyBtn")}
</button>

        <button
  className={`${Style.button} ${
    canResend ? Style.secondaryBtn : Style.disabledBtn
  } mt-3`}
  onClick={resendCode}
  disabled={!canResend}
>
  {t("affiliate.verify.resendBtn")}
</button>

       {!canResend && (
  <div className={Style.countdown}>
    {t("affiliate.verify.countdown", { seconds })}
  </div>
)}
      </div>
    </div>
    </>
}