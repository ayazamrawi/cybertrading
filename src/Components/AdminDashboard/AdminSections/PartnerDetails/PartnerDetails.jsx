import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import adminApi from "../../../../Services/adminApi";
import Style from "../../AdminDashboard.module.css";
import LoadingScreen from "../../../LoadingScreen/LoadingScreen";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function PartnerDetails() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [affiliate, setAffiliate] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Custom Commission states
  const [commissionInput, setCommissionInput] = useState(""); // string: "" => null
  const [savingCommission, setSavingCommission] = useState(false);

  const updateEarningStatus = async (earningId, newStatus) => {
    try {
      await adminApi.patch(`/affiliate/earnings/${earningId}/status`, {
        status: newStatus,
      });

      setEarnings((prev) =>
        prev.map((e) => (e.id === earningId ? { ...e, status: newStatus } : e))
      );

      // بدل alert
      toast.success(t("admin_partnerDetails.statusUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(t("admin_partnerDetails.statusUpdateFailed"));
    }
  };

  // ✅ validate commission
  const isCommissionValid = () => {
    if (commissionInput === "") return true; // empty => null
    const n = Number(commissionInput);
    return !Number.isNaN(n) && n >= 0 && n <= 100;
  };

  // ✅ Save commission (PATCH /admin/affiliate/{id}/commission)
  const saveCommission = async () => {
    if (!isCommissionValid()) {
      toast.error(t("admin_partnerDetails.commission.invalidRange"));
      return;
    }

    const payload = {
      custom_commission: commissionInput === "" ? null : Number(commissionInput),
    };

    try {
      setSavingCommission(true);
      const res = await adminApi.patch(`/admin/affiliate/${id}/commission`, payload);

      toast.success(res.data?.message || t("admin_partnerDetails.commission.saved"));

      // Update UI
      setAffiliate((prev) => ({
        ...(prev || {}),
        custom_commission: payload.custom_commission,
      }));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || t("admin_partnerDetails.commission.saveFailed")
      );
    } finally {
      setSavingCommission(false);
    }
  };

  // ✅ Reset commission to null
  const resetCommission = async () => {
    try {
      setSavingCommission(true);
      const res = await adminApi.patch(`/admin/affiliate/${id}/commission`, {
        custom_commission: null,
      });

      toast.success(res.data?.message || t("admin_partnerDetails.commission.resetDone"));

      setCommissionInput("");
      setAffiliate((prev) => ({
        ...(prev || {}),
        custom_commission: null,
      }));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || t("admin_partnerDetails.commission.saveFailed")
      );
    } finally {
      setSavingCommission(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [refRes, earnRes] = await Promise.all([
          adminApi.get(`/affiliate/${id}/referrals`),
          adminApi.get(`/affiliate/${id}/earnings`),
        ]);

        const aff = refRes.data.affiliate || null;

        setReferrals(refRes.data.referrals || []);
        setEarnings(earnRes.data.earnings || []);
        setTotalEarnings(earnRes.data.total || 0);
        setAffiliate(aff);

        // ✅ init commission input from affiliate
        if (aff?.custom_commission === null || aff?.custom_commission === undefined) {
          setCommissionInput("");
        } else {
          setCommissionInput(String(aff.custom_commission));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!affiliate) return null;

  return (
    <section className={Style.containerMax}>
      <div className={`${Style.pageCard} ${Style.MainCard} ${Style.animFadeSlide}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className={Style.accentUnderline}>
            {affiliate.name} {t("admin_partnerDetails.details")}
          </h4>
          <Link to="/adminDashboard" className="btn btn-outline-light btn-sm">
            ← {t("admin_partnerDetails.back")}
          </Link>
        </div>

        <p className={Style.muted}>
          {t("admin_partnerDetails.id")}: {affiliate.id}
        </p>
        <p className={Style.muted}>
          {t("admin_partnerDetails.email")}: {affiliate.email}
        </p>

        {/* ✅ Custom Commission Box (الجديد) */}
        <div className={`${Style.pageCard} p-3 mt-3`}>
          <h6 className={Style.accentUnderline}>
            {t("admin_partnerDetails.commission.title")}
          </h6>

          <p className={Style.muted} style={{ marginBottom: ".75rem" }}>
            {t("admin_partnerDetails.commission.subtitle")}
          </p>

          <div className="row g-2 align-items-end">
            <div className="col-lg-5 col-md-6">
              <label className={`${Style.muted} pe-3`} style={{ fontSize: ".85rem" }}>
                {t("admin_partnerDetails.commission.label")}
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                className={Style.inputSoft}
                placeholder={t("admin_partnerDetails.commission.placeholder")}
                value={commissionInput}
                onChange={(e) => setCommissionInput(e.target.value)}
                disabled={savingCommission}
              />

              {!isCommissionValid() && (
                <div className="text-danger small mt-1">
                  {t("admin_partnerDetails.commission.invalidRange")}
                </div>
              )}
            </div>

            <div className="col-lg-3 col-md-3">
              <button
                className={Style.btnHero}
                onClick={saveCommission}
                disabled={savingCommission || !isCommissionValid()}
                style={{ width: "100%" }}
              >
                {savingCommission ? "..." : t("admin_partnerDetails.commission.actions.save")}
              </button>
            </div>

            <div className="col-lg-4 col-md-3">
              <button
                className="btn btn-outline-light"
                onClick={resetCommission}
                disabled={savingCommission}
                style={{ width: "100%" }}
              >
                {savingCommission ? "..." : t("admin_partnerDetails.commission.actions.reset")}
              </button>
            </div>
          </div>

          <div className="mt-3">
            <span className={Style.muted}>
              {t("admin_partnerDetails.commission.current")}
            </span>{" "}
            <strong>
              {affiliate.custom_commission === null ||
              affiliate.custom_commission === undefined
                ? "—"
                : `${affiliate.custom_commission}%`}
            </strong>
          </div>
        </div>

        {/* REFERRALS */}
        <h5 className="mt-4">{t("admin_partnerDetails.referrals")}</h5>

        {referrals.length === 0 ? (
          <p className="text-danger">{t("admin_partnerDetails.noReferrals")}</p>
        ) : (
          <div className={Style.tableContainer} >
          <table className={Style.tableDarkCustom}>
            <thead>
              <tr>
                <th>{t("admin_partnerDetails.user")}</th>
                <th>{t("admin_partnerDetails.email")}</th>
                <th>{t("admin_partnerDetails.subscribed")}</th>
                <th>{t("admin_partnerDetails.joinedAt")}</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id}>
                  <td>{ref.name}</td>
                  <td>{ref.email}</td>
                  <td>
                    {ref.subscription ? (
                      <span className="badge bg-success">
                        {t("admin_partnerDetails.yes")}
                      </span>
                    ) : (
                      <span className="badge bg-secondary">
                        {t("admin_partnerDetails.no")}
                      </span>
                    )}
                  </td>
                  <td>{new Date(ref.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>  
        )}

        {/* EARNINGS */}
        <h5 className="mt-5">{t("admin_partnerDetails.earnings")}</h5>

        <div className="mb-2">
          <strong>{t("admin_partnerDetails.total")}:</strong>{" "}
          <span className="text-success">{totalEarnings}</span>
        </div>

        {earnings.length === 0 ? (
          <p className="text-danger">{t("admin_partnerDetails.noEarnings")}</p>
        ) : (
        <div className={Style.tableContainer} >  
          <table className={Style.tableDarkCustom}>
            <thead>
              <tr>
                <th>{t("admin_partnerDetails.email")}</th>
                <th>{t("admin_partnerDetails.deposit")}</th>
                <th>{t("admin_partnerDetails.percentage")}</th>
                <th>{t("admin_partnerDetails.amount")}</th>
                <th>{t("admin_partnerDetails.status")}</th>
                <th>{t("admin_partnerDetails.date")}</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((e) => (
                <tr key={e.id}>
                  <td>{e.user?.email}</td>
                  <td className="text-center">{e.deposit_amount}</td>
                  <td className="text-center">{e.percentage}%</td>
                  <td className="text-center">{e.amount}</td>
                  <td>
                    <select
                      className={`form-select form-select-sm text-white ${
                        e.status === "approved"
                          ? "bg-success"
                          : e.status === "pending"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      value={e.status}
                      onChange={(ev) => updateEarningStatus(e.id, ev.target.value)}
                    >
                      <option value="pending">{t("admin_partnerDetails.pending")}</option>
                      <option value="approved">{t("admin_partnerDetails.approved")}</option>
                      <option value="rejected">{t("admin_partnerDetails.rejected")}</option>
                    </select>
                  </td>

                  <td>{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </section>
  );
}
