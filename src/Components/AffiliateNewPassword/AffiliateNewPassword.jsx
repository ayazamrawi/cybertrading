import react, {useState} from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useSearchParams, useNavigate , useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../Services/api";


export default function AffiliateNewPassword(){
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  if (!token || !email) {
  setError(t("Affilifate_resetPassword.invalidOrExpiredLink"));
  return;
}

  const handleReset = async () => {
    try {
      await api.post("/affiliate/password/reset", {
        token,
        email,
        password,
        password_confirmation: confirm,
      });

      navigate("/affiliatesLogin");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };
    return<>
    

<div className={Style.wrapper}>
  <div className={Style.card}>
    <h1 className={Style.title}>
      {t("Affilifate_resetPassword.title")}
    </h1>

    <p className={Style.text}>
      {t("Affilifate_resetPassword.subtitle")}
    </p>

    {error && <p className="text-danger">{error}</p>}

    <input
      type="password"
      className={Style.input}
      placeholder={t("Affilifate_resetPassword.newPassword")}
      onChange={(e) => setPassword(e.target.value)}
    />

    <input
      type="password"
      className={Style.input}
      placeholder={t("Affilifate_resetPassword.confirmPassword")}
      onChange={(e) => setConfirm(e.target.value)}
    />

    <button className={Style.button} onClick={handleReset}>
      {t("Affilifate_resetPassword.submit")}
    </button>
  </div>
</div>

    </>
}