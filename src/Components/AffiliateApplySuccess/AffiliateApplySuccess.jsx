import react, { useState } from "react";
import Style from '../../Styles/Fixedstyles.module.css';
import { useNavigate } from "react-router-dom";
import affiliateApi from "../../Services/affiliateApi";
import { useTranslation } from "react-i18next";


export default function AffiliateApplySuccess(){
   const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    async function sendVerification() {
        try {
            setLoading(true);
            setStatus({ type: '', message: '' });

            // Call the endpoint
            const { data } = await affiliateApi.post("affiliate/send-code");

            setStatus({ 
                type: 'success', 
                message: data.message || "Verification code sent to your email!" 
            });
            setMessage( data.message ||  t("affiliateApplySuccess.successMessage"));
            
            setTimeout(() => {
                navigate("/affiliateVerifyAccount"); 
            }, 2000);
            
        } catch (err) {
            setStatus({ 
                type: 'danger', 
                message: err.response?.data?.message || "Failed to send code. Please try again." 
            });
            setError(err.response?.data?.message || t("affiliateApplySuccess.errorMessage") )
        } finally {
            setLoading(false);
        }
    }
    return<>
    <div className={Style.wrapper}>
      <div className={Style.card}>
        <h1 className={Style.title}> {t("affiliateApplySuccess.title")}</h1>
        <p className={Style.text}>
          {t("affiliateApplySuccess.subtitle")}
        </p>
        {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}


         <button 
                    className={Style.button} 
                    onClick={sendVerification}
                    disabled={loading}
                >
                    {loading
            ? t("affiliateApplySuccess.sending")
            : t("affiliateApplySuccess.sendButton")
          }
                </button>
      </div>
    </div>
    </>
}