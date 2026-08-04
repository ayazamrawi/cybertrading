import React, { useEffect, useState } from 'react';
import Style from './AffiliatesApply.module.css';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import affiliateApi from '../../Services/affiliateApi';
import { useTranslation } from "react-i18next";
import api from '../../Services/api';

export default function AffiliateApply() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [commission, setCommission] = useState("");
     useEffect(() => {
  api.get('/admin/settings')
    .then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCommission(res.data[0].value); // ✅ correct
      }
    })
    .catch(err => console.error(err));
}, []);


    // 1. Submit Logic
    async function handleApply(values) {
        try {
            setLoading(true);
            setError(null);
            // Replace "/affiliate/apply" with your actual endpoint
            const { data } = await affiliateApi.post("/affiliate/apply", values);
            setSuccessMsg("Application submitted successfully!");
             if (data.token || data.access_token) {
            localStorage.setItem("affiliateToken", data.token || data.access_token);
        } // Debug log
        setLoading(false);
            setLoading(false);
            navigate("/affiliateVerifyAccount");

        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Failed to submit application");
        }
    }

    // 2. Validation Schema
   const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, t("affiliate_apply.affiliateApply.validation.nameMin"))
    .required(t("affiliate_apply.affiliateApply.validation.nameRequired")),

  email: Yup.string()
    .email(t("affiliate_apply.affiliateApply.validation.emailInvalid"))
    .required(t("affiliate_apply.affiliateApply.validation.emailRequired")),

  password: Yup.string()
    .min(8, t("affiliate_apply.affiliateApply.validation.passwordMin"))
    .required(t("affiliate_apply.affiliateApply.validation.passwordRequired")),

//   paypal_email: Yup.string()
//     .min(8, t("affiliate_apply.affiliateApply.validation.paypalemailMin"))

});



    // 3. Formik Hook
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            comment: '',
            paypal_email:''
        },
        validationSchema,
        onSubmit: handleApply
    });

    return (
        <div className={Style.containerMax}>
            <section className={`${Style.pageCard} ${Style.animSlideLeft} mt-5`} id="affiliate-apply" aria-label="Affiliate apply">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className={Style.pageTitle}>{t("affiliate_apply.apply.title")}</h3>
                    <div className={Style.muted}>{t("affiliate_apply.apply.subtitle")}</div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                <div className="row">
                    <div className="col-lg-7">
                        <form className={Style.animFadeSlide} onSubmit={formik.handleSubmit}>
                            
                            {/* Name */}
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="name">{t("affiliate_apply.form.name")}</label>
                                <input
                                    className={Style.formControl}
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder={t("affiliate_apply.form.namePlaceholder")}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                />
                                {formik.errors.name && formik.touched.name && 
                                    <p className="text-danger small mt-1">{formik.errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="email">{t("affiliate_apply.form.email")}</label>
                                <input
                                    className={Style.formControl}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={t("affiliate_apply.form.emailPlaceholder")} 
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                />
                                {formik.errors.email && formik.touched.email && 
                                    <p className="text-danger small mt-1">{formik.errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="password">{t("affiliate_apply.form.password")}</label>
                                <input
                                    className={Style.formControl}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                />
                                {formik.errors.password && formik.touched.password && 
                                    <p className="text-danger small mt-1">{formik.errors.password}</p>}
                            </div>

                            {/* Comment / Promotion */}
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="comment">{t("affiliate_apply.form.comment")}</label>
                                <textarea
                                    className={Style.formControl}
                                    rows="4"
                                    id="comment"
                                    name="comment"
                                    placeholder={t("affiliate_apply.form.commentPlaceholder")}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.comment}
                                ></textarea>
                                {formik.errors.comment && formik.touched.comment && 
                                    <p className="text-danger small mt-1">{formik.errors.comment}</p>}
                            </div>
                            <div className="mb-3">
                                <label className={Style.formLabel} htmlFor="paypal_email">{t("affiliate_apply.form.paypalemail")}</label>
                                <input
                                    className={Style.formControl}
                                    type="text"
                                    id="paypal_email"
                                    name="paypal_email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.paypal_email}
                                />
                                {formik.errors.paypal_email && formik.touched.paypal_email && 
                                    <p className="text-danger small mt-1">{formik.errors.paypal_email}</p>}
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className={Style.btnHero} disabled={loading}>
                                    {loading ?t("affiliate_apply.actions.submitting") : t("affiliate_apply.actions.apply")}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="col-lg-5 d-none d-lg-block">
                        <div className={`${Style.infoBox} mt-4`}>
                            <h4>{t("affiliate_apply.info.title")}</h4>
                            <ul>
                                 <li>{t("affiliate_apply.info.commission")} {commission}%</li>
  <li>{t("affiliate_apply.info.payouts")}</li>
  <li>{t("affiliate_apply.info.cookie")}</li>
  <li>{t("affiliate_apply.info.support")}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}