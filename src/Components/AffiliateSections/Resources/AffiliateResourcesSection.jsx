import React, { useEffect, useMemo, useState } from "react";
import Style from "../../AffiliateDashboard/AffiliateDashboard.module.css";
import affiliateApi from "../../../Services/affiliateApi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function AffiliateResourcesSection() {
  const { t } = useTranslation();

  const [subTab, setSubTab] = useState("referrals"); // referrals | earnings
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | this_month | last_month

  // FROM   ,, TO
  const [from , setFrom] = useState("");
  const [to , setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [totals, setTotals] = useState({ referrals_count: 0, total_earnings: 0 });
  const statusClass = (s) => {
  if (s === "approved") return Style.badgeSuccess;
  if (s === "pending") return Style.badgeWarn;
  return Style.badgeDanger; // rejected
};

    const percent = (v) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}%`;
};

  const params = useMemo(() => {
    const p = {};
    if (search.trim()) p.search = search.trim();
    if (from) p.from = from;
    if (to) p.to = to;

    if (!from && !to && filter !== "all") p.filter = filter;

  return p;
}, [search, filter, from, to]);

  useEffect(() => {
    let timer = setTimeout(async () => {
      try {
        setLoading(true);

        if (subTab === "referrals") {
          const res = await affiliateApi.get("/affiliate/my-referrals", { params });
          setReferrals(res.data?.referrals || []);
          setTotals((prev) => ({ ...prev, referrals_count: res.data?.referrals_count || 0 }));
        } else {
          const res = await affiliateApi.get("/affiliate/my-earnings", { params });
          setEarnings(res.data?.earnings || []);
          setTotals((prev) => ({ ...prev, total_earnings: res.data?.total_earnings || 0 }));
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || t("affiliateDashboard.errors.generic"));
      } finally {
        setLoading(false);
      }
    }, 350); // ✅ debounce

    return () => clearTimeout(timer);
  }, [subTab, params, t]);

  const money = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return `${Number(amount).toFixed(2)}`;
  };

  return (
    <section className={`${Style.pageCard} ${Style.animScale}`} aria-label="Affiliate resources">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className={Style.accentUnderline}>{t("affiliateDashboard.resources.title")}</h6>

        <div className={Style.tabsRowSmall}>
          <button
            className={`${Style.tabBtnSmall} ${subTab === "referrals" ? Style.tabActive : ""}`}
            onClick={() => setSubTab("referrals")}
          >
            {t("affiliateDashboard.resources.referralsTab")}
          </button>
          <button
            className={`${Style.tabBtnSmall} ${subTab === "earnings" ? Style.tabActive : ""}`}
            onClick={() => setSubTab("earnings")}
          >
            {t("affiliateDashboard.resources.earningsTab")}
          </button>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className={Style.filtersRow}>
        <input
          className={Style.input}
          placeholder={t("affiliateDashboard.resources.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className={Style.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">{t("affiliateDashboard.resources.filters.all")}</option>
          <option value="this_month">{t("affiliateDashboard.resources.filters.thisMonth")}</option>
          <option value="last_month">{t("affiliateDashboard.resources.filters.lastMonth")}</option>
        </select>
        <div className="d-flex gap-3 flex-wrap align-items-end">

  <div>
    <label className={Style.labelMini}>
      {t("affiliateDashboard.resources.fromDate")}
    </label>
    <input
      type="date"
      className={Style.input}
      value={from}
      onChange={(e) => setFrom(e.target.value)}
    />
  </div>

  <div>
    <label className={Style.labelMini}>
      {t("affiliateDashboard.resources.toDate")}
    </label>
    <input
      type="date"
      className={Style.input}
      value={to}
      onChange={(e) => setTo(e.target.value)}
    />
  </div>

  <div>
    <button
      type="button"
      className={Style.tabBtnSmall}
      onClick={() => {
        setSearch("");
        setFilter("all");
        setFrom("");
        setTo("");
      }}
      style={{ height: 46 }}
    >
      {t("affiliateDashboard.resources.clear")}
    </button>
  </div>
</div>

        <div className={Style.smallKpi}>
          {subTab === "referrals" ? (
            <>
              <span>{t("affiliateDashboard.resources.totalReferrals")}</span>
              <strong>{totals.referrals_count}</strong>
            </>
          ) : (
            <>
              <span>{t("affiliateDashboard.resources.totalEarnings")}</span>
              <strong>{money(totals.total_earnings)}</strong>
            </>
          )}
        </div>
      </div>

      {/* ✅ Tables */}
      <div className={Style.tableWrap}>
        {loading && <div className={Style.loadingText}>{t("affiliateDashboard.loading")}</div>}

        {!loading && subTab === "referrals" && (
          <table className={Style.table}>
            <thead>
              <tr>
                <th>{t("affiliateDashboard.resources.columns.name")}</th>
                <th>{t("affiliateDashboard.resources.columns.email")}</th>
                <th>{t("affiliateDashboard.resources.columns.joined")}</th>
                <th>{t("affiliateDashboard.resources.columns.plan")}</th>
                <th>{t("affiliateDashboard.resources.columns.subscribed")}</th>
                <th>{t("affiliateDashboard.resources.columns.earning")}</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((u) => (
                <tr key={u.id}>
                  <td className={Style.cellStrong}>{u.name}</td>
                  <td className={Style.cellMuted}>{u.email}</td>
                  <td>{u.joined_at}</td>

                  <td>
                    {u.first_subscription?.plan_name
                      ? `${u.first_subscription.plan_name} (${u.first_subscription.plan_currency} ${u.first_subscription.plan_amount})`
                      : "-"}
                  </td>

                  <td>
                    <span className={`${Style.badge} ${u.is_subscribed ? Style.badgeSuccess : Style.badgeGhost}`}>
                      {u.is_subscribed ? t("affiliateDashboard.resources.yes") : t("affiliateDashboard.resources.no")}
                    </span>
                  </td>

                  <td>
                    {u.earning_from_first_subscription?.amount
                      ? `${u.earning_from_first_subscription.amount} (${u.earning_from_first_subscription.status})`
                      : "-"}
                  </td>
                </tr>
              ))}

              {!referrals.length && (
                <tr>
                  <td colSpan="6" className={Style.emptyRow}>
                    {t("affiliateDashboard.resources.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {!loading && subTab === "earnings" && (
          <table className={Style.table}>
            <thead>
              <tr>
                <th>{t("affiliateDashboard.resources.columns.date")}</th>
                <th>{t("affiliateDashboard.resources.columns.user")}</th>
                <th>{t("affiliateDashboard.resources.columns.plan")}</th>
                  <th>{t("affiliateDashboard.resources.columns.percentage")}</th>
                <th>{t("affiliateDashboard.resources.columns.amount")}</th>
                <th>{t("affiliateDashboard.resources.columns.status")}</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((e) => (
                <tr key={e.id}>
                  <td>{e.created_at}</td>
                  <td>
                    <div className={Style.cellStrong}>{e.user?.name || "-"}</div>
                    <div className={Style.cellMuted}>{e.user?.email || ""}</div>
                  </td>
                  <td>
                    {e.plan?.name
                      ? `${e.plan.name} (${e.plan.currency} ${e.plan.amount})`
                      : "-"}
                  </td>
                  <td className={Style.cellStrong}>{percent(e.percentage)}</td>


                 <td className={Style.cellStrong}>
  {money(e.amount)}
</td>

                  <td>
  <span className={`${Style.badge} ${statusClass(e.status)}`}>
    {t(`affiliateDashboard.Status.${e.status}`)}
  </span>
</td>

                </tr>
              ))}

              {!earnings.length && (
                <tr>
                  <td colSpan="5" className={Style.emptyRow}>
                    {t("affiliateDashboard.resources.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
