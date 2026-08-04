import { useState } from "react";
import { useSearchParams, useNavigate , useParams } from "react-router-dom";
import api from "../../Services/api";
import Style from '../../Styles/Fixedstyles.module.css';
import { useTranslation } from "react-i18next";

export default function NewPassword() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [password_confirmation, setpassword_confirmation] = useState("");
  const [error, setError] = useState(null);
  const { token } = useParams();

  const email = params.get("email");

  const handleReset = async () => {
    try {
      await api.post("/password/reset", {
        token,
        email,
        password,
        password_confirmation
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || t("newPassword.error"));
    }
  };

  return (
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}>
          {t("newPassword.title")}
        </h1>

        {error && <p className="text-danger">{error}</p>}

        <input
          type="password"
          className={Style.input}
          placeholder={t("newPassword.password")}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className={Style.input}
          placeholder={t("newPassword.confirmPassword")}
          onChange={(e) => setpassword_confirmation(e.target.value)}
        />

        <button className={Style.button} onClick={handleReset}>
          {t("newPassword.submit")}
        </button>
      </div>
    </div>
  );
}
