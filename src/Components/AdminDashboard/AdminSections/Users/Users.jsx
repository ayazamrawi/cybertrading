import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Style from "../../AdminDashboard.module.css";
import usersStyle from "./Users.module.css";
import adminApi from "../../../../Services/adminApi";
import { toast } from "react-toastify";

export default function Users() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | this_month | last_month | last_3_months | last_6_months
  const [from, setFrom] = useState(""); // YYYY-MM-DD
  const [to, setTo] = useState("");     // YYYY-MM-DD

  const params = useMemo(() => {
    const p = {};
    if (search.trim()) p.search = search.trim();
    if (filter !== "all") p.filter = filter;
    if (from && to) {
      p.from = from;
      p.to = to;
    }
    return p;
  }, [search, filter, from, to]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await adminApi.get("/admin/users", { params });
        setUsers(res.data?.users || []);
        setTotalUsers(res.data?.total_users ?? 0);

      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong");
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

  const formatDateForAdmin = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(i18n.language || "en", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`${Style.pageCard} ${Style.animFadeSlide}`}>
      <h4 className={Style.accentUnderline}>{t("admin_users.title")}</h4>
      <p className={Style.muted} style={{ marginTop: 6 }}>
  {t("admin_users.total")}: {totalUsers}
</p>

      {/* ✅ Search row (Big, alone) */}
      <div className="mt-3">
        <input
          className={Style.inputSoft}
          placeholder={t("admin_users.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* ✅ Filters row (small) */}
      <div className="row gx-5 align-items-end mt-2">
        <div className="col-lg-4 col-md-4">
          <select
            className={Style.inputSoft}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t("admin_users.filters.all")}</option>
            <option value="this_month">{t("admin_users.filters.this_month")}</option>
            <option value="last_month">{t("admin_users.filters.last_month")}</option>
            <option value="last_3_months">{t("admin_users.filters.last_3_months")}</option>
            <option value="last_6_months">{t("admin_users.filters.last_6_months")}</option>
          </select>
        </div>

        <div className="col-lg-3 col-md-4 mt-2 mt-md-0">
          <label className={`${Style.muted} pe-3 pe-md-3`} style={{ fontSize: ".8rem" }}>
            {t("admin_users.from")}
          </label>
          <input
            type="date"
            className={Style.inputSoft}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="col-lg-3 col-md-4 mt-2 mt-md-0">
          <label className={`${Style.muted} pe-3 pe-md-3`} style={{ fontSize: ".8rem" }}>
            {t("admin_users.to")}
          </label>
          <input
            type="date"
            className={Style.inputSoft}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="col-lg-2 col-md-12">
          <button className={Style.btnHero} onClick={clearAll} style={{ width: "100%" }}>
            {t("admin_users.clear")}
          </button>
        </div>
      </div>

      {/* ✅ Table */}
      <div className={`${usersStyle.tableContainer} mt-3`}>
        {loading && <div className={Style.muted}>{t("admin_users.loading")}</div>}

        {!loading && users.length === 0 ? (
          <p className="text-danger">{t("admin_users.no_users")}</p>
        ) : (
          !loading && (
            <table className={Style.tableDarkCustom}>
              <thead>
                <tr>
                  <th>{t("admin_users.table.id")}</th>
                  <th>{t("admin_users.table.name")}</th>
                  <th>{t("admin_users.table.email")}</th>
                  <th>{t("admin_users.table.affiliate")}</th>
                  <th>{t("admin_users.table.created_at")}</th>
                  <th>{t("admin_users.table.tradingview")}</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.affiliate_id ? (user.affiliate_partner?.email || "—") : "—"}</td>
                    <td>
                      <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                        {formatDateForAdmin(user.created_at)}
                      </div>
                    </td>
                    <td>{user.username || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
