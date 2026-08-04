// Partners.jsx
import React, { useEffect, useMemo, useState } from "react";
import Style from "../../AdminDashboard.module.css";
import partnerStyle from "./Partners.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import adminApi from "../../../../Services/adminApi";
import { toast } from "react-toastify";

export default function Partners() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [totalPartners, setTotalPartners] = useState(0);


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
        const res = await adminApi.get("/admin/partners", { params });
        setPartners(res.data?.partners || []);
        setTotalPartners(res.data?.total_partners ?? 0);

      } catch (err) {
        toast.error(err?.response?.data?.message || t("admin_partners.errors.generic"));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [params, t]);

  const clearAll = () => {
    setSearch("");
    setFilter("all");
    setFrom("");
    setTo("");
  };

  return (
    <div className={`${Style.pageCard} ${Style.animFadeSlide}`}>
      <h4 className={Style.accentUnderline}>{t("admin_partners.title")}</h4>

      <p className={Style.muted} style={{ marginTop: 6 }}>
      {t("admin_partners.total")}: {totalPartners}
      </p>


      {/* ✅ Search row (Big, alone) */}
      <div className="mt-3">
        <input
          className={Style.inputSoft}
          placeholder={t("admin_partners.searchPlaceholder")}
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
            <option value="all">{t("admin_partners.filters.all")}</option>
            <option value="this_month">{t("admin_partners.filters.this_month")}</option>
            <option value="last_month">{t("admin_partners.filters.last_month")}</option>
            <option value="last_3_months">{t("admin_partners.filters.last_3_months")}</option>
            <option value="last_6_months">{t("admin_partners.filters.last_6_months")}</option>
          </select>
        </div>

        <div className="col-lg-3 col-md-4 mt-2 mt-md-0">
          <label className={`${Style.muted} pe-3 pe-md-3`} style={{ fontSize: ".8rem" }}>
            {t("admin_partners.from")}
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
            {t("admin_partners.to")}
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
            {t("admin_partners.clear")}
          </button>
        </div>
      </div>

      {/* ✅ Table */}
      <div className={`${partnerStyle.tableContainer} mt-3`}>
        {loading && <div className={Style.muted}>{t("admin_partners.loading")}</div>}

        {!loading && partners.length === 0 ? (
          <p className="text-danger">{t("admin_partners.noPartners")}</p>
        ) : (
          !loading && (
            <table className={`${Style.tableDarkCustom} mt-3`}>
              <thead>
                <tr>
                  <th>{t("admin_partners.table.id")}</th>
                  <th>{t("admin_partners.table.name")}</th>
                  <th>{t("admin_partners.table.email")}</th>
                  <th>{t("admin_partners.table.refCode")}</th>
                  <th>{t("admin_partners.table.paypal")}</th>
                  <th>{t("admin_partners.table.clicks")}</th>
                  <th>{t("admin_partners.table.status")}</th>
                </tr>
              </thead>

              <tbody>
                {partners
                  .filter((p) => !(p.ref_code || "").trim().startsWith("not activated"))
                  .map((partner) => (
                    <tr
                      key={partner.id}
                      onClick={() => navigate(`/admin/partners/${partner.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{partner.id}</td>
                      <td>{partner.name}</td>
                      <td>{partner.email}</td>
                      <td>{partner.ref_code || "—"}</td>
                      <td>{partner.paypal_email || "—"}</td>
                      <td>{partner.clicks ?? 0}</td>
                      <td>
                        <span
                          className={
                            partner.status === "approved"
                              ? "badge bg-success"
                              : partner.status === "rejected"
                              ? "badge bg-danger"
                              : "badge bg-warning text-dark"
                          }
                        >
                          {partner.status || "—"}
                        </span>
                      </td>
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
