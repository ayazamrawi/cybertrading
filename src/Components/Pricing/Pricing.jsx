import Style from "./Pricing.module.css";
import React, { useEffect, useRef, useState } from "react";
import api from "../../Services/api";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import userApi from "../../Services/userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const { t } = useTranslation();

  const [prices, setPrices] = useState([]);
  const [planType, setPlanType] = useState("monthly");

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);

  const [error, setError] = useState(null);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const errorRef = useRef(null);

  const navigate = useNavigate();
  // ✅ Active subscription (from /user)
  const [activeSub, setActiveSub] = useState(null);

  // ✅ Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewPlan, setPreviewPlan] = useState(null);
  const [showPreviewDetails, setShowPreviewDetails] = useState(false);

  const togglePlan = (type) => setPlanType(type);

  // =========================
  // ✅ Partner block (Front-only)
  // =========================
  const userToken = localStorage.getItem("token");
  const partnerToken = localStorage.getItem("affiliateToken"); // <-- لو اسم التوكن مختلف قولي
  const isPartnerAccount = !!partnerToken && !userToken;
  const [showPartnerBanner, setShowPartnerBanner] = useState(true);

  // small helper to avoid showing raw i18n key if missing
  const tr = (key, fallback) => {
    const v = t(key);
    return v && v !== key ? v : fallback;
  };

  const partnerBlockMessage = tr(
    "pricing.partnerBlock.message",
    "You are logged in as a partner. Subscriptions are available only for user accounts."
  );
  const toastOnceRef = useRef(false);

