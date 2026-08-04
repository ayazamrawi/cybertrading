import React, { useEffect, useState } from 'react';
import Style from './UserDashboard.module.css';
import tradingviewicon from '../../Assets/Images/white-short-logo.png';
import userApi from '../../Services/userApi';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function UserDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [invoices, setInvoices] = useState([]);
const [loadingCancel, setLoadingCancel] = useState(false);
const [invoiceLoading, setInvoiceLoading] = useState(false);
const [actionMessage, setActionMessage] = useState(null);
const navigate = useNavigate();
const [tvEditing, setTvEditing] = useState(false);
const [tvUsername, setTvUsername] = useState("");
const [tvLoading, setTvLoading] = useState(false);
const [tvMsg, setTvMsg] = useState(null);



const cancelSubscription = async () => {
  try {
    setLoadingCancel(true);

    const res = await userApi.post('/subscription/cancel');

    setActionMessage({
      type: 'success',
      text: res.data.message || 'Subscription will be canceled'
    });

    // refresh user data
    const userRes = await userApi.get('/user');
    setData(userRes.data);

  } catch (err) {
    setActionMessage({
      type: 'danger',
      text: err.response?.data?.error || 'Cancel failed'
    });
  } finally {
    setLoadingCancel(false);
  }
};

const fetchInvoices = async () => {
  try {
    setInvoiceLoading(true);
    const res = await userApi.get("/invoices");

    const list = Array.isArray(res.data) ? res.data : [];

    if (list.length === 0) {
      toast.info(
        ({ closeToast }) => (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {/* Icon */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                fontSize: 18,
                border: "1px solid rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            >
              🧾
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                {t("invoicesToast.title")}
              </div>

              <div style={{ opacity: 0.9, fontSize: 13, lineHeight: 1.4, marginBottom: 10 }}>
                {t("invoicesToast.text")}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    closeToast?.();
                    navigate("/Pricing");
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 800,
                    flex: 1,
                  }}
                >
                  {t("invoicesToast.primary")}
                </button>

                <button
                  onClick={closeToast}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    fontWeight: 700,
                    color: "inherit",
                  }}
                >
                  {t("invoicesToast.secondary")}
                </button>
              </div>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          icon: false,
          style: {
            background: "rgba(20, 24, 32, 0.92)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
            color: "#fff",
            backdropFilter: "blur(10px)",
          },
        }
      );

      setInvoices([]);
      return;
    }

    setInvoices(list);
  } catch (err) {
    console.error(err);
    toast.error(t("paymentSuccess.error") || "Failed to load invoices");
  } finally {
    setInvoiceLoading(false);
  }
};

