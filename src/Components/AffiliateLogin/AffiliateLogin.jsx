import React, { useState } from 'react';
import Style from './AffiliateLogin.module.css';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom";
import api from '../../Services/api';
import { useAuth } from '../../Context/AuthContext';
import { useTranslation } from 'react-i18next';


export default function AffiliateLogin() {
    const navigate = useNavigate();
    const { loginAffiliate } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    // 1. Login Submission Logic
    async function handleLogin(values) {
        try {
            setLoading(true);
            setError(null);

            console.log("Sending to API:", values);
            
            // Send login request
            const { data } = await api.post("/affiliate/login", values);

            console.log("API Response:", data);

            // Check if account is not verified
            if (data.message === "Account not verified") {
                setLoading(false);
                localStorage.setItem("affiliateToken", data.token);
                navigate("/affiliateApplySuccess");
                return;
            }

            // Successful login - use AuthContext
            loginAffiliate(data.affiliate, data.token);
            setLoading(false);
            navigate("/affiliateDashboard");

        } catch (err) {
            setLoading(false);
            console.error("Login Error:", err);
            console.error("Server Error Data:", err.response?.data);
            
            // Handle different error cases
            if (err.response?.status === 401) {
                setError("Invalid email or password. Please check your credentials.");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Login failed. Please try again.");
            }
        }
    }

    // 2. Validation Schema
    const validationSchema = Yup.object({
  email: Yup.string()
    .email(t("affiliateLogin.validation.emailInvalid"))
    .required(t("affiliateLogin.validation.emailRequired")),
  password: Yup.string()
    .required(t("affiliateLogin.validation.passwordRequired"))
});


    // 3. Formik Hook
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: handleLogin
    });

    return (
        <div className={Style.containerMax}>
            <section className={`${Style.pageCard} ${Style.animFadeSlide} mt-5`} id="affiliate-login" aria-label="Affiliate login">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className={Style.pageTitle}>{t("affiliateLogin.title")}</h3>
                    <div className={Style.muted}>
                        {t("affiliateLogin.partner")} <Link to="/affiliatesApply" style={{color: 'var(--hover-color)'}}>{t("affiliateLogin.apply")}</Link>
                    </div>
                </div>

                {/* API Error Display */}
                {error && <div className="alert alert-danger p-2 mb-3">{error}</div>}

                <div className="row">
                    <div className="col-md-8 col-lg-6">
                        <form onSubmit={formik.handleSubmit}>
                            {/* Email Input */}
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="email">{t("affiliateLogin.businessEmail")}</label>
                                <input
                                    className={Style.formControl}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your.email@company.com"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {formik.errors.email && formik.touched.email && (
                                    <p className="text-danger small mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="password">Password</label>
                                <input
                                    className={Style.formControl}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                {formik.errors.password && formik.touched.password && (
                                    <p className="text-danger small mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    type="submit" 
                                    className={Style.btnHero} 
                                    disabled={loading}
                                >
                                    {loading
    ? t("affiliateLogin.verifying")
    : t("affiliateLogin.login")}
                                </button>
                                
                            </div>
                            <div className='w-100 d-flex mt-3 justify-content-sm-start justify-content-center'>
                                <Link className={`${Style.muted}`} to="/affiliateForgetPassword">
                                    {t("affiliateLogin.forgotPassword")}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}