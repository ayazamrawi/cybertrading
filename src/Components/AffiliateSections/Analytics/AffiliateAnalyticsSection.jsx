import React from "react";
import Style from "../../AffiliateDashboard/AffiliateDashboard.module.css";
import { useTranslation } from "react-i18next";
import AffiliatePayoutCenter from "../PayoutCenter/AffiliatePayoutCenter";

export default function AffiliateAnalyticsSection({
  data,
  publicCommission,
  commission,
}) {
  const { t } = useTranslation();
  const refCode = (data?.affiliate?.ref_code ?? "").toString().trim();
const hideRefRow = refCode.toLowerCase().startsWith("not activated");

  const statusClasses = {
    approved: "text-success",
    rejected: "text-danger",
    pending: "text-warning",
  };

  const commissionValue =
    commission === null || commission === undefined
      ? publicCommission
      : commission;

  return (
    <>
      {/* ✅ KPIs */}
      <section className={`${Style.pageCard} ${Style.animScale}`} aria-label="Affiliate analytics">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-3">
            <div className={`${Style.infoCard} ${Style.glowHover} ${Style.animFadeSlide}`}>
              <div className={Style.kpi}>{t("affiliateDashboard.subscribedUsers")}</div>
              <div className={Style.value}>{data?.statistics?.subscribed_users ?? "-"}</div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-3">
            <div className={`${Style.infoCard} ${Style.glowHover} ${Style.animFadeSlide}`}>
              <div className={Style.kpi}>{t("affiliateDashboard.totalEarnings")}</div>
              <div className={Style.value}>{data?.statistics?.total_earnings ?? "-"}</div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 mb-3">
            <div className={`${Style.infoCard} ${Style.glowHover} ${Style.animFadeSlide}`}>
              <div className={Style.kpi}>{t("affiliateDashboard.users")}</div>
              <div className={Style.value}>{data?.statistics?.total_users ?? "-"}</div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-3">
            <div className={`${Style.infoCard} ${Style.glowHover} ${Style.animFadeSlide}`}>
              <div className={Style.kpi}>{t("affiliateDashboard.commission")}</div>
              <div className={Style.value}>
                {commissionValue === null || commissionValue === undefined
                  ? "—"
                  : `${Number(commissionValue).toFixed(0)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ More info */}
        <div className={`${Style.pageCard} p-3 mt-2`}>
          <h6 className={Style.accentUnderline}>{t("affiliateDashboard.moreInfo")}</h6>


            <div className={`${Style.infoRows} container`}>
          {!hideRefRow && (
            <div className={Style.infoRow}>
              <span>{t("affiliateDashboard.refCode")}</span>
              <strong>{data?.affiliate?.ref_code ?? "-"}</strong>
            </div>
          )}

            <div className={`${Style.infoRow} d-none d-md-flex`}>
              <span>{t("affiliateDashboard.link")}</span>
              <strong className={Style.breakAll}>{data?.affiliate_link ?? "-"}</strong>
            </div>

            <div className={Style.infoRow}>
              <span>{t("affiliateDashboard.clicks")}</span>
              <strong>{data?.affiliate?.clicks ?? "-"}</strong>
            </div>

            <div className={Style.infoRow}>
              <span>{t("affiliateDashboard.email")}</span>
              <strong>{data?.affiliate?.email ?? "-"}</strong>
            </div>

            <div className={Style.infoRow}>
              <span>{t("affiliateDashboard.status")}</span>
              <strong className={statusClasses[data?.affiliate?.status] || "text-secondary"}>
                {data?.affiliate?.status ?? "-"}
              </strong>
            </div>

            <div className={Style.infoRow}>
              <span>{t("affiliateDashboard.paid")}</span>
              <strong>{data?.statistics?.paid_earnings ?? "-"}</strong>
            </div>

            <div className={Style.infoRow}>
              <span>{t("affiliateDashboard.unpaid")}</span>
              <strong>{data?.statistics?.unpaid_earnings ?? "-"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Payout Center: Form + History */}
      <AffiliatePayoutCenter
        availableBalance={data?.statistics?.unpaid_earnings}
      />
    </>
  );
}
