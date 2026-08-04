import { useState } from "react";
import api from "../../Services/api";
import Style from '../../Styles/Fixedstyles.module.css';
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const { data } = await api.post("/password/forgot", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || t("forgot.error"));
    }
  };

  return (
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}>{t("forgot.title")}</h1>

        <p className={Style.text}>
          {t("forgot.subtitle")}
        </p>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <input
          type="email"
          className={Style.input}
          placeholder={t("forgot.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={Style.button} onClick={handleSubmit}>
          {t("forgot.sendButton")}
        </button>
      </div>
    </div>
  );
}
