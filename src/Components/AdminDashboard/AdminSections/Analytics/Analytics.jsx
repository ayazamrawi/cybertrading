import React, { useEffect, useState } from "react";
import Style from "../../AdminDashboard.module.css";
import { useTranslation } from "react-i18next";
import adminApi from "../../../../Services/adminApi";
import api from "../../../../Services/api";

export default function Analytics({ subscriptions, status, users }) {
  const { t } = useTranslation();

  const [commission, setCommission] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const topPlans = Array.isArray(status?.top_plans) ? status.top_plans : [];
  const topPartners = Array.isArray(status?.top_partners) ? status.top_partners : [];
  const months = Array.isArray(status?.subscriptions_by_month) ? status.subscriptions_by_month : [];

  const updateCommission = async () => {
    try {
      setLoading(true);
      await adminApi.post("/admin/settings", {
        affiliate_commission: commission,
      });
      setSuccess("ok"); // just a flag, message comes from i18n
      setCommission("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get("/admin/settings")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCommission(res.data[0].value);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const safeNum = (v, fallback = 0) =>
    v == null || Number.isNaN(Number(v)) ? fallback : v;

  const money = (x) => {
    const n = Number(x ?? 0);
    if (Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
  };

  return (
    <>
      {/* ===================== KPIs ===================== */}
      <div className={`${Style.gridCards} mb-3`}>
        {/* 1 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.analytics.totalUsers")}</div>
          <div className={Style.value}>{safeNum(status?.total_users)}</div>
          <div className={Style.rightMuted}>
            +{safeNum(status?.users_week_percentage_change)}%{" "}
            {t("admin_analytics.analytics.thisWeek")}
          </div>
        </div>

        {/* 2 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.analytics.activePartners")}</div>
          <div className={Style.value}>{safeNum(status?.total_partners)}</div>
          <div className={Style.rightMuted}>
            +{safeNum(status?.partners_month_percentage_change)}%{" "}
            {t("admin_analytics.analytics.thisMonth")}
          </div>
        </div>

        {/* 3 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.analytics.monthlyRevenue")}</div>
          <div className={Style.value}>{safeNum(status?.current_month_revenue)}</div>
          <div className={Style.rightMuted}>
            +{safeNum(status?.revenue_month_percentage_change)}%{" "}
            {t("admin_analytics.analytics.vsPrevious")}
          </div>
        </div>

        {/* 4 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.activeSubscriptions")}</div>
          <div className={Style.value}>{safeNum(status?.active_subscriptions)}</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.newSubscriptions")}:{" "}
            {safeNum(status?.new_subscriptions_this_month)}
          </div>
        </div>

        {/* 5 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.canceledThisMonth")}</div>
          <div className={Style.value}>{safeNum(status?.canceled_subscriptions_this_month)}</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.churn", { defaultValue: "Churn" })}:{" "}
            {safeNum(status?.churn_rate_this_month)}%
          </div>
        </div>

        {/* 6 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.estimatedMrr")}</div>
          <div className={Style.value}>{safeNum(status?.estimated_mrr)}</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.arpu")}: {safeNum(status?.estimated_arpu)}
          </div>
        </div>

        {/* 7 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.partnerRevenueMonth")}</div>
          <div className={Style.value}>{safeNum(status?.partner_revenue_this_month)}</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.subs")}: {safeNum(status?.partner_subscriptions_this_month)}
          </div>
        </div>

        {/* 8 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.partnerEarningsMonth")}</div>
          <div className={Style.value}>{safeNum(status?.partner_earnings_this_month)}</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.commissionCreatedThisMonth")}
          </div>
        </div>

        {/* 9 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.paidToPartnersMonth")}</div>
          <div className={Style.value}>{safeNum(status?.partner_payouts_paid_this_month)}</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.pendingTotal")}:{" "}
            {safeNum(status?.partner_payouts_pending_total)}
          </div>
        </div>

        {/* 10 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.newSubscriptions")}</div>
          <div className={Style.value}>{safeNum(status?.new_subscriptions_this_month)}</div>
          <div className={Style.rightMuted}>
            +{safeNum(status?.new_subscriptions_this_week)} {t("admin_analytics.kpis.thisWeek")}
          </div>
        </div>

        {/* 11 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.directRevenueMonth")}</div>
          <div className={Style.value}>{money(status?.direct_month_revenue)}</div>
          <div className={Style.rightMuted}>{t("admin_analytics.kpis.directRevenueHint")}</div>
        </div>

        {/* 12 */}
        <div className={`${Style.infoCard} ${Style.animScale}`}>
          <div className={Style.kpi}>{t("admin_analytics.kpis.conversionRateMonth")}</div>
          <div className={Style.value}>{safeNum(status?.conversion_rate_this_month)}%</div>
          <div className={Style.rightMuted}>
            {t("admin_analytics.kpis.usersSubscribed", {
              subscribers: safeNum(status?.subscribers_this_month),
              users: safeNum(status?.users_this_month),
            })}
          </div>
        </div>
      </div>

      {/* ===================== Top Partners ===================== */}
      <div className={`${Style.pageCard} p-3 mb-3 ${Style.animFadeSlide}`}>
        <h6 className={Style.accentUnderline}>{t("admin_analytics.sections.topPartners90")}</h6>

        <div className={Style.tableContainer}>
          <table className={`${Style.tableDarkCustom} mt-3`}>
            <thead>
              <tr>
                <th>{t("admin_analytics.tables.partner")}</th>
                <th>{t("admin_analytics.tables.email")}</th>
                <th>{t("admin_analytics.tables.subscriptions")}</th>
                <th>{t("admin_analytics.tables.revenue")}</th>
              </tr>
            </thead>

            <tbody>
              {topPartners.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    —
                  </td>
                </tr>
              ) : (
                topPartners.map((p) => (
                  <tr key={p.affiliate_id}>
                    <td>{p.name || "—"}</td>
                    <td>{p.email || "—"}</td>
                    <td>{p.subscriptions_count ?? 0}</td>
                    <td>{money(p.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Top Plans ===================== */}
      <div className={`${Style.pageCard} p-3 mb-3 ${Style.animFadeSlide}`}>
        <h6 className={Style.accentUnderline}>{t("admin_analytics.sections.topPlans90")}</h6>

        <div className={Style.tableContainer}>
          <table className={`${Style.tableDarkCustom} mt-3`}>
            <thead>
              <tr>
                <th>{t("admin_analytics.tables.plan")}</th>
                <th>{t("admin_analytics.tables.currency")}</th>
                <th>{t("admin_analytics.tables.subscriptions")}</th>
                <th>{t("admin_analytics.tables.revenue")}</th>
              </tr>
            </thead>

            <tbody>
              {topPlans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    —
                  </td>
                </tr>
              ) : (
                topPlans.map((p) => (
                  <tr key={p.plan_price_id}>
                    <td>{p.plan_name || "—"}</td>
                    <td>{p.currency || "—"}</td>
                    <td>{p.subscriptions_count ?? 0}</td>
                    <td>{money(p.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Affiliate Commission ===================== */}
      <div className={`${Style.pageCard} p-3 mb-3 ${Style.animFadeSlide}`}>
        <h6 className={Style.accentUnderline}>{t("admin_analytics.commission.commission")}</h6>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <input
            type="number"
            min="0"
            max="100"
            placeholder={t("admin_analytics.commission.placeholder")}
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className={Style.inputSoft}
          />

          <button
            className={Style.btnHero}
            onClick={updateCommission}
            disabled={loading || !commission}
          >
            {loading
              ? t("admin_analytics.commission.updating")
              : t("admin_analytics.commission.update")}
          </button>
        </div>

        {success && (
          <p className="mt-2 text-success">{t("admin_analytics.commission.success")}</p>
        )}
      </div>

      {/* ===================== Subscription Months ===================== */}
      <div className={`${Style.pageCard} p-3 mb-3 ${Style.animFadeSlide}`}>
        <h6 className={Style.accentUnderline}>{t("admin_analytics.sections.subscriptionMonths6")}</h6>

        <div className={Style.tableContainer}>
          <table className={`${Style.tableDarkCustom} mt-3`}>
            <thead>
              <tr>
                <th>{t("admin_analytics.tables.month")}</th>
                <th>{t("admin_analytics.tables.subscriptions")}</th>
                <th>{t("admin_analytics.tables.revenue")}</th>
              </tr>
            </thead>

            <tbody>
              {months.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-secondary">
                    —
                  </td>
                </tr>
              ) : (
                months.map((m) => (
                  <tr key={m.month}>
                    <td>{m.month}</td>
                    <td>{m.subscriptions_count ?? 0}</td>
                    <td>{money(m.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Recent Subscriptions ===================== */}
      <div className={`${Style.pageCard} p-3 ${Style.animFadeSlide}`}>
        <h6 className={Style.accentUnderline}>{t("admin_analytics.analytics.recentActivity")}</h6>

        <div className={Style.tableContainer}>
          <table className={`${Style.tableDarkCustom} mt-3`}>
            <thead>
              <tr>
                <th>{t("admin_analytics.analytics.table.time")}</th>
                <th>{t("admin_analytics.analytics.table.user")}</th>
                <th>{t("admin_analytics.analytics.table.plan")}</th>
                <th>{t("admin_analytics.analytics.table.status")}</th>
              </tr>
            </thead>

            <tbody>
              {(subscriptions || []).map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.updated_at ? new Date(sub.updated_at).toLocaleString() : "—"}</td>
                  <td>{sub.user?.name || "—"}</td>
                  <td>{sub.plan_price?.plan_name || "—"}</td>
                  <td>{sub.status || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Recent Users (Last 7 Days) ===================== */}
      <div className={`${Style.pageCard} p-3 mb-3 ${Style.animFadeSlide}`}>
        <h6 className={Style.accentUnderline}>{t("admin_analytics.sections.recentUsers")}</h6>

        <div className={Style.tableContainer}>
          <table className={`${Style.tableDarkCustom} mt-3`}>
            <thead>
              <tr>
                <th>{t("admin_analytics.tables.time")}</th>
                <th>{t("admin_analytics.tables.name")}</th>
                <th>{t("admin_analytics.tables.email")}</th>
                <th>{t("admin_analytics.tables.tradingviewusername")}</th>
              </tr>
            </thead>

            <tbody>
              {(users || []).length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    —
                  </td>
                </tr>
              ) : (
                (users || []).map((u) => (
                  <tr key={u.id}>
                    {/* ✅ updated_at is correct for "recent users" */}
                    <td>{u.updated_at ? new Date(u.updated_at).toLocaleString() : "—"}</td>
                    <td>{u.name || "—"}</td>
                    <td>{u.email || "—"}</td>
                    <td>{u.username || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
