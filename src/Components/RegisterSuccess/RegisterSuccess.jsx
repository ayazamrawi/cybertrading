import react, { useState } from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import userApi from "../../Services/userApi";

export default function RegisterSuccess(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  async function sendVerification() {
    try {
      setLoading(true);
      setStatus({ type: '', message: '' });

      const { data } = await userApi.post("/email/send-verification-code");

      setStatus({
        type: 'success',
        message: data.message || "Verification code sent to your email!"
      });
      setMessage( data.message ||  "Verification code sent to your email!");

      setTimeout(() => {
        navigate("/verifyAccount");
      }, 2000);

    } catch (err) {
      setStatus({
        type: 'danger',
        message: err.response?.data?.message || "Failed to send code. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={Style.wrapper}>
        <div className={Style.card}>
          <h1 className={Style.title}>
            {t("registerSuccess.title")}
          </h1>

          <p className={Style.text}>
            {t("registerSuccess.description")}
          </p>

          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}

          <button
            className={Style.button}
            onClick={sendVerification}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin me-2"></i>
                {t("registerSuccess.sending")}
              </span>
            ) : (
              t("registerSuccess.send")
            )}
          </button>
        </div>
      </div>
    </>
  );
}
