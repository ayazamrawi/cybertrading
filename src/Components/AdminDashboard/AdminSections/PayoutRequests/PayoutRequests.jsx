import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Style from "../../AdminDashboard.module.css";
import adminApi from "../../../../Services/adminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const parseBankDetails = (bd) => {
  if (!bd) return null;
  if (typeof bd === "object") return bd;

  if (typeof bd === "string") {
    try {
      const obj = JSON.parse(bd);
      return typeof obj === "object" ? obj : { raw: bd };
    } catch {
      return { raw: bd };
    }
  }

  return { raw: String(bd) };
};

const BankDetailsView = ({ item, t }) => {
  const bd = parseBankDetails(item.bank_details);
  if (!bd) return <span>—</span>;

  const rows = [
    ["bank_name", bd.bank_name],
    ["account_name", bd.account_name],
    ["account_number", bd.account_number],
    ["iban", bd.iban],
    ["swift", bd.swift],
    ["bank_address", bd.bank_address],
    ["country", bd.country],
    ["city", bd.city],
  ].filter(([, v]) => v && String(v).trim());

  if (!rows.length && bd.raw) {
    return <div className={Style.payoutRawText}>{bd.raw}</div>;
  }

  return (
    <div className={Style.payoutBankCard}>
      {rows.map(([k, v]) => (
        <div key={k} className={Style.payoutBankRow}>
          <div className={Style.payoutBankLabel}>
            {t(`admin_payoutRequests.bankFields.${k}`)}:
          </div>
          <div className={Style.payoutBankValue} title={String(v)}>
            {String(v)}
          </div>
        </div>
      ))}
    </div>
  );
};

function payoutDetails(item, t) {
  if (item.method === "paypal") {
    return (
      <div className={`${Style.payoutPillBox} ${Style.payoutPillPaypal}`}>
        <span className={Style.payoutWrapText}>{item.paypal_email || "—"}</span>
      </div>
    );
  }

  if (item.method === "usdt") {
    return (
      <div className={`${Style.payoutPillBox} ${Style.payoutPillUsdt}`}>
        <span className={Style.payoutWrapText}>{item.usdt_wallet || "—"}</span>
      </div>
    );
  }

  return <BankDetailsView item={item} t={t} />;
}

