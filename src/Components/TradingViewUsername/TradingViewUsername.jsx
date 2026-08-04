import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../Services/userApi";
import Style from "../../Styles/Fixedstyles.module.css";
import tradStyle from "./TradingViewUsername.module.css";
import { useTranslation } from "react-i18next";

export default function TradingViewUsername() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username) {
      setError(t("tradingView.errors.required"));
      return;
    }

    try {
      await userApi.post("/tv-username/add", {
        username
      });

      navigate("/userDashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("tradingView.errors.generic"));
    }
  };

  return (
    <div className={Style.wrapper}>
      <div className={`${Style.card} ${tradStyle.card}`}>
        <h1 className={`${Style.title} ${tradStyle.card}`}>
          {t("tradingView.title")}
        </h1>

        <p className={Style.text}>
          {t("tradingView.description")}
        </p>

        {error && <p className="text-danger">{error}</p>}

        <div className={`${tradStyle.input} mb-3`}>
          <input
            type="text"
            className={`${Style.input} ps-2`}
            placeholder={t("tradingView.placeholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button className={Style.button} onClick={handleSubmit}>
          {t("tradingView.save")}
        </button>
      </div>
    </div>
  );
}
