import React, { useState, useEffect } from "react";
import Style from "./Register.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import google from "../../Assets/Images/google.svg";
import api from "../../Services/api";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ 1) Capture ?ref and store it (and track click)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (!ref) return;

    // ✅ store it for register + google later
    localStorage.setItem("affiliate_ref", ref);

    // ✅ track click (best effort)
    api.post("/affiliate/track-click", { ref }).catch(() => {});

    // ✅ Optional: remove ref from URL to avoid re-tracking on refresh
    params.delete("ref");
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, []);

  const handleGoogleLogin = async () => {
    // ✅ always read fresh from storage
    const ref = localStorage.getItem("affiliate_ref");

    const { data } = await api.get(`/auth/google/redirect${ref ? `?ref=${ref}` : ""}`);
    window.location.href = data.url;
  };

  async function submitRegister(values) {
    try {
      setLoading(true);
      setError(null);

      // ✅ 2) Always attach ref at submit-time (most reliable)
      const ref = localStorage.getItem("affiliate_ref");
      const payload = {
        ...values,
        ...(ref ? { ref } : {}),
      };

      const { data } = await api.post("/register", payload);

      if (data.token || data.access_token) {
        localStorage.setItem("token", data.token || data.access_token);
      }

      // ✅ clear after success
      localStorage.removeItem("affiliate_ref");

      setLoading(false);
      navigate("/verifyAccount");
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors.join(", "));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(t("register.errors.generic"));
      }
    }
  }

  const validateSchema = Yup.object({
    name: Yup.string()
      .min(3, t("register.validation.nameMin"))
      .required(t("register.validation.nameRequired")),
    email: Yup.string()
      .email(t("register.validation.emailInvalid"))
      .required(t("register.validation.emailRequired")),
    password: Yup.string()
      .min(8, t("register.validation.passwordRule"))
      .required(t("register.validation.passwordRequired")),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], t("register.validation.passwordMatch"))
      .required(t("register.validation.confirmRequired")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      // ❌ do not rely on putting ref here (it might not exist at first render)
    },
    validationSchema: validateSchema,
    onSubmit: submitRegister,
  });

  return (
    <div className={`${Style.containerMax} mt-5`}>
      <section className={`${Style.pageCard} mt-5 ${Style.animSlideRight}`} id="register-page">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className={Style.pageTitle}>{t("register.title")}</h3>
          <div className={Style.muted}>
            {t("register.haveAccount")}{" "}
            <Link to="/login" style={{ color: "var(--hover-color)" }}>
              {t("register.login")}
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          <div className="col-lg-6 col-md-8">
            <form onSubmit={formik.handleSubmit} className={Style.animFadeSlide}>
              <div className="mb-3">
                <label className={Style.formLabel}>{t("register.fields.name")}</label>
                <input className={Style.formControl} type="text" {...formik.getFieldProps("name")} />
                {formik.errors.name && formik.touched.name && (
                  <div className="alert alert-danger p-2 mt-2">{formik.errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className={Style.formLabel}>{t("register.fields.email")}</label>
                <input className={Style.formControl} type="email" {...formik.getFieldProps("email")} />
                {formik.errors.email && formik.touched.email && (
                  <div className="alert alert-danger p-2 mt-2">{formik.errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className={Style.formLabel}>{t("register.fields.password")}</label>
                <input className={Style.formControl} type="password" {...formik.getFieldProps("password")} />
                {formik.errors.password && formik.touched.password && (
                  <div className="alert alert-danger p-2 mt-2">{formik.errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label className={Style.formLabel}>{t("register.fields.confirmPassword")}</label>
                <input
                  className={Style.formControl}
                  type="password"
                  {...formik.getFieldProps("password_confirmation")}
                />
                {formik.errors.password_confirmation && formik.touched.password_confirmation && (
                  <div className="alert alert-danger p-2 mt-2">{formik.errors.password_confirmation}</div>
                )}
              </div>

              <div className="d-flex gap-2 mb-3 flex-column flex-sm-row">
                <button className={Style.btnHero} type="submit" disabled={loading}>
                  {loading ? t("register.actions.loading") : t("register.actions.create")}
                </button>

                <button type="button" className={Style.btnGoogle} onClick={handleGoogleLogin}>
                  <img src={google} alt="Google" className={Style.googleIcon} />
                  <span>{t("register.actions.google")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
