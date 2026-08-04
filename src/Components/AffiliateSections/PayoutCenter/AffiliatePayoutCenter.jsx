import React, { useEffect, useState } from "react";
import Style from "../../AffiliateDashboard/AffiliateDashboard.module.css";
import affiliateApi from "../../../Services/affiliateApi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function AffiliatePayoutCenter({ availableBalance }) {
  const { t } = useTranslation();

  // ✅ Form states
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("paypal"); // paypal | bank | usdt
  const [paypalEmail, setPaypalEmail] = useState("");
  const [usdtWallet, setUsdtWallet] = useState("");

  // ✅ NEW: bank fields object
  const [bank, setBank] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
    iban: "",
    swift: "",
    bank_address: "",
    country: "",
    city: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ✅ History states
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const updateBank = (key, value) => {
    setBank((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setAmount("");
    setMethod("paypal");
    setPaypalEmail("");
    setUsdtWallet("");
    setBank({
      bank_name: "",
      account_name: "",
      account_number: "",
      iban: "",
      swift: "",
      bank_address: "",
      country: "",
      city: "",
    });
  };

  const money = (v) => {
    if (v === null || v === undefined || v === "") return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return "-";
    return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
  };

  const statusClass = (s) => {
    if (s === "approved") return Style.badgeSuccess;
    if (s === "pending") return Style.badgeWarn;
    return Style.badgeDanger; // rejected
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await affiliateApi.get("/affiliate/payout-history");
      setHistory(res.data?.payout_requests || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("affiliateDashboard.errors.generic"));
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ bank validation
  const validateBank = () => {
    const must = ["bank_name", "account_name", "account_number"];

    for (const k of must) {
      if (!String(bank[k] || "").trim()) {
        toast.info(
          t("affiliateDashboard.payout.bankRequiredField", {
            field: t(`affiliateDashboard.payout.bankFields.${k}`),
          })
        );
        return false;
      }
    }

    const hasIban = String(bank.iban || "").trim();
    const hasSwift = String(bank.swift || "").trim();

    if (!hasIban && !hasSwift) {
      toast.info(t("affiliateDashboard.payout.bankNeedIbanOrSwift"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ يمنع refresh

    const amt = Number(amount);
    if (!amt || amt < 1) {
      toast.info(t("affiliateDashboard.requestPayout.invalidAmount"));
      return;
    }

    if (availableBalance !== null && availableBalance !== undefined) {
      const bal = Number(availableBalance);
      if (!Number.isNaN(bal) && amt > bal) {
        toast.error(t("affiliateDashboard.payout.exceedsBalance"));
        return;
      }
    }

    // ✅ validation by method
    if (method === "paypal") {
      if (!String(paypalEmail || "").trim()) {
        toast.info(t("affiliateDashboard.payout.fillRequired"));
        return;
      }
    }

    if (method === "usdt") {
      if (!String(usdtWallet || "").trim()) {
        toast.info(t("affiliateDashboard.payout.fillRequired"));
        return;
      }
    }

    if (method === "bank") {
      if (!validateBank()) return;
    }

    const payload = {
      amount: amt,
      method,
      ...(method === "paypal" ? { paypal_email: String(paypalEmail).trim() } : {}),
      ...(method === "usdt" ? { usdt_wallet: String(usdtWallet).trim() } : {}),
      ...(method === "bank" ? { bank_details: JSON.stringify(bank) } : {}),
    };

    try {
      setSubmitting(true);
      const res = await affiliateApi.post("/affiliate/payout/request", payload);

      if (res.data?.success) {
        toast.success(res.data?.message || t("affiliateDashboard.requestPayout.sent"));
        resetForm();
        loadHistory();
        return;
      }

      toast.error(res.data?.message || t("affiliateDashboard.errors.generic"));
    } catch (err) {
      toast.error(err?.response?.data?.message || t("affiliateDashboard.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ helper: parse bank details in history
  const parseBankDetails = (bankDetails) => {
    if (!bankDetails) return null;

    if (typeof bankDetails === "object") return bankDetails;

    if (typeof bankDetails === "string") {
      try {
        return JSON.parse(bankDetails);
      } catch {
        return null;
      }
    }

    return null;
  };

  const renderHistoryDetails = (p) => {
    if (p.method === "paypal") return p.paypal_email || "-";
    if (p.method === "usdt") return p.usdt_wallet || "-";

    // bank
    const bd = parseBankDetails(p.bank_details);

    if (!bd) return typeof p.bank_details === "string" ? p.bank_details : "-";

    const rows = [
      ["bank_name", t("affiliateDashboard.payout.bankFields.bank_name")],
      ["account_name", t("affiliateDashboard.payout.bankFields.account_name")],
      ["account_number", t("affiliateDashboard.payout.bankFields.account_number")],
      ["iban", t("affiliateDashboard.payout.bankFields.iban")],
      ["swift", t("affiliateDashboard.payout.bankFields.swift")],
      ["bank_address", t("affiliateDashboard.payout.bankFields.bank_address")],
      ["country", t("affiliateDashboard.payout.bankFields.country")],
      ["city", t("affiliateDashboard.payout.bankFields.city")],
    ].filter(([key]) => String(bd[key] || "").trim());

    if (!rows.length) return "-";

    return (
      <div style={{ display: "grid", gap: 4 }}>
        {rows.map(([key, label]) => (
          <div key={key} style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
            <strong>{label}:</strong> {bd[key]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className={`${Style.pageCard} ${Style.animScale}`} aria-label="Affiliate payout center">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <h6 className={Style.accentUnderline}>{t("affiliateDashboard.payout.centerTitle")}</h6>

        <button className={Style.btnOutlineSoft} type="button" onClick={loadHistory} disabled={loadingHistory}>
          {loadingHistory ? t("affiliateDashboard.loading") : t("affiliateDashboard.payout.refresh")}
        </button>
      </div>

      {/* ✅ Form */}
      <div className={`${Style.pageCard} p-3 mt-2`}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <div className={Style.kpi}>{t("affiliateDashboard.payout.available")}</div>
            <div className={Style.value}>{availableBalance ?? "—"}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="row g-3">
            {/* amount */}
            <div className="col-md-4">
              <input
                type="number"
                className={Style.input}
                placeholder={t("affiliateDashboard.requestPayout.amount")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
              />
            </div>

            {/* method */}
            <div className="col-md-4">
              <select className={Style.select} value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="paypal">PayPal</option>
                <option value="bank">{t("affiliateDashboard.payout.bank")}</option>
                <option value="usdt">USDT (TRC20)</option>
              </select>
            </div>

            {/* paypal */}
            {method === "paypal" && (
              <div className="col-md-4">
                <input
                  type="email"
                  className={Style.input}
                  placeholder="name@example.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
              </div>
            )}

            {/* usdt */}
            {method === "usdt" && (
              <div className="col-md-4">
                <input
                  type="text"
                  className={Style.input}
                  placeholder="TRC20 Only ..."
                  value={usdtWallet}
                  onChange={(e) => setUsdtWallet(e.target.value)}
                />
              </div>
            )}

            {/* ✅ bank fields (multiple inputs) */}
            {method === "bank" && (
              <>
                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.bank_name")}
                    value={bank.bank_name}
                    onChange={(e) => updateBank("bank_name", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.account_name")}
                    value={bank.account_name}
                    onChange={(e) => updateBank("account_name", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.account_number")}
                    value={bank.account_number}
                    onChange={(e) => updateBank("account_number", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.iban")}
                    value={bank.iban}
                    onChange={(e) => updateBank("iban", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.swift")}
                    value={bank.swift}
                    onChange={(e) => updateBank("swift", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.bank_address")}
                    value={bank.bank_address}
                    onChange={(e) => updateBank("bank_address", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.country")}
                    value={bank.country}
                    onChange={(e) => updateBank("country", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className={Style.input}
                    placeholder={t("affiliateDashboard.payout.bankPlaceholders.city")}
                    value={bank.city}
                    onChange={(e) => updateBank("city", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="d-flex justify-content-end mt-3">
            <button className={Style.btnHero} type="submit" disabled={submitting}>
              {submitting ? t("affiliateDashboard.loading") : t("affiliateDashboard.requestPayout.button")}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ History */}
      <div className={`${Style.pageCard} p-3 mt-3`}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h6 className={Style.accentUnderline}>{t("affiliateDashboard.payout.historyTitle")}</h6>
          <div className={Style.rightMuted}>
            {t("affiliateDashboard.payout.historyCount")}: {history?.length || 0}
          </div>
        </div>

        <div className={Style.tableWrap}>
          {loadingHistory && <div className={Style.loadingText}>{t("affiliateDashboard.loading")}</div>}

          {!loadingHistory && (
            <table className={Style.table}>
              <thead>
                <tr>
                  <th>{t("affiliateDashboard.payout.columns.id")}</th>
                  <th>{t("affiliateDashboard.payout.columns.amount")}</th>
                  <th>{t("affiliateDashboard.payout.columns.method")}</th>
                  <th>{t("affiliateDashboard.payout.columns.details")}</th>
                  <th>{t("affiliateDashboard.payout.columns.requestedAt")}</th>
                  <th>{t("affiliateDashboard.payout.columns.processedAt")}</th>
                  <th>{t("affiliateDashboard.payout.columns.status")}</th>
                </tr>
              </thead>

              <tbody>
                {history.map((p) => (
                  <tr key={p.id}>
                    <td className={Style.cellStrong}>#{p.id}</td>
                    <td className={Style.cellStrong}>{money(p.amount)}</td>
                    <td>{String(p.method || "").toUpperCase()}</td>

                    <td className={Style.cellMuted} style={{ maxWidth: 320, whiteSpace: "normal" }}>
                      {renderHistoryDetails(p)}
                    </td>

                    <td>{p.requested_at || p.created_at || "-"}</td>
                    <td>{p.processed_at || "-"}</td>

                    <td>
                      <span className={`${Style.badge} ${statusClass(p.status)}`}>
                        {t(`affiliateDashboard.Status.${p.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}

                {!history.length && (
                  <tr>
                    <td colSpan="7" className={Style.emptyRow}>
                      {t("affiliateDashboard.resources.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}