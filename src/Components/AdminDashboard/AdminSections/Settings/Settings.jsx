import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Style from '../../AdminDashboard.module.css';
import adminApi from '../../../../Services/adminApi';
import settingsStyle from './Settings.module.css';

export default function Settings() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const togglePlanStatus = async (id) => {
  try {
    await adminApi.patch(`/admin/plan-price/${id}/toggle`);
    fetchPlans(); // refresh data
  } catch (error) {
    setMessage(t('admin_settings.updateFailed'));
  }
};


  const [form, setForm] = useState({
    plan_name: 'pro',
    interval: 'monthly',
    amount: '',
    currency: 'usd',
    onSale: false,
    percentage: '',
    amount_before_sale: '',
  });

  const fetchPlans = () => {
    setLoading(true);
    adminApi.get('/plans/prices')
      .then(res => setPlans(res.data))
      .catch(() => setMessage(t('admin_settings.loadFailed')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const createPlan = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post('/plans/prices', form);
      setMessage(t('admin_settings.createSuccess'));
      setForm({
        plan_name: 'pro',
        interval: 'monthly',
        amount: '',
        currency: 'usd',
        onSale: false,
        percentage: '',
        amount_before_sale: '',
      });
      fetchPlans();
    } catch {
      setMessage(t('admin_settings.createFailed'));
    }
  };

  return (
    <div className={`${Style.pageCard} ${Style.animFadeSlide}`}>
      <h4 className={Style.accentUnderline}>
        {t('admin_settings.title')}
      </h4>
      <p className={Style.muted}>
        {t('admin_settings.subtitle')}
      </p>

      {message && <div className="alert alert-info mt-3">{message}</div>}
      
        {loading ? (
        <p className={Style.muted}>{t('admin_settings.loading')}</p>
      ) : (
        <div  className={settingsStyle.tableContainer}>
        <table className={Style.tableDarkCustom}>
          <thead>
            <tr className="text-center">
              <th>{t('admin_settings.plan')}</th>
              <th>{t('admin_settings.interval')}</th>
              <th>{t('admin_settings.amount')}</th>
              <th>{t('admin_settings.currency')}</th>
              <th>{t('admin_settings.onSale')}</th>
              <th>{t('admin_settings.status')}</th>
              <th>{t('admin_settings.action')}</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id} className="text-center">
                <td>{plan.plan_name}</td>
                <td>{plan.interval}</td>
                <td>{plan.amount}</td>
                <td>{plan.currency.toUpperCase()}</td>
                <td>{plan.onSale == 0 ? t('admin_settings.no') : t('admin_settings.yes')}</td>
                <td>
                    <span className={`badge ${plan.is_active ? 'bg-success' : 'bg-secondary'}`}>
                    {plan.is_active ? t('admin_settings.active') : t('admin_settings.inactive')}
                    </span>
                </td>

  {/* ACTION */}
  <td>
    <button
      className={`btn btn-sm ${plan.is_active ? 'btn-danger' : 'btn-success'}`}
      onClick={() => togglePlanStatus(plan.id)}
    >
      {plan.is_active
        ? t('admin_settings.deactivate')
        : t('admin_settings.activate')}
    </button>
  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      

      <hr className="my-4" />

      <h5>{t('admin_settings.addPlan')}</h5>

      <form onSubmit={createPlan} className="row g-3">
        <div className="col-md-3">
          <select
            className="form-control"
            value={form.plan_name}
            onChange={e => setForm({ ...form, plan_name: e.target.value })}
          >
            <option value="pro">Pro</option>
            <option value="pro_max">Pro Max</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={form.interval}
            onChange={e => setForm({ ...form, interval: e.target.value })}
          >
            <option value="monthly">{t('admin_settings.monthly')}</option>
            <option value="yearly">{t('admin_settings.yearly')}</option>
          </select>
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder={t('admin_settings.amount')}
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-control"
            value={form.currency}
            onChange={e => setForm({ ...form, currency: e.target.value })}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-control"
            value={form.onSale.toString()}
            onChange={e => setForm({ ...form, onSale: e.target.value === 'true' })}
          >
            <option value="false">{t('admin_settings.no')}</option>
            <option value="true">{t('admin_settings.onSale')}</option>
          </select>
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder={t('admin_settings.amount_before_sale')}
            value={form.amount_before_sale}
            onChange={e => setForm({ ...form, amount_before_sale: e.target.value })}
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder={t('admin_settings.percentage')}
            value={form.percentage}
            onChange={e => setForm({ ...form, percentage: e.target.value })}
          />
        </div>
        

        <div className="col-md-2">
          <button className="btn btn-primary w-100">
            {t('admin_settings.create')}
          </button>
        </div>
      </form>
    </div>
  );
}
