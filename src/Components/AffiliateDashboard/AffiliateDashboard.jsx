import React, { useEffect, useState } from "react";
import Style from "./AffiliateDashboard.module.css";
import affiliateApi from "../../Services/affiliateApi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// ✅ New separated sections
import AffiliateAnalyticsSection from "../AffiliateSections/Analytics/AffiliateAnalyticsSection";
import AffiliateResourcesSection from "../AffiliateSections/Resources/AffiliateResourcesSection";

export default function AffiliateDashboard() {
  const { t } = useTranslation();

  const [tab, setTab] = useState("analytics"); // analytics | resources

  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [payoutAmount, setPayoutAmount] = useState("");


  const [requestingPayout, setRequestingPayout] = useState(false);
  const [publicCommission, setPublicCommission] = useState(null);

  useEffect(() => {
  // dashboard
  affiliateApi
    .get("/affiliate/dashboard")
    .then((res) => setData(res.data))
    .catch(() => toast.error(t("affiliateDashboard.errors.loadFailed")));

  // settings (public commission)
  affiliateApi
    .get("/admin/settings")
    .then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      const item = list.find((s) => s.key === "affiliate_commission");
      setPublicCommission(item ? Number(item.value) : null);
    })
    .catch((err) => console.log(err));
}, [t]);

const commissionToShow = () => {
  const custom = data?.affiliate?.custom_commission;

  // ✅ لو custom موجود فعلاً (حتى لو string)
  if (custom !== null && custom !== undefined && String(custom).trim() !== "") {
    return Number(custom);
  }

  return publicCommission; // ممكن تبقى null لو لسه محملتش
};
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data?.affiliate_link || "");
      setCopied(true);
      toast.success(t("affiliateDashboard.toast.copied"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("affiliateDashboard.errors.copyFailed"));
    }
  };

  const handlePayoutRequest = async () => {
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) {
      toast.info(t("affiliateDashboard.requestPayout.invalidAmount"));
      return;
    }

    try {
      setRequestingPayout(true);
      await affiliateApi.post("/affiliate/payout/request", { amount });
      toast.success(t("affiliateDashboard.requestPayout.sent"));
      setPayoutAmount("");

      // refresh dashboard
      const res = await affiliateApi.get("/affiliate/dashboard");
      setData(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("affiliateDashboard.errors.generic"));
    } finally {
      setRequestingPayout(false);
    }
  };



  return (
    <div className={Style.containerMax}>
      {/* ✅ Header + Tabs */}
      <div className={`${Style.pageCard} ${Style.MainCard}`}>
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-3">
          <h3 className={Style.pageTitle}>
            {t("affiliateDashboard.partner")} {data?.affiliate?.name || ""}
          </h3>

          <div className="d-flex gap-2 flex-wrap">
            <button onClick={copyToClipboard} className={Style.btnHero} disabled={!data?.affiliate_link}>
              {copied ? t("affiliateDashboard.copied") : t("affiliateDashboard.copyLink")}
            </button>
          </div>
        </div>

        {/* ✅ Tabs */}
        <div className={Style.tabsRow}>
          <button
            className={`${Style.tabBtn} ${tab === "analytics" ? Style.tabActive : ""}`}
            onClick={() => setTab("analytics")}
          >
            {t("affiliateDashboard.tabs.analytics")}
          </button>

          <button
            className={`${Style.tabBtn} ${tab === "resources" ? Style.tabActive : ""}`}
            onClick={() => setTab("resources")}
          >
            {t("affiliateDashboard.tabs.resources")}
          </button>
        </div>
      </div>

      {/* ✅ Content */}
      {tab === "analytics" && (
        <>
          <AffiliateAnalyticsSection
            data={data}
            payoutAmount={payoutAmount}
            setPayoutAmount={setPayoutAmount}
            onPayoutRequest={handlePayoutRequest}
            requestingPayout={requestingPayout}
            publicCommission={publicCommission}
            commission={commissionToShow()}
          />
        </>
      )}

      {tab === "resources" && <AffiliateResourcesSection />}
    </div>
  );
}
