import { OrdersTable } from './components/OrdersTable.jsx';
import { InquiryList } from './components/InquiryList.jsx';
import { money } from './utils/format.js';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldCheck,
  Users,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { brand } from '../../config/brand.js';
import { useAuth, dashboardPath } from '../auth/AuthContext.jsx';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { section } = useParams();
  const tab = section || 'overview';
  const setTab = (value) => {
    setEditing(null);
    navigate(
      value === 'overview'
        ? dashboardPath(user.role)
        : `${dashboardPath(user.role)}/${value}`,
    );
  };
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);
  const staff = user.role !== 'user';
  const superadmin = user.role === 'superadmin';
  async function refresh() {
    setBusy(true);
    setError('');
    try {
      setData(await api(`/dashboard/${user.role}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    refresh();
  }, [user.role]);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api(`/users/${editing.id}`, {
        method: 'PUT',
        body: {
          name: editing.name,
          email: editing.email,
          ...(superadmin ? { role: editing.role } : {}),
        },
      });
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const orders = data?.orders || [];
  const users = data?.users || [];
  const paid = orders.filter((o) =>
    ['paid', 'completed', 'succeeded'].includes(o.status),
  );
  const pending = orders.filter((o) => o.status === 'pending');
  const filtered = (items) =>
    items.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase()),
      ),
    );
  const metrics = [
    {
      label: staff ? 'Client accounts' : 'Your orders',
      value: staff ? users.filter((u) => u.role === 'user').length : orders.length,
      icon: Users,
      detail: staff ? 'Registered customer accounts' : 'All plan requests',
    },
    {
      label: staff ? 'Confirmed revenue' : 'Confirmed spend',
      value: money(paid.reduce((sum, o) => sum + Number(o.amount), 0)),
      icon: CreditCard,
      detail: 'Confirmed orders only',
    },
    {
      label: 'Awaiting payment',
      value: pending.length,
      icon: Activity,
      detail: `${money(pending.reduce((sum, o) => sum + Number(o.amount), 0))} in pending orders`,
    },
    {
      label: superadmin ? 'Team members' : 'Plans ordered',
      value: superadmin
        ? users.filter((u) => u.role !== 'user').length
        : new Set(orders.map((o) => o.plan_name)).size,
      icon: ShieldCheck,
      detail: superadmin ? 'Admins and superadmins' : 'Distinct plans in your orders',
    },
  ];
  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'orders', name: 'Orders & billing', icon: CreditCard },
    ...(staff ? [{ id: 'clients', name: 'Client directory', icon: Users }] : []),
    ...(staff ? [{ id: 'inquiries', name: 'Inquiries', icon: Search }] : []),
    ...(superadmin ? [{ id: 'team', name: 'Team & access', icon: ShieldCheck }] : []),
  ];
  if (!tabs.some((item) => item.id === tab)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  return (
    <div
      className={[
        'text-sm text-[#102a43] [&_h1]:text-[34px] [&_h1]:tracking-[-1.3px] [&_h1]:leading-[1.2]',
        '[&_h2]:text-[21px] [&_h2]:tracking-[-.5px] [&_h3]:text-base [&_p]:text-sm',
        '[&_button:disabled]:opacity-55 [&_button:disabled]:cursor-wait [&_table]:w-full',
        '[&_table]:border-collapse [&_table]:whitespace-nowrap [&_table]:text-left [&_table]:text-xs',
        '[&_th]:bg-[#f8fafd] [&_th]:px-6 [&_th]:py-3.5 [&_th]:text-[10px] [&_th]:uppercase',
        '[&_th]:tracking-wide [&_th]:font-medium [&_th]:text-slate-500 [&_td]:px-6 [&_td]:py-[18px]',
        '[&_td]:border-t [&_td]:border-[#edf1f7] [&_td_small]:block [&_td_small]:text-slate-400',
        '[&_td_small]:text-[10px] [&_td_small]:mt-1 [&_td_strong]:font-semibold',
        'max-[760px]:[&_td]:p-[15px] max-[760px]:[&_th]:p-[15px] grid min-h-screen',
        'grid-cols-[246px_minmax(0,1fr)] bg-[#f6f8fc] max-[760px]:grid-cols-[minmax(0,1fr)]',
      ].join(' ')}
    >
      <aside
        className={[
          'flex min-h-screen flex-col border-r border-[#e1e8f2] bg-white px-5 py-[30px] [&_nav]:grid',
          '[&_nav]:gap-[7px] [&_nav_button]:flex [&_nav_button]:items-center [&_nav_button]:gap-3',
          '[&_nav_button]:rounded-[7px] [&_nav_button]:px-3.5 [&_nav_button]:py-[13px]',
          '[&_nav_button]:text-left [&_nav_button]:text-xs max-[760px]:min-h-0 max-[760px]:border-r-0',
          'max-[760px]:border-b max-[760px]:p-[18px] max-[760px]:[&_nav]:mt-[18px]',
          'max-[760px]:[&_nav]:flex max-[760px]:[&_nav]:flex-wrap max-[760px]:[&_nav]:gap-[5px]',
          'max-[760px]:[&_nav_button]:p-[9px] max-[760px]:[&_nav_button]:text-[11px]',
        ].join(' ')}
      >
        <Link
          to="/"
          className={[
            'flex flex-wrap items-center gap-[9px] px-3.5 text-[21px] font-bold [&_svg]:text-blue-600',
            '[&_span]:w-full [&_span]:pl-[34px] [&_span]:text-[9px] [&_span]:tracking-[2.7px]',
            '[&_span]:text-slate-400 max-[760px]:p-0 max-[760px]:text-xl max-[760px]:[&_span]:hidden',
          ].join(' ')}
        >
          <BarChart3 /> {brand.name}
          <span>WORKSPACE</span>
        </Link>
        <div className="mx-3.5 mt-12 mb-[17px] text-[10px] tracking-[1.3px] text-slate-400 uppercase max-[760px]:hidden">
          {superadmin
            ? 'Platform management'
            : staff
              ? 'Client operations'
              : 'Your workspace'}
        </div>
        <nav aria-label="Workspace navigation">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={
                tab === t.id
                  ? 'bg-[#edf4ff] font-semibold text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }
              onClick={() => {
                setTab(t.id);
                setQuery('');
              }}
            >
              <t.icon size={19} />
              {t.name}
            </button>
          ))}
        </nav>
        <div
          className={[
            'mt-[55px] mb-[25px] rounded-xl border border-[#e0ebfc] bg-linear-to-br from-[#f1f6ff]',
            'to-[#f8fbff] px-4 py-5 [&>span]:text-[8px] [&>span]:leading-[1.7] [&_p]:mt-3 [&_p]:mb-5',
            '[&_p]:text-[11px] [&_a]:flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:text-[11px]',
            '[&_a]:font-semibold [&_a]:text-blue-600 max-[760px]:hidden',
          ].join(' ')}
        >
          <span className="mb-4 block text-[10px] font-bold tracking-[1.8px] text-blue-600">
            ANSWER ENGINE OPTIMIZATION
          </span>
          <h3>Make your next move count.</h3>
          <p>Start with a clear view of your website’s readiness.</p>
          <Link to="/aeo-audit">
            Run a website audit <ArrowUpRight size={16} />
          </Link>
        </div>
        <button
          className="mt-auto flex items-center gap-2.5 p-3 text-xs text-slate-500 max-[760px]:mt-3 max-[760px]:p-[5px]"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      <main className="min-w-0" id="main">
        <header
          className={[
            'flex h-[87px] items-center justify-between gap-3 border-b border-[#e1e8f2] bg-white',
            'px-[38px] text-xs text-slate-500 max-[760px]:h-[72px] max-[760px]:px-5',
          ].join(' ')}
        >
          <span>
            {superadmin ? 'Superadmin' : staff ? 'Admin' : 'Account'} /{' '}
            {tabs.find((t) => t.id === tab)?.name}
          </span>
          <div
            className={[
              'flex min-w-0 items-center gap-2.5 [&_strong]:block [&_strong]:text-xs',
              '[&_strong]:text-[#102a43] [&_small]:mt-1 [&_small]:block [&_small]:text-[10px]',
              '[&_small]:capitalize',
            ].join(' ')}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eaf1ff] font-bold text-blue-600">
              {user.name?.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
          </div>
        </header>
        <div
          className={[
            'mx-auto max-w-[1600px] p-[38px] min-[1400px]:px-12 min-[1400px]:py-[45px] max-[1100px]:p-7',
            'max-[760px]:px-4 max-[760px]:py-[25px]',
          ].join(' ')}
        >
          <div
            className={[
              'mb-[30px] flex items-center justify-between gap-[22px] [&_h1]:text-[29px] [&_p]:mt-2.5',
              '[&_p]:text-xs max-[1100px]:flex-col max-[1100px]:items-start max-[760px]:[&_h1]:text-[25px]',
            ].join(' ')}
          >
            <div>
              <span className="mb-4 block text-[10px] font-bold tracking-[1.8px] text-blue-600">
                {superadmin
                  ? 'PLATFORM COMMAND CENTER'
                  : staff
                    ? 'CLIENT SUCCESS WORKSPACE'
                    : 'YOUR AEO WORKSPACE'}
              </span>
              <h1>
                {tab === 'overview'
                  ? 'A clear view. A stronger strategy.'
                  : tabs.find((t) => t.id === tab)?.name}
              </h1>
              <p>
                {tab === 'overview'
                  ? 'Your clients, plans and business activity, together in one place.'
                  : 'Manage the details that keep your workspace moving.'}
              </p>
            </div>
            <button
              className={[
                'inline-flex min-h-11 shrink-0 items-center justify-center gap-2.5 rounded-[7px] border',
                'border-[#dbe2eb] bg-white px-[18px] py-3 text-[13px] font-semibold text-slate-700',
                'hover:bg-slate-50 disabled:opacity-55',
              ].join(' ')}
              onClick={refresh}
              disabled={busy}
            >
              <RefreshCw size={16} />
              {busy ? 'Updating…' : 'Refresh data'}
            </button>
          </div>
          {error && (
            <p
              className="my-4! rounded-lg border border-rose-200 bg-rose-50 p-3 text-red-700!"
              role="alert"
            >
              {error}
            </p>
          )}
          {!data && busy && <p role="status">Loading workspace…</p>}
          {data && (
            <>
              {tab === 'overview' ? (
                <>
                  <div className="grid grid-cols-4 gap-[18px] max-[1100px]:grid-cols-2 max-[760px]:gap-2.5">
                    {metrics.map((m) => (
                      <article
                        className={[
                          'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
                          'max-[760px]:p-[22px] p-[22px]! [&>div]:flex [&>div]:items-center [&>div]:justify-between',
                          '[&>div]:gap-2.5 [&>div]:text-[11px] [&>div]:text-slate-500 [&_svg]:text-blue-600',
                          '[&>strong]:mt-[19px] [&>strong]:mb-[9px] [&>strong]:block [&>strong]:text-[31px]',
                          '[&>strong]:tracking-[-1px] [&>small]:text-[10px] [&>small]:text-slate-400 max-[760px]:p-4!',
                          'max-[760px]:[&>div]:text-[10px] max-[760px]:[&>strong]:text-[26px]',
                        ].join(' ')}
                        key={m.label}
                      >
                        <div>
                          <span>{m.label}</span>
                          <m.icon size={19} />
                        </div>
                        <strong>{m.value}</strong>
                        <small>{m.detail}</small>
                      </article>
                    ))}
                  </div>
                  <div className="my-6 grid grid-cols-[1.5fr_1fr] gap-[22px] max-[1100px]:grid-cols-1">
                    <section
                      className={[
                        'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
                        'max-[760px]:p-[22px]',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'mb-[26px] flex items-center justify-between gap-[15px] [&_h2]:text-[17px] [&_p]:mt-[5px]',
                          '[&_p]:text-[11px] [&>button]:text-xs [&>button]:text-blue-600 max-[760px]:flex-wrap',
                          'max-[760px]:items-start',
                        ].join(' ')}
                      >
                        <div>
                          <h2>Plan distribution</h2>
                          <p>Orders across your service portfolio</p>
                        </div>
                        <BarChart3 className="text-blue-600" />
                      </div>
                      <div
                        className={[
                          'grid gap-[25px] [&>div>div:first-child]:mb-2.5 [&>div>div:first-child]:flex',
                          '[&>div>div:first-child]:justify-between [&>div>div:first-child]:text-xs',
                          '[&_strong]:text-[11px] [&_strong]:font-medium [&_strong]:text-slate-500',
                        ].join(' ')}
                      >
                        {['Starter', 'Growth', 'Authority'].map((name) => {
                          const count = orders.filter((o) => o.plan_name === name).length;
                          return (
                            <div key={name}>
                              <div>
                                <span>{name}</span>
                                <strong>{count} orders</strong>
                              </div>
                              <div
                                className={[
                                  'h-[9px] overflow-hidden rounded-[5px] bg-[#edf2fa] [&>div]:h-full [&>div]:rounded-[5px]',
                                  '[&>div]:bg-blue-600',
                                ].join(' ')}
                              >
                                <div
                                  style={{
                                    width: `${orders.length ? (count / orders.length) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                    <section
                      className={[
                        'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
                        'max-[760px]:p-[22px] bg-linear-to-br from-white to-[#edf4ff] [&_p]:mt-3.5 [&_p]:mb-5',
                        '[&_p]:text-xs [&>a]:mt-4 [&>a]:block [&>a]:text-[11px] [&>a]:text-blue-600',
                      ].join(' ')}
                    >
                      <span className="mb-4 block text-[10px] font-bold tracking-[1.8px] text-blue-600">
                        NEXT STEPS
                      </span>
                      <h2>Turn insight into action.</h2>
                      <p>
                        {pending.length
                          ? `${pending.length} orders are awaiting payment confirmation. Review the requests before starting delivery.`
                          : 'Your workspace is up to date. Explore a fresh website audit to identify opportunities.'}
                      </p>
                      <button
                        onClick={() => setTab('orders')}
                        className={[
                          'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[7px] border',
                          'border-blue-600 bg-blue-600 px-[18px] py-3 text-[13px] font-semibold text-white!',
                          'hover:bg-blue-700 disabled:opacity-55',
                        ].join(' ')}
                      >
                        Review orders <ArrowUpRight size={17} />
                      </button>
                      <Link to="/aeo-audit">Open the AEO checker →</Link>
                    </section>
                  </div>
                  <section
                    className={[
                      'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
                      'max-[760px]:p-[22px] overflow-hidden px-0! pt-6! pb-0! [&>div:first-child]:px-6',
                      'max-[760px]:pt-5!',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'mb-[26px] flex items-center justify-between gap-[15px] [&_h2]:text-[17px] [&_p]:mt-[5px]',
                        '[&_p]:text-[11px] [&>button]:text-xs [&>button]:text-blue-600 max-[760px]:flex-wrap',
                        'max-[760px]:items-start',
                      ].join(' ')}
                    >
                      <div>
                        <h2>Recent orders</h2>
                        <p>The latest activity in your workspace</p>
                      </div>
                      <button onClick={() => setTab('orders')}>View all →</button>
                    </div>
                    <OrdersTable
                      rows={[...orders]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 5)}
                      email={user.email}
                    />
                  </section>
                </>
              ) : tab === 'inquiries' ? <InquiryList /> : (
                <section
                  className={[
                    'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
                    'max-[760px]:p-[22px] overflow-hidden px-0! pt-6! pb-0! [&>div:first-child]:px-6',
                    'max-[760px]:pt-5!',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'mb-[26px] flex items-center justify-between gap-[15px] [&_h2]:text-[17px] [&_p]:mt-[5px]',
                      '[&_p]:text-[11px] [&>button]:text-xs [&>button]:text-blue-600 max-[760px]:flex-wrap',
                      'max-[760px]:items-start',
                    ].join(' ')}
                  >
                    <h2>{tabs.find((t) => t.id === tab)?.name}</h2>
                    <label
                      className={[
                        'flex items-center gap-2.5 rounded-[7px] border border-[#e1e8f2] px-3 py-[9px]',
                        'text-slate-400 [&_input]:min-w-0 [&_input]:w-[170px] [&_input]:border-0 [&_input]:text-xs',
                        '[&_input]:text-[#102a43] max-[760px]:[&_input]:w-[150px]',
                      ].join(' ')}
                    >
                      <Search size={17} />
                      <input
                        aria-label="Search records"
                        placeholder="Search records…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                  </div>
                  {tab === 'orders' ? (
                    <OrdersTable rows={filtered(orders)} email={user.email} />
                  ) : (
                    <div className="overflow-x-auto">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Access level</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered(
                            users.filter((u) =>
                              tab === 'team' ? u.role !== 'user' : u.role === 'user',
                            ),
                          ).map((u) => (
                            <tr key={u.id}>
                              <td>
                                <strong>{u.name}</strong>
                              </td>
                              <td>{u.email}</td>
                              <td>
                                <span className="inline-block rounded-[5px] bg-[#edf4ff] px-[9px] py-[5px] text-[10px] text-blue-600 capitalize">
                                  {u.role}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="text-blue-600"
                                  onClick={() => setEditing({ ...u })}
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!filtered(
                        users.filter((u) =>
                          tab === 'team' ? u.role !== 'user' : u.role === 'user',
                        ),
                      ).length && (
                        <p className="p-[42px]! text-center text-slate-400 [&_svg]:mx-auto [&_svg]:mb-3.5 [&_h3]:mb-2 [&_p]:text-xs">
                          No matching accounts.
                        </p>
                      )}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
          {editing && (
            <section
              className={[
                'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
                'max-[760px]:p-[22px] mt-6 max-w-[600px]',
              ].join(' ')}
            >
              <h2>Manage {editing.name}</h2>
              <form onSubmit={save}>
                <label
                  className={[
                    'my-[18px] grid gap-2 text-xs font-semibold [&_input]:w-full [&_input]:rounded-[7px]',
                    '[&_input]:border [&_input]:border-[#dbe2eb] [&_input]:bg-white [&_input]:p-3',
                    '[&_select]:w-full [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#dbe2eb]',
                    '[&_select]:bg-white [&_select]:p-3 [&_small]:font-normal [&_small]:text-slate-500',
                  ].join(' ')}
                >
                  Name
                  <input
                    required
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </label>
                <label
                  className={[
                    'my-[18px] grid gap-2 text-xs font-semibold [&_input]:w-full [&_input]:rounded-[7px]',
                    '[&_input]:border [&_input]:border-[#dbe2eb] [&_input]:bg-white [&_input]:p-3',
                    '[&_select]:w-full [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#dbe2eb]',
                    '[&_select]:bg-white [&_select]:p-3 [&_small]:font-normal [&_small]:text-slate-500',
                  ].join(' ')}
                >
                  Email
                  <input
                    required
                    type="email"
                    value={editing.email}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  />
                </label>
                {superadmin && (
                  <label
                    className={[
                      'my-[18px] grid gap-2 text-xs font-semibold [&_input]:w-full [&_input]:rounded-[7px]',
                      '[&_input]:border [&_input]:border-[#dbe2eb] [&_input]:bg-white [&_input]:p-3',
                      '[&_select]:w-full [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#dbe2eb]',
                      '[&_select]:bg-white [&_select]:p-3 [&_small]:font-normal [&_small]:text-slate-500',
                    ].join(' ')}
                  >
                    Access level
                    <select
                      disabled={editing.id === user.id}
                      value={editing.role}
                      onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                    <small>
                      Role changes apply to the account immediately. Your own role cannot
                      be changed here.
                    </small>
                  </label>
                )}
                <div className="flex gap-3">
                  <button
                    className={[
                      'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[7px] border',
                      'border-blue-600 bg-blue-600 px-[18px] py-3 text-[13px] font-semibold text-white!',
                      'hover:bg-blue-700 disabled:opacity-55',
                    ].join(' ')}
                    disabled={busy}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className={[
                      'inline-flex min-h-11 shrink-0 items-center justify-center gap-2.5 rounded-[7px] border',
                      'border-[#dbe2eb] bg-white px-[18px] py-3 text-[13px] font-semibold text-slate-700',
                      'hover:bg-slate-50 disabled:opacity-55',
                    ].join(' ')}
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
          <footer
            className={[
              'flex justify-between gap-5 pt-[30px] text-[10px] text-slate-400 [&_a]:text-slate-500',
              'max-[760px]:text-[9px]',
            ].join(' ')}
          >
            {brand.name} workspace ·{' '}
            {superadmin
              ? 'Platform administration'
              : staff
                ? 'Client operations'
                : 'Your account'}
            <Link to="/">Visit website ↗</Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
