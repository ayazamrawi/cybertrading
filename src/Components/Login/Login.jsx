import React, { useState } from 'react';
import Style from './Login.module.css';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom";
import google from '../../Assets/Images/google.svg';
import api from '../../Services/api';
import { useAuth } from '../../Context/AuthContext';
import { useTranslation } from "react-i18next";

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { loginUser, loginAdmin } = useAuth();

    const handleGoogleLogin = async () => {
        const { data } = await api.get("/auth/google/redirect");
        window.location.href = data.url;
    };

    async function handleLogin(values) {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.post("/login", values);

            if (data.user.role == 'user') {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setLoading(false);

                if (data.user.email_verified_at == null) {
                    navigate("/UnverifiedUsers");
                    return;
                }

                loginUser(data.user, data.access_token);
                navigate("/userDashboard");
            }

            if (data.user.role == 'admin') {
                localStorage.setItem("adminToken", data.access_token);
                loginAdmin(data.user, data.access_token);
                navigate('/adminDashboard');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || t("login.errors.invalidCredentials"));
        }
    }

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t("login.errors.invalidEmail"))
            .required(t("login.errors.emailRequired")),
        password: Yup.string()
            .required(t("login.errors.passwordRequired")),
    });

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: handleLogin
    });

    return (
        <div className={Style.containerMax}>
            <section className={`${Style.pageCard} ${Style.animScale}`} id="login" aria-label="Login">
                <div className={Style.affiliateBox}>
  <div className={Style.affiliateText}>
    <strong>{t("login.affiliate.title")}</strong>
    <span>{t("login.affiliate.subtitle")}</span>
  </div>

  <Link to="/affiliatesLogin" className={Style.affiliateBtn}>
    <i className="fa-solid fa-handshake me-2"></i>
    {t("login.affiliate.action")}
  </Link>
</div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className={Style.pageTitle}>{t("login.title")}</h3>
                    <div className={Style.muted}>
                        {t("login.newUser")}{" "}
                        <Link to="/register" style={{ color: 'var(--hover-color)' }}>
                            {t("login.createAccount")}
                        </Link>
                    </div>
                </div>

                {error && <div className="alert alert-danger p-2">{error}</div>}

                <div className="row">
                    <div className="col-md-10 col-lg-8">
                        <form onSubmit={formik.handleSubmit} className={Style.animFadeSlide}>

                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="email">
                                    {t("login.email")}
                                </label>
                                <input
                                    className={Style.formControl}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder={t("login.emailPlaceholder")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {formik.errors.email && formik.touched.email && (
                                    <p className="text-danger small mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="password">
                                    {t("login.password")}
                                </label>
                                <input
                                    className={Style.formControl}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder={t("login.passwordPlaceholder")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                {formik.errors.password && formik.touched.password && (
                                    <p className="text-danger small mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            <div className="d-flex gap-2 mb-3 align-items-center flex-column flex-sm-row align-items-sm-center">
                                <button
                                    className={Style.btnHero}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? t("login.loggingIn") : t("login.login")}
                                </button>

                                <button type="button" className={Style.btnGoogle} onClick={handleGoogleLogin}>
                                    <img src={google} alt="Google" className={Style.googleIcon} />
                                    <span>{t("login.continueWithGoogle")}</span>
                                </button>
                            </div>

                            <div className="w-100 d-flex justify-content-sm-start justify-content-center">
                                <Link className={Style.muted} to="/forgotPassword">
                                    {t("login.forgotPassword")}
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
