import react, { useState } from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import userApi from "../../Services/userApi";

export default function UnverifiedUsers(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  async function sendVerification() {
    try {
      setLoading(true);
      setStatus({ type: '', message: '' });

      const { data } = await userApi.post("/email/send-verification-code");

      setStatus({
        type: 'success',
        message: data.message || t("unverified.success")
      });

      setTimeout(() => {
        navigate("/verifyAccount");
      }, 2000);

    } catch (err) {
      setStatus({
        type: 'danger',
        message: err.response?.data?.message || t("unverified.error")
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
            {t("unverified.title")}
          </h1>

          <p className={Style.text}>
            {t("unverified.description")}
          </p>

          <button
            className={Style.button}
            onClick={sendVerification}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin me-2"></i>
                {t("unverified.sending")}
              </span>
            ) : (
              t("unverified.send")
            )}
          </button>
        </div>
      </div>
    </>
  );
}
