import React, { useEffect, useState } from 'react';
import Style from '../../AdminDashboard.module.css';
import adminApi from '../../../../Services/adminApi';
import { useTranslation } from 'react-i18next';

export default function PartnerRequests() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    adminApi.get("/affiliate/requests")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  // ✅ APPROVE
  const handleApprove = async (id) => {
    try {
      setLoadingId(id);
      await adminApi.post(`/affiliate/requests/${id}/approve`);

      setMessage({
        type: "success",
        text: t("admin_partnerRequests.messages.approved")
      });

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || t("admin_partnerRequests.messages.approveError")
      });
    } finally {
      setLoadingId(null);
    }
  };

  // ❌ REJECT
  const handleReject = async (id) => {
    if (!window.confirm(t("admin_partnerRequests.confirmReject"))) return;

    try {
      setLoadingId(id);
      await adminApi.post(`/affiliate/requests/${id}/reject`);

      setMessage({
        type: "success",
        text: t("admin_partnerRequests.messages.rejected")
      });

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || t("admin_partnerRequests.messages.rejectError")
      });
    } finally {
      setLoadingId(null);
    }
  };

  const formatDateForAdmin = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className={`${Style.pageCard} ${Style.animFadeSlide}`}>
      <h4 className={Style.accentUnderline}>
        {t("admin_partnerRequests.title")}
      </h4>

      <p className={`${Style.muted} mb-3`}>
        {t("admin_partnerRequests.subtitle")}
      </p>

      {message && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
          {message.text}
        </div>
      )}
      <div  className={Style.tableContainer}>
      <table className={Style.tableDarkCustom}>
        <thead>
          <tr>
            <th>{t("admin_partnerRequests.table.name")}</th>
            <th>{t("admin_partnerRequests.table.email")}</th>
            <th>{t("admin_partnerRequests.table.comment")}</th>
            <th>{t("admin_partnerRequests.table.requestedAt")}</th>
            <th colSpan={2} className="text-center">
              {t("admin_partnerRequests.table.action")}
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-secondary">
                {t("admin_partnerRequests.empty")}
              </td>
            </tr>
          )}

          {data.map(req => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.comment || "-"}</td>
              <td style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                {formatDateForAdmin(req.created_at)}
              </td>

              <td>
                <button
                  className="btn btn-success btn-sm"
                  disabled={loadingId === req.id}
                  onClick={() => handleApprove(req.id)}
                >
                  {loadingId === req.id ? "..." : t("admin_partnerRequests.actions.approve")}
                </button>
              </td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={loadingId === req.id}
                  onClick={() => handleReject(req.id)}
                >
                  {loadingId === req.id ? "..." : t("admin_partnerRequests.actions.reject")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