const saveTradingViewUsername = async () => {
  try {
    setTvLoading(true);
    setTvMsg(null);

    const usernameTrimmed = tvUsername.trim();

    if (!usernameTrimmed) {
      setTvMsg({ type: "danger", text: t("Userdashboard.tv.empty") });
      return;
    }

    // لو عنده username قبل كده -> update
    if (data?.user?.username) {
      const res = await userApi.put("/tv-username/update", { username: usernameTrimmed });
      setTvMsg({ type: "success", text: res.data?.message || t("Userdashboard.tv.updated") });
    } else {
      // لو مفيش -> add
      const res = await userApi.post("/tv-username/add", { username: usernameTrimmed });
      setTvMsg({ type: "success", text: res.data?.message || t("Userdashboard.tv.added") });
    }

    // Refresh user data
    const userRes = await userApi.get("/user");
    setData(userRes.data);
    setTvUsername(userRes.data?.user?.username || "");
    setTvEditing(false);

  } catch (err) {
    setTvMsg({
      type: "danger",
      text: err.response?.data?.error || t("Userdashboard.tv.failed")
    });
  } finally {
    setTvLoading(false);
  }
};




  useEffect(() => {
  userApi.get("/user")
    .then(res => {
      setData(res.data);
      setTvUsername(res.data?.user?.username || "");
    })
    .catch(err => console.log(err));
}, []);

  return (
    <div className={Style.containerMax}>
      <section
        className={`${Style.pageCard} ${Style.animSlideLeft} ${Style.MainCard}`}
        id="user"
        aria-label={t("Userdashboard.aria")}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className={Style.pageTitle}>{t("Userdashboard.title")}</h3>
          <div className={Style.muted}>
            {t("Userdashboard.welcome")} <strong>{data?.user.name}</strong>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-4 mb-3">
            <div className={`${Style.pageCard} p-3 ${Style.glowHover}`}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className={Style.muted}>{t("Userdashboard.accountInfo")}</div>
                </div>
                <i className={`fa-solid fa-user-gear fa-2x ${Style.muted}`}></i>
              </div>

              <div className="mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <p>{t("Userdashboard.email")}</p>
                  <p className="text-secondary">{data?.user.email}</p>
                </div>

                <div className="d-flex align-items-center justify-content-between pb-4">
                  <div>
                  <img src={tradingviewicon} alt="Trading view icon" width={30} />
                  <span className="ps-2">{t("Userdashboard.tradingView")}</span>
                  </div>
                  <div className="text-secondary text-end">
  {data?.user?.username ? data.user.username : ""}
</div>



                </div>

                {/* ✅ Buttons logic */}
<div className="mt-3">

  {/* 1) لو مفيش اشتراك -> Subscribe Now */}
  {data?.subscriptions?.length === 0 && (
    <Link to="/Pricing">
      <button className={Style.btnHero}>
        {t("Userdashboard.subscribe")}
      </button>
    </Link>
  )}

  {/* 2) لو مشترك */}
  {data?.subscriptions?.length > 0 && (
    <>
      {/* لو مفيش username -> Add */}
      {!data?.user?.username && !tvEditing && (
        <button className={Style.btnHero} onClick={() => setTvEditing(true)}>
          {t("Userdashboard.tv.addBtn")}
        </button>
      )}

      {/* لو فيه username -> Update */}
      {data?.user?.username && !tvEditing && (
        <button className={Style.btnHero} onClick={() => setTvEditing(true)}>
          {t("Userdashboard.tv.updateBtn")}
        </button>
      )}

      {/* editor (input) */}
      {tvEditing && (
        <div className="mt-3">
          <input
            className={Style.formControl}
            type="text"
            value={tvUsername}
            onChange={(e) => setTvUsername(e.target.value)}
            placeholder={t("Userdashboard.tv.placeholder")}
          />

          <div className="d-flex gap-2 mt-2">
            <button
              className={Style.btnHero}
              onClick={saveTradingViewUsername}
              disabled={tvLoading}
            >
              {tvLoading ? t("Userdashboard.tv.saving") : t("Userdashboard.tv.save")}
            </button>

            <button
              className={Style.btnOutlineSoft}
              onClick={() => {
                setTvEditing(false);
                setTvUsername(data?.user?.username || "");
                setTvMsg(null);
              }}
              disabled={tvLoading}
            >
              {t("Userdashboard.tv.cancel")}
            </button>
          </div>

          {tvMsg && (
            <div className={`alert alert-${tvMsg.type} mt-3 mb-0`}>
              {tvMsg.text}
            </div>
          )}
        </div>
      )}
    </>
  )}
</div>
              </div>
            </div>
          </div>
          



          <div className="col-md-8 mb-3">
            <div className={`${Style.pageCard} p-3 ${Style.animFadeSlide}`}>
              <h5 className={Style.accentUnderline}>{t("Userdashboard.billing")}</h5>

              <div className={Style.wrapper}>
                <h2 className={Style.title}>{t("Userdashboard.billingHistory")}</h2>
                <div className={Style.tableContainer}>
                <div className={Style.tableCard}>
                  <table className={Style.table}>
                    <thead>
                      <tr>
                        <th>{t("Userdashboard.table.date")}</th>
                        <th>{t("Userdashboard.table.endAt")}</th>
                        <th>{t("Userdashboard.table.product")}</th>
                        <th>{t("Userdashboard.table.status")}</th>
                        <th>{t("Userdashboard.table.total")}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.subscriptions.map((subscription, index) => (
                        <tr key={index}>
                          <td>{new Date(subscription.created_at).toLocaleDateString()}</td>
                          <td>{new Date(subscription.expired_at).toLocaleDateString()}</td>
                          <td>
                            {subscription.plan_price.plan_name} / {subscription.plan_price.interval}
                          </td>
                          <td>
                            <span
                              className={`${Style.status} ${
                                subscription.status === "active"
                                  ? Style.paid
                                  : Style.void
                              }`}
                            >
                              {t(`Userdashboard.status.${subscription.status}`)}
                            </span>
                          </td>
                          <td>
                            {subscription.plan_price.amount} {subscription.plan_price.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
              {actionMessage && (
  <div className={`alert alert-${actionMessage.type}`}>
    {actionMessage.text}
  </div>
)}
<div className="d-flex gap-2 mb-3">
  <button
    className="btn btn-outline-danger"
    disabled={loadingCancel}
    onClick={cancelSubscription}
  >
    {loadingCancel ? t("Userdashboard.canceling") : t("Userdashboard.cancelSubscription")}
  </button>

  <button
    className="btn btn-outline-primary"
    disabled={invoiceLoading}
    onClick={fetchInvoices}
  >
    {invoiceLoading ? t("Userdashboard.loading") : t("Userdashboard.viewInvoices")}
  </button>
</div>
            </div>
          </div>
        </div>

        {invoices.length > 0 && (
  <div className="mt-4">
    <h5>{t("Userdashboard.invoices")}</h5>
    <div className={Style.tableContainer}>

    
    <table className={Style.table}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map(inv => (
          <tr key={inv.id}>
            <td>{new Date(inv.created * 1000).toLocaleDateString()}</td>
            <td>{inv.amount_paid / 100} {inv.currency.toUpperCase()}</td>
            <td>{inv.status}</td>
            <td className={Style.muted}>
              <a
                className={`fw-semibold text-secondary`}
                href={inv.invoice_pdf}
                target="_blank"
                rel="noreferrer"
              >
                View 
                <i class="fa-solid fa-up-right-from-square ps-1"></i>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div >
  </div>
)}


        <h2 className={Style.helpTitle}>{t("Userdashboard.needHelp")}</h2>

        <div className={Style.supportGrid}>
          <div className={Style.helpBox}>
            <div className={Style.icon}>?</div>
            <div>
              <h4>{t("Userdashboard.questions.title")}</h4>
              <p>
                {t("Userdashboard.questions.text")}{" "}
                <Link to={'/support'}>{t("Userdashboard.questions.link")}</Link>.
              </p>
            </div>
          </div>

          <div className={Style.supportBox}>
            <h4>{t("Userdashboard.support.title")}</h4>
            <p>{t("Userdashboard.support.text")}</p>
            <Link to={'/support'}>
            <button className={Style.supportBtn}>
              {t("Userdashboard.support.button")}
            </button>
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
}
