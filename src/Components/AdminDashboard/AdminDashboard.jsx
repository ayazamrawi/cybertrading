import React, { useState } from 'react';
import Style from './AdminDashboard.module.css';
import Analytics from './AdminSections/Analytics/Analytics';
import Users from './AdminSections/Users/Users';
import Partners from './AdminSections/Partners/Partners';
import Settings from './AdminSections/Settings/Settings';
import adminApi from "../../Services/adminApi";
import PartnerRequests from './AdminSections/PartnerRequests/PartnerRequests';
import Subscriptions from './AdminSections/Subscriptions/Subscriptions';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PayoutRequests from './AdminSections/PayoutRequests/PayoutRequests';


export default function AdminDashboard() {
    const [activePage, setActivePage] = useState('analytics');
    const [data, setData] = useState(null);
    const { t } = useTranslation();
    useEffect(() => {
    adminApi.get("/admin/dashboard")
        .then(res => setData(res.data))
    }, []);
    

const renderContent = () => {
    switch (activePage) {
        case 'users':
            return <Users/>;
        case 'partners':
            return <Partners />;
        case 'PartnerRequests':
            return <PartnerRequests />;
        case 'subscriptions':
            return <Subscriptions />;
        case 'settings':
            return <Settings />;
        case 'payouts':
            return <PayoutRequests />;
        default:
            const stats = data?.stats ?? {};
        const subs = data?.recent_subscriptions ?? [];
        const users=data?.recent_users || []

        return <Analytics subscriptions={subs} status={stats} users={users}/>;;
    }};
    return (
        <div className={Style.containerMax}>
            <section className={`${Style.pageCard} ${Style.MainCard} ${Style.animFadeSlide}`} id="admin" aria-label="Admin dashboard">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className={Style.pageTitle}>{t("admin.title")}</h3>
                    <div >
                        <h2 className={Style.kpi}>{t("admin.hello", { name: "Abdullah" })} 👋🏻</h2>
                    </div>
                </div>

                <div className="row">
                    {/* Sidebar Menu */}
                    <div className="col-lg-3 col-md-4 mb-3">
                        <div className={`${Style.pageCard} p-3 ${Style.glowHover} ${Style.animSlideRight}`}>
                            <h6 className={Style.muted}>{t("admin.sideMenu")}</h6>
                            <div className="mt-3">
                                <div className={Style.menuItem} onClick={() => setActivePage('analytics')}>
    <i className="fa-solid fa-chart-line"></i>
    <span>{t("admin.menu.analytics")}</span>
</div>

<div className={Style.menuItem} onClick={() => setActivePage('users')}>
    <i className="fa-solid fa-users"></i>
    <span>{t("admin.menu.users")}</span>
</div>

<div className={Style.menuItem} onClick={() => setActivePage('PartnerRequests')}>
    <i className="fa-solid fa-user-clock"></i>
    <span>{t("admin.menu.partnerRequests")}</span>
</div>

<div className={Style.menuItem} onClick={() => setActivePage('partners')}>
    <i className="fa-solid fa-handshake"></i>
     <span>{t("admin.menu.partners")}</span>
</div>

<div className={Style.menuItem} onClick={() => setActivePage('subscriptions')}>
    <i className="fa-solid fa-money-bill-trend-up"></i>
    <span>{t("admin.menu.subscriptions")}</span>
</div>

<div className={Style.menuItem} onClick={() => setActivePage('settings')}>
    <i className="fa-solid fa-gear"></i>
    <span>{t("admin.menu.settings")}</span>
</div>

<div className={Style.menuItem} onClick={() => setActivePage('payouts')}>
  <i className="fa-solid fa-hand-holding-dollar"></i>
  <span>{t("admin.menu.payoutrequests")}</span>
</div>

                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9 col-md-8">
                        {renderContent()}
                    </div>
                </div>
            </section>
        </div>
    );
}