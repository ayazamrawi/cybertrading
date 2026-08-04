import React, { useState } from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useTranslation } from "react-i18next";
import api from "../../Services/api";

export default function AffiliateForgetPassword(){
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const { data } = await api.post(
        "/affiliate/password/forgot",
        { email }
      );
      setMessage(data.message || t("affiliateForgetPassword.success"));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t("affiliateForgetPassword.error")
      );
    }
  };

  return (
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}>
          {t("affiliateForgetPassword.title")}
        </h1>

        <p className={Style.text}>
          {t("affiliateForgetPassword.subtitle")}
        </p>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <input
          type="email"
          className={Style.input}
          placeholder={t("affiliateForgetPassword.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={Style.button} onClick={handleSubmit}>
          {t("affiliateForgetPassword.submit")}
        </button>
      </div>
    </div>
  );
}
