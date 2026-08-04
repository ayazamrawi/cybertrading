import React, { useEffect, useMemo, useState } from "react";
import Style from "../../AdminDashboard.module.css";
import subscriptionStyle from "./Subscriptions.module.css";
import { useTranslation } from "react-i18next";
import adminApi from "../../../../Services/adminApi";

export default function Subscriptions() {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | this_month | last_month | last_3_months | last_6_months
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState("");     // yyyy-mm-dd

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  // ✅ params to send
  const params = useMemo(() => {
    const p = {};
    if (search.trim()) p.search = search.trim();

    // لو عندنا range كامل: نفضله على filter
    if (from && to) {
      p.from = from;
      p.to = to;
    } else if (filter !== "all") {
      p.filter = filter;
    }

    return p;
  }, [search, filter, from, to]);

  // ✅ fetch subscriptions with debounce
  useEffect(() => {
    let timer = setTimeout(async () => {
      try {
        setError("");
        setLoading(true);
        const res = await adminApi.get("/admin/subscriptions", { params });

        const list = res.data?.subscriptions || [];
        setRows(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load subscriptions");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [params]);

  const clearAll = () => {
    setSearch("");
    setFilter("all");
    setFrom("");
    setTo("");
  };

  const exportCsv = async () => {
    try {
      setExporting(true);

      const res = await adminApi.get("/admin/subscriptions/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "subscriptions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  const statusBadgeClass = (status) => {
    if (status === "active") return "badge bg-success";
    if (status === "canceled") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  return (
    <div className={`${Style.pageCard} ${Style.animFadeSlide}`}>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h4 className={Style.accentUnderline}>{t("admin_subscriptions.title")}</h4>
          <p className={`${Style.muted} mb-2`}>{t("admin_subscriptions.subtitle")}</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className={Style.btnOutlineSoft}
            onClick={clearAll}
            type="button"
          >
            {t("admin_subscriptions.clear") || "Clear"}
          </button>

          <button
            className={Style.btnHero}
            onClick={exportCsv}
            disabled={exporting}
            type="button"
          >
            {exporting ? (t("admin_subscriptions.exporting") || "Exporting...") : (t("admin_subscriptions.export") || "Export CSV")}
          </button>
        </div>
      </div>

      {/* ✅ Filters Row */}
      {/* ✅ Row 1: Search full width */}
<div className="mt-3">
  <input
    className={Style.inputSoft}
    style={{ width: "100%" }}
    placeholder={t("admin_subscriptions.searchPlaceholder")}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

{/* ✅ Row 2: Filters + Dates */}
<div className="d-flex flex-wrap gap-2 align-items-end mt-2 mb-3">
  {/* Filter */}
  <div style={{ minWidth: 200 }}>
    <label className={Style.muted} style={{ fontSize: "0.8rem" }}>
      {t("admin_subscriptions.filterLabel")}
    </label>
    <select
      className={Style.inputSoft}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      disabled={!!(from && to)}
      style={{ width: "100%" }}
    >
      <option value="all">{t("admin_subscriptions.filters.all")}</option>
      <option value="this_month">{t("admin_subscriptions.filters.this_month")}</option>
      <option value="last_month">{t("admin_subscriptions.filters.last_month")}</option>
      <option value="last_3_months">{t("admin_subscriptions.filters.last_3_months")}</option>
      <option value="last_6_months">{t("admin_subscriptions.filters.last_6_months")}</option>
    </select>
  </div>

  {/* From */}
  <div style={{ minWidth: 180 }}>
    <label className={Style.muted} style={{ fontSize: "0.8rem" }}>
      {t("admin_subscriptions.fromLabel")}
    </label>
    <input
      type="date"
      className={Style.inputSoft}
      value={from}
      onChange={(e) => setFrom(e.target.value)}
      style={{ width: "100%" }}
    />
  </div>

  {/* To */}
  <div style={{ minWidth: 180 }}>
    <label className={Style.muted} style={{ fontSize: "0.8rem" }}>
      {t("admin_subscriptions.toLabel")}
    </label>
    <input
      type="date"
      className={Style.inputSoft}
      value={to}
      onChange={(e) => setTo(e.target.value)}
      style={{ width: "100%" }}
    />
  </div>
</div>


      {error && <div className="text-danger mt-2">{error}</div>}
      {loading && <div className={`${Style.muted} mt-2`}>{t("admin_settings.loading") || "Loading..."}</div>}

      {/* ✅ Table */}
      <div className={subscriptionStyle.tableContainer}>
        <table className={`${Style.tableDarkCustom} mt-3`}>
          <thead>
            <tr>
              <th>{t("admin_subscriptions.user")}</th>
              <th>{t("admin_subscriptions.email")}</th>
              <th>{t("admin_subscriptions.plan")}</th>
              <th>{t("admin_subscriptions.interval")}</th>
              <th>{t("admin_subscriptions.amount")}</th>
              <th>{t("admin_subscriptions.status")}</th>
              <th>{t("admin_subscriptions.start_at")}</th>
              <th>{t("admin_subscriptions.end_at")}</th>
            </tr>
          </thead>

          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="8" className={`text-center ${Style.muted}`}>
                  {t("admin_subscriptions.no_data")}
                </td>
              </tr>
            )}

            {rows.map((sub) => {
              const user = sub.user || {};
              const plan = sub.planPrice || sub.plan_price || {};

              return (
                <tr key={sub.id}>
                  <td>{user?.name || "—"}</td>
                  <td>{user?.email || "—"}</td>
                  <td className="text-uppercase">{plan?.plan_name || "—"}</td>
                  <td>{plan?.interval || "—"}</td>
                  <td>
                    {plan?.amount ?? "—"} {plan?.currency || ""}
                  </td>
                  <td>
                    <span className={statusBadgeClass(sub.status)}>
                      {t(`admin_subscriptions.status_${sub.status}`) || sub.status}
                    </span>
                  </td>
                  <td>{formatDate(sub.created_at)}</td>
                  <td>{formatDate(sub.expired_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