const blockIfPartner = () => {
  if (!isPartnerAccount) return false;

  if (!toastOnceRef.current) {
    toastOnceRef.current = true;
    toast.info(partnerBlockMessage);
  }

  return true;
};
  

  // ✅ Helpers (IMPORTANT: must be outside fetchPlanPreview)
  const money = (amount, currency) => {
    if (amount === null || amount === undefined) return "-";
    const value = (Number(amount) / 100).toFixed(2);
    return `${value} ${String(currency || "").toUpperCase()}`;
  };

  const toDate = (unix) => {
    if (!unix) return "-";
    try {
      return new Date(unix * 1000).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const extractSummary = (preview) => {
    // ✅ Prefer backend summary if exists
    const summary = preview?.summary;
    if (summary && (summary.new_charges_total !== undefined || summary.unused_time_credit_total !== undefined)) {
      return {
        charges: summary.new_charges_total ?? 0,
        credits: summary.unused_time_credit_total ?? 0, // usually negative
        amountDueNow: summary.amount_due_now ?? preview?.amount_due ?? 0,
      };
    }

    // fallback: compute from lines
    const lines = Array.isArray(preview?.lines) ? preview.lines : [];
    const credits = lines
      .filter((l) => (l.amount ?? 0) < 0)
      .reduce((sum, l) => sum + (l.amount ?? 0), 0);

    const charges = lines
      .filter((l) => (l.amount ?? 0) > 0)
      .reduce((sum, l) => sum + (l.amount ?? 0), 0);

    return { credits, charges, amountDueNow: preview?.amount_due ?? 0 };
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  // ✅ Load plans
  useEffect(() => {
    api
      .get("/plans/prices")
      .then((res) => {
        setPrices(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Load user subscription if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSubLoading(false);
      setActiveSub(null);
      return;
    }

    userApi
      .get("/user")
      .then((res) => {
        const subs = res.data?.subscriptions || [];
        const active = subs
          .filter((s) => s.status === "active" || s.status === "trialing")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

        setActiveSub(active || null);
      })
      .catch(() => setActiveSub(null))
      .finally(() => setSubLoading(false));
  }, []);

  // ✅ tiers mapping
  const tierRank = (planName) => {
    const map = { pro: 1, pro_max: 2 };
    return map[planName] ?? 999;
  };

  const isLoggedIn = !!localStorage.getItem("token");
  const hasActiveSub = !!activeSub;

  const currentPlanPriceId = activeSub?.plan_price?.id || null;
  const currentPlanName = activeSub?.plan_price?.plan_name || null;

  // ✅ For non-subscribed users
  const handleOrderNow = async (planPriceId) => {
    if (blockIfPartner()) return;

    try {
      setError(null);
      setProcessingPlanId(planPriceId);

      const { data } = await userApi.post("/create-checkout-session", {
        plan_price_id: planPriceId,
      });

      if (data?.success && data?.url) {
        window.location.href = data.url;
        return;
      }

      setError(t("pricing.errors.checkoutFailed"));
    } catch (err) {
      if (err.response?.status === 401) {
        setError(t("pricing.errors.unauthenticated"));
        setTimeout(()=>{
          navigate('/login');
          

        },1500)
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            t("pricing.errors.generic")
        );
      }
    } finally {
      setProcessingPlanId(null);
    }
  };

  // ✅ For subscribed users (upgrade/downgrade) - confirm after preview
  const handleChangePlan = async (planPriceId) => {
    if (blockIfPartner()) return;

    try {
      setError(null);
      setProcessingPlanId(planPriceId);

      const { data } = await userApi.post("/subscription/change-plan", {
        plan_price_id: planPriceId,
      });

      if (!data?.success) {
        const msg = data?.message || t("pricing.toast.planChangeFailed");
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success(t("pricing.toast.planChanged"));

      // Refresh subscription state
      const res = await userApi.get("/user");
      const subs = res.data?.subscriptions || [];
      const active = subs
        .filter((s) => s.status === "active" || s.status === "trialing")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      setActiveSub(active || null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("pricing.toast.planChangeFailed");
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessingPlanId(null);
    }
  };

  // ✅ Preview (from backend response new structure)
  const fetchPlanPreview = async (plan) => {
    if (blockIfPartner()) return;

    try {
      setError(null);
      setProcessingPlanId(plan.id);
      setShowPreviewDetails(false);

      const { data } = await userApi.post("/subscription/plan-change-preview", {
        plan_price_id: plan.id,
      });

      if (!data?.success) {
        setError(data?.message || t("pricing.errors.generic"));
        return;
      }

      setPreviewPlan(plan);
      setPreviewData(data);
      setPreviewOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || t("pricing.errors.generic"));
    } finally {
      setProcessingPlanId(null);
    }
  };

  // ✅ Filter visible plans by interval
  const visiblePlans = prices.filter(
    (p) => p.interval === planType && p.is_active === 1
  );

  // ✅ Helper: Decide label and action
  const getCtaForPlan = (plan) => {
    // 0) Partner account => block with message
    if (isPartnerAccount) {
      return {
        label: tr("pricing.actions.partnerDisabled", "Not available for partners"),
        disabled: true, 
        onClick: () => {
          toast.info(partnerBlockMessage);
        },
      };
    }

    // 1) Not logged in OR no active subscription => Order Now
    if (!isLoggedIn || !hasActiveSub) {
      return {
        label: t("pricing.actions.orderNow"),
        disabled: false,
        onClick: () => handleOrderNow(plan.id),
      };
    }

    // 2) Current plan => disabled
    if (currentPlanPriceId === plan.id) {
      return {
        label: t("pricing.actions.currentPlan"),
        disabled: true,
        onClick: () => {},
      };
    }

    // 3) Upgrade/Downgrade
    const currentRank = tierRank(currentPlanName);
    const thisRank = tierRank(plan.plan_name);

    if (thisRank > currentRank) {
      return {
        label: t("pricing.actions.upgrade"),
        disabled: false,
        onClick: () => fetchPlanPreview(plan),
      };
    }

    return {
      label: t("pricing.actions.downgrade"),
      disabled: false,
      onClick: () => fetchPlanPreview(plan),
    };
  };

  return (
    <div className={`${Style.pricingWrapper} mt-5`}>
      <div className="container text-center pt-5">
        <h1 className={Style.title}>{t("pricing.title")}</h1>
        <p>{t("pricing.subtitle")}</p>

        {isPartnerAccount && showPartnerBanner && (
  <div className="alert alert-info mt-3 d-flex justify-content-between align-items-center">
    <span>{partnerBlockMessage}</span>
    <button
      type="button"
      className="btn-close"
      aria-label="Close"
      onClick={() => setShowPartnerBanner(false)}
    />
  </div>
)}

        <div className={`${Style.toggle} m-auto`}>
          <button
            className={`${Style.toggleBtn} ${planType === "monthly" ? Style.active : ""}`}
            onClick={() => togglePlan("monthly")}
          >
            {t("pricing.toggle.monthly")}
          </button>
          <button
            className={`${Style.toggleBtn} ${planType === "yearly" ? Style.active : ""}`}
            onClick={() => togglePlan("yearly")}
          >
            {t("pricing.toggle.yearly")}
          </button>
        </div>

        {(loading || subLoading) && <LoadingScreen />}

        {error && (
          <div ref={errorRef} className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4 justify-content-center">
          {!loading &&
            !subLoading &&
            visiblePlans.map((plan) => {
              const cta = getCtaForPlan(plan);
              const isProcessing = processingPlanId === plan.id;

              const buttonClass = cta.disabled ? Style.currentPlanBtn : Style.orderPayment;

              // ----- PRO CARD -----
              if (plan.plan_name === "pro") {
                return (
                  <div className="col" key={plan.id}>
                    <div className={`${Style.plan} p-1`}>
                      <div className={`${Style.basicOffer} ${Style.premium} pt-4`}>
                        <h3>{t("pricing.plans.premium.title")}</h3>
                        <p>{t("pricing.plans.premium.badge")}</p>
                      </div>

                      {plan?.onSale === 1 && plan?.percentage ? (
                        <div className={Style.saleBadge}>
                          <i className="fa-solid fa-tag"></i>
                          <span>{plan.percentage}%</span>
                        </div>
                      ) : null}

                      <h4 className="h1">
                        <span className="h5 pe-1">
                          {plan?.currency === "eur" ? "€" : plan?.currency === "usd" ? "$" : plan?.currency || "$"}
                        </span>

                        {plan?.onSale === 1 ? (
                          <>
                            <span className={Style.oldPrice}>{plan?.amount_before_sale}</span>
                            <span className={Style.salePrice}>{plan?.amount}</span>
                          </>
                        ) : (
                          <span>{plan?.amount}</span>
                        )}
                      </h4>

                      {/* features (as-is) */}
                      <div className="ps-3">
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.indicators")}</span></p>
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.advancedScreeners")}</span></p>
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.unlimitedBacktests")}</span></p>
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.prioritySupport")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.aiAssistant")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.customStrategies")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.apiAccess")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.premium.features.whiteLabel")}</span></p>
                      </div>

                      <button
                        type="button"
                        className={buttonClass}
                        onClick={cta.onClick}
                        disabled={cta.disabled || isProcessing}
                      >
                        {isProcessing ? t("pricing.actions.processing") : cta.label}
                      </button>
                    </div>
                  </div>
                );
              }

              // ----- PRO_MAX CARD -----
              if (plan.plan_name === "pro_max") {
                return (
                  <div className="col" key={plan.id}>
                    <div className={`${Style.plan} p-1`}>
                      <div className={`${Style.basicOffer} ${Style.enterprise} pt-4`}>
                        <h3>{t("pricing.plans.enterprise.title")}</h3>
                        <p>{t("pricing.plans.enterprise.badge")}</p>
                      </div>

                      {plan?.onSale === 1 && plan?.percentage ? (
                        <div className={Style.saleBadge}>
                          <i className="fa-solid fa-tag"></i>
                          <span>{plan.percentage}%</span>
                        </div>
                      ) : null}

                      <h4 className="h1">
                        <span className="h5 pe-1">
                          {plan?.currency === "eur" ? "€" : plan?.currency === "usd" ? "$" : plan?.currency || "$"}
                        </span>

                        {plan?.onSale === 1 ? (
                          <>
                            <span className={Style.oldPrice}>{plan?.amount_before_sale}</span>
                            <span className={Style.salePrice}>{plan?.amount}</span>
                          </>
                        ) : (
                          <span>{plan?.amount}</span>
                        )}
                      </h4>

                      {/* features (as-is) */}
                      <div className="ps-3">
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.indicators500")}</span></p>
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.customScreeners")}</span></p>
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.unlimitedEverything")}</span></p>
                        <p><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.phoneSupport")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.aiAssistantPro")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.unlimitedStrategies")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.fullApiAccess")}</span></p>
                        <p className={Style.accepted}><span className={Style.accepted}>◉</span> <span className={Style.lightAccepted}>{t("pricing.plans.enterprise.features.whiteLabelOptions")}</span></p>
                      </div>

                      <button
                        type="button"
                        className={buttonClass}
                        onClick={cta.onClick}
                        disabled={cta.disabled || isProcessing}
                      >
                        {isProcessing ? t("pricing.actions.processing") : cta.label}
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })}
        </div>

        {/* ✅ Preview Modal (fits the NEW backend response) */}
        {previewOpen && previewData && (
          <div
            className={Style.previewOverlay}
            onClick={() => {
              setPreviewOpen(false);
              setPreviewData(null);
              setPreviewPlan(null);
              setShowPreviewDetails(false);
            }}
          >
            <div className={Style.previewModal} onClick={(e) => e.stopPropagation()}>
              <h4 className={Style.previewTitle}>{t("pricing.preview.title")}</h4>
              <p className={Style.previewSubtitle}>{t("pricing.preview.subTitle")}</p>

              {/* Plan info */}
              <div className={Style.previewGrid}>
                <div className={Style.previewRow}>
                  <span>{t("pricing.preview.currentPlan") || "Current plan"}</span>
                  <strong>
                    {previewData?.current_plan?.plan_price_id
                      ? `#${previewData.current_plan.plan_price_id}`
                      : "-"}
                  </strong>
                </div>

                <div className={Style.previewRow}>
                  <span>{t("pricing.preview.newPlan") || "New plan"}</span>
                  <strong>
                    {previewData?.new_plan?.plan_name
                      ? `${previewData.new_plan.plan_name} (${previewData.new_plan.interval || ""})`
                      : previewPlan?.plan_name || "-"}
                  </strong>
                </div>

                <div className={Style.previewRow}>
                  <span>{t("pricing.preview.renewalDate") || "Next renewal date"}</span>
                  <strong>{toDate(previewData?.time?.current_period_end)}</strong>
                </div>

                <div className={Style.previewRow}>
                  <span>{t("pricing.preview.remainingTime") || "Remaining time"}</span>
                  <strong>
                    {previewData?.time?.remaining_days !== undefined
                      ? `${previewData.time.remaining_days} ${t("pricing.preview.days") || "days"}`
                      : "-"}
                  </strong>
                </div>

                <div className={Style.previewRow}>
                  <span>{t("pricing.preview.usedTime") || "Used time"}</span>
                  <strong>
                    {previewData?.time?.used_days !== undefined
                      ? `${previewData.time.used_days} ${t("pricing.preview.days") || "days"}`
                      : "-"}
                  </strong>
                </div>
              </div>

              {/* Amounts */}
              {(() => {
                const { credits, charges, amountDueNow } = extractSummary(previewData);
                return (
                  <div className={`${Style.previewGrid} mt-3`}>
                    <div className={Style.previewRow}>
                      <span>{t("pricing.preview.newSubtotal")}</span>
                      <strong>{money(charges, previewData.currency)}</strong>
                    </div>

                    <div className={Style.previewRow}>
                      <span>{t("pricing.preview.unusedCredit")}</span>
                      <strong>{money(Math.abs(credits), previewData.currency)}</strong>
                    </div>

                    <div className={Style.previewRowTotal}>
                      <span>{t("pricing.preview.amountDue")}</span>
                      <strong>{money(amountDueNow, previewData.currency)}</strong>
                    </div>
                  </div>
                );
              })()}

              {/* Details toggle */}
              <button
                type="button"
                className={Style.btnOutlineSoft}
                style={{ width: "100%", marginTop: 14 }}
                onClick={() => setShowPreviewDetails((v) => !v)}
              >
                {showPreviewDetails
                  ? t("pricing.preview.hideDetails") || "Hide details"
                  : t("pricing.preview.showDetails") || "Show details"}
              </button>

              {showPreviewDetails && Array.isArray(previewData?.lines) && (
                <div
                  style={{
                    marginTop: 12,
                    maxHeight: 300,
                    overflowY: "auto",
                    overflowX: "hidden",
                    paddingRight: 6,
                  }}
                >
                  {previewData.lines.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "10px 0",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div style={{ flex: 1, opacity: 0.95 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {l.description || (l.proration ? "Proration" : "Charge")}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.75 }}>
                          {l.period?.start && l.period?.end
                            ? `${toDate(l.period.start)} → ${toDate(l.period.end)}`
                            : ""}
                        </div>
                      </div>

                      <div style={{ fontWeight: 800 }}>
                        {money(l.amount, l.currency || previewData.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className={Style.previewActions}>
                <button
                  className={Style.btnOutlineSoft}
                  onClick={() => {
                    setPreviewOpen(false);
                    setPreviewData(null);
                    setPreviewPlan(null);
                    setShowPreviewDetails(false);
                  }}
                >
                  {t("pricing.preview.cancel")}
                </button>

                <button
                  className={Style.orderPayment}
                  disabled={!previewPlan?.id}
                  onClick={() => {
                    // ✅ extra safety: partner cannot confirm either
                    if (blockIfPartner()) return;

                    setPreviewOpen(false);
                    const id = previewPlan?.id;
                    setPreviewData(null);
                    setPreviewPlan(null);
                    setShowPreviewDetails(false);
                    if (id) handleChangePlan(id);
                  }}
                >
                  {t("pricing.preview.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USDT Subscription */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className={Style.usdtCard}>
              <div className={Style.usdtIcon}>
                <i className="fa-brands fa-telegram"></i>
              </div>
              <h3>{t("pricing.usdt.title")}</h3>
              <p>{t("pricing.usdt.description")}</p>
              <a
                href="https://t.me/CyberPipsBot"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.usdtButton}
              >
                <i className="fa-brands fa-telegram me-2"></i>
                {t("pricing.usdt.action")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