export default function PayoutRequests() {
  const { t } = useTranslation();

  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [method, setMethod] = useState("all");

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [notes, setNotes] = useState({});

  const navigate = useNavigate();

  const goPartner = (item) => {
    const affiliateId = item.affiliate_id || item.affiliate?.id;
    if (!affiliateId) return;
    navigate(`/admin/partners/${affiliateId}`);
  };

  const stopRowClick = (e) => {
    e.stopPropagation();
  };

  const historyParams = useMemo(() => {
    const p = { status: "approved,rejected" };
    if (search.trim()) p.search = search.trim();
    if (filter !== "all") p.filter = filter;
    if (method !== "all") p.method = method;
    if (from && to) {
      p.from = from;
      p.to = to;
    }
    return p;
  }, [search, filter, from, to, method]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [pendingRes, historyRes] = await Promise.all([
        adminApi.get("/admin/payout-requests"),
        adminApi.get("/admin/payouts", { params: historyParams }),
      ]);

      setPending(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setHistory(historyRes.data?.payout_requests || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("admin_payoutRequests.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyParams]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoadingId(id);

      await adminApi.patch(`/admin/payout/${id}`, {
        status,
        admin_note: notes[id] || null,
      });

      toast.success(t("admin_payoutRequests.updateSuccess", { status }));

      setPending((prev) => prev.filter((x) => x.id !== id));

      const historyRes = await adminApi.get("/admin/payouts", { params: historyParams });
      setHistory(historyRes.data?.payout_requests || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("admin_payoutRequests.actionFailed"));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className={`${Style.pageCard} ${Style.animFadeSlide}`}>
      <h4 className={Style.accentUnderline}>{t("admin_payoutRequests.title")}</h4>
      <p className={`${Style.muted} mb-3`}>{t("admin_payoutRequests.subtitle")}</p>

      {loading && <div className={Style.muted}>{t("admin_payoutRequests.loading")}</div>}

      {/* ===================== PENDING ===================== */}
      <div className="mt-3">
        <h6 className={Style.accentUnderline}>{t("admin_payoutRequests.pendingTitle")}</h6>

        <div className={Style.tableContainer}>
          <table className={Style.tableDarkCustom}>
            <thead>
              <tr>
                <th>{t("admin_payoutRequests.table.affiliate")}</th>
                <th>{t("admin_payoutRequests.table.email")}</th>
                <th>{t("admin_payoutRequests.table.amount")}</th>
                <th>{t("admin_payoutRequests.table.method")}</th>
                <th>{t("admin_payoutRequests.table.details")}</th>
                <th>{t("admin_payoutRequests.table.balancecurrent")}</th>
                <th>{t("admin_payoutRequests.table.requestedAt")}</th>
                <th>{t("admin_payoutRequests.table.adminNote")}</th>
                <th className="text-center" colSpan={2}>
                  {t("admin_payoutRequests.table.action")}
                </th>
              </tr>
            </thead>

            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-secondary">
                    {t("admin_payoutRequests.emptyPending")}
                  </td>
                </tr>
              ) : (
                pending.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => goPartner(item)}
                    style={{ cursor: item.affiliate_id || item.affiliate?.id ? "pointer" : "default" }}
                  >
                    <td className={Style.payoutCellTop}>
                      <div className={Style.payoutNameCell}>{item.affiliate?.name || "—"}</div>
                    </td>

                    {/* ✅ مهم: الإيميل من غير anywhere */}
                    <td className={Style.payoutCellTop}>
                      <div className={Style.payoutEmailCell}>
                        {item.affiliate?.email || "—"}
                      </div>
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutMoneyCell}`}>
                      ${Number(item.amount).toFixed(2)}
                    </td>

                    <td className={Style.payoutCellTop}>
                      <span className={`${Style.payoutMethodBadge} text-uppercase`}>
                        {item.method}
                      </span>
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutDetailsCell}`}>
                      {payoutDetails(item, t)}
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutMoneyCell}`}>
                      ${Number(item.balance_before ?? 0).toFixed(2)}
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutDateCell}`}>
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
                    </td>

                    <td className={Style.payoutCellTop}>
                      <div className={Style.payoutNoteCell}>
                        <input
                          className={Style.inputSoft}
                          value={notes[item.id] || ""}
                          onClick={stopRowClick}
                          onChange={(e) => {
                            stopRowClick(e);
                            setNotes((p) => ({ ...p, [item.id]: e.target.value }));
                          }}
                          placeholder={t("admin_payoutRequests.notePlaceholder")}
                        />
                      </div>
                    </td>

                    <td className={Style.payoutCellTop}>
                      <button
                        className={`btn btn-success btn-sm ${Style.payoutActionBtn}`}
                        disabled={actionLoadingId === item.id}
                        onClick={(e) => {
                          stopRowClick(e);
                          updateStatus(item.id, "approved");
                        }}
                      >
                        {actionLoadingId === item.id ? "..." : t("admin_payoutRequests.approve")}
                      </button>
                    </td>

                    <td className={Style.payoutCellTop}>
                      <button
                        className={`btn btn-danger btn-sm ${Style.payoutActionBtn}`}
                        disabled={actionLoadingId === item.id}
                        onClick={(e) => {
                          stopRowClick(e);
                          updateStatus(item.id, "rejected");
                        }}
                      >
                        {actionLoadingId === item.id ? "..." : t("admin_payoutRequests.reject")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== HISTORY ===================== */}
      <div className="mt-4">
        <h6 className={Style.accentUnderline}>{t("admin_payoutRequests.historyTitle")}</h6>

        <div className="mt-3">
          <input
            className={Style.inputSoft}
            style={{ width: "100%" }}
            placeholder={t("admin_payoutRequests.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="row gx-5 align-items-end mt-2">
          <div className="col-lg-3 col-md-4">
            <select className={Style.inputSoft} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">{t("admin_payoutRequests.filters.all")}</option>
              <option value="this_month">{t("admin_payoutRequests.filters.this_month")}</option>
              <option value="last_month">{t("admin_payoutRequests.filters.last_month")}</option>
              <option value="last_3_months">{t("admin_payoutRequests.filters.last_3_months")}</option>
              <option value="last_6_months">{t("admin_payoutRequests.filters.last_6_months")}</option>
            </select>
          </div>

          <div className="col-lg-3 col-md-4">
            <select className={Style.inputSoft} value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="all">{t("admin_payoutRequests.methods.all")}</option>
              <option value="paypal">{t("admin_payoutRequests.methods.paypal")}</option>
              <option value="bank">{t("admin_payoutRequests.methods.bank")}</option>
              <option value="usdt">{t("admin_payoutRequests.methods.usdt")}</option>
            </select>
          </div>

          <div className="col-lg-4 col-md-4 mt-2 mt-md-0">
            <label className={`${Style.muted} pe-3 pe-md-3`} style={{ fontSize: ".8rem" }}>
              {t("admin_payoutRequests.from")}
            </label>
            <input type="date" className={Style.inputSoft} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div className="col-lg-3 col-md-4 mt-2 mt-md-0">
            <label className={`${Style.muted} pe-3 pe-md-3`} style={{ fontSize: ".8rem" }}>
              {t("admin_payoutRequests.to")}
            </label>
            <input type="date" className={Style.inputSoft} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div className="col-lg-3 col-md-12">
            <button
              className={Style.btnHero}
              style={{ width: "100%" }}
              onClick={() => {
                setSearch("");
                setFilter("all");
                setMethod("all");
                setFrom("");
                setTo("");
              }}
            >
              {t("admin_payoutRequests.clear")}
            </button>
          </div>
        </div>

        <div className={`${Style.tableContainer} mt-3`}>
          <table className={Style.tableDarkCustom}>
            <thead>
              <tr>
                <th>{t("admin_payoutRequests.table.affiliate")}</th>
                <th>{t("admin_payoutRequests.table.email")}</th>
                <th>{t("admin_payoutRequests.table.amount")}</th>
                <th>{t("admin_payoutRequests.table.method")}</th>
                <th>{t("admin_payoutRequests.table.details")}</th>
                <th>{t("admin_payoutRequests.table.status")}</th>
                <th>{t("admin_payoutRequests.table.balanceBefore")}</th>
                <th>{t("admin_payoutRequests.table.balanceAfter")}</th>
                <th>{t("admin_payoutRequests.table.adminNote")}</th>
                <th>{t("admin_payoutRequests.table.processedAt")}</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-secondary">
                    {t("admin_payoutRequests.emptyHistory")}
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} onClick={() => goPartner(item)} style={{ cursor: "pointer" }}>
                    <td className={`${Style.payoutCellTop} ${Style.payoutNameCell}`}>
                      {item.affiliate?.name || "—"}
                    </td>

                    {/* ✅ FIX: mixWidth كانت typo */}
                    <td className={Style.payoutCellTop}>
                      <div className={Style.payoutEmailCell}>
                        {item.affiliate?.email || "—"}
                      </div>
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutMoneyCell}`}>
                      ${Number(item.amount).toFixed(2)}
                    </td>

                    <td className={Style.payoutCellTop}>
                      <span className={`${Style.payoutMethodBadge} text-uppercase`}>
                        {item.method}
                      </span>
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutDetailsCell}`}>
                      {payoutDetails(item, t)}
                    </td>

                    <td className={Style.payoutCellTop}>
                      <span
                        className={
                          item.status === "approved"
                            ? "badge bg-success"
                            : item.status === "rejected"
                            ? "badge bg-danger"
                            : "badge bg-warning text-dark"
                        }
                        style={{ minWidth: 82, textTransform: "capitalize" }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutMoneyCell}`}>
                      ${Number(item.balance_before ?? 0).toFixed(2)}
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutMoneyCell}`}>
                      {item.balance_after == null ? "—" : `$${Number(item.balance_after).toFixed(2)}`}
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutDetailsCell}`}>
                      <div className={item.admin_note ? Style.payoutNoteBox : ""}>
                        {item.admin_note || "—"}
                      </div>
                    </td>

                    <td className={`${Style.payoutCellTop} ${Style.payoutDateCell}`}>
                      {item.processed_at ? new Date(item.processed_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}