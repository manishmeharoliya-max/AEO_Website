import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import { plans } from '../../data/plans.js';
import { api } from '../../lib/api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import {
  analyzeWebsite,
  normalizeWebsiteUrl,
} from '../aeo-checker/api/analyzeWebsite.js';
import { scoreScenario } from '../aeo-checker/utils/scoreScenario.js';
export function CheckoutPage() {
  const [params] = useSearchParams();
  const plan = plans.find((p) => p.id === params.get('plan'));
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [scenarioError, setScenarioError] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api('/orders', {
        method: 'POST',
        body: { plan_id: plan.id, payment_mode: 'bank' },
      });
      setOrder(result.order);
      const website = params.get('website');
      if (website) {
        try {
          const analysis = await analyzeWebsite(normalizeWebsiteUrl(website));
          setScenario(scoreScenario(analysis, plan.id));
        } catch {
          setScenarioError(
            'The website could not be rescanned right now. You can try again from the homepage.',
          );
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (!plan)
    return (
      <div className="px-6 py-[100px] text-center">
        <h2>Choose a plan first</h2>
        <Link to="/plans">View plans →</Link>
      </div>
    );
  return (
    <section
      className={[
        'text-sm text-[#102a43] [&_h1]:text-[34px] [&_h1]:tracking-[-1.3px] [&_h1]:leading-[1.2]',
        '[&_h2]:text-[21px] [&_h2]:tracking-[-.5px] [&_h3]:text-base [&_p]:text-sm',
        '[&_button:disabled]:opacity-55 [&_button:disabled]:cursor-wait [&_table]:w-full',
        '[&_table]:border-collapse [&_table]:whitespace-nowrap [&_table]:text-left [&_table]:text-xs',
        '[&_th]:bg-[#f8fafd] [&_th]:px-6 [&_th]:py-3.5 [&_th]:text-[10px] [&_th]:uppercase',
        '[&_th]:tracking-wide [&_th]:font-medium [&_th]:text-slate-500 [&_td]:px-6 [&_td]:py-[18px]',
        '[&_td]:border-t [&_td]:border-[#edf1f7] [&_td_small]:block [&_td_small]:text-slate-400',
        '[&_td_small]:text-[10px] [&_td_small]:mt-1 [&_td_strong]:font-semibold',
        'max-[760px]:[&_td]:p-[15px] max-[760px]:[&_th]:p-[15px] mx-auto grid max-w-[1150px]',
        'grid-cols-[1.2fr_1fr] gap-[45px] px-6 py-[65px] [&_h1]:mb-4 max-[760px]:grid-cols-1',
        'max-[760px]:gap-[30px] max-[760px]:px-5 max-[760px]:py-10',
      ].join(' ')}
    >
      <div>
        <span className="mb-4 block text-[10px] font-bold tracking-[1.8px] text-blue-600">
          YOUR AEO JOURNEY STARTS HERE
        </span>
        <h1>{order ? 'Your order is received.' : 'A clearer path to discovery.'}</h1>
        <p>
          {order
            ? 'Your plan is pending payment. You have not been charged.'
            : 'Review your plan and submit your order. Your team will confirm the scope and payment details.'}
        </p>
        {order && scenario && (
          <div className="my-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm">
            <h2>Illustrative improvement scenario</h2>
            <p>
              Current measured score: <strong>{scenario.current}/100</strong>. If the
              selected issues below are fixed, a new scan could reach{' '}
              <strong>{scenario.possible}/100</strong> under this checker’s rules.
            </p>
            {scenario.issues.length > 0 && (
              <ul className="my-3 list-disc pl-5">
                {scenario.issues.map((issue) => (
                  <li key={issue.id}>{issue.label}</li>
                ))}
              </ul>
            )}
            <p>
              This is an estimate, not a new measured score or a guaranteed result.
              Submitting an order does not change your website or activate payment.
            </p>
            <Link
              className="font-semibold text-blue-700 underline"
              to={`/?website=${encodeURIComponent(params.get('website'))}#aeo-checker`}
            >
              Rescan after the fixes are live
            </Link>
          </div>
        )}
        {order && scenarioError && <p role="status">{scenarioError}</p>}
        <div
          className={[
            'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
            'max-[760px]:p-[22px]',
          ].join(' ')}
        >
          <h2>{plan.name}</h2>
          <p>{plan.description}</p>
          <strong className="mt-5 block text-[38px] [&_small]:text-[13px] [&_small]:font-normal [&_small]:text-slate-500">
            ${plan.price} <small>{plan.interval}</small>
          </strong>
          <ul className="my-7 grid list-none gap-4 p-0 [&_li]:flex [&_li]:gap-2.5 [&_svg]:text-blue-600">
            {plan.features.map((f) => (
              <li key={f}>
                <Check size={18} />
                {f}
              </li>
            ))}
          </ul>
          <p>{plan.note}</p>
        </div>
      </div>
      <div
        className={[
          'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
          'max-[760px]:p-[22px] self-start [&_h2]:mt-[18px] [&_h2]:mb-2.5 [&_dl]:my-5 [&_dl]:grid',
          '[&_dl]:grid-cols-2 [&_dl]:gap-[18px] [&_dl]:border-y [&_dl]:border-slate-200',
          '[&_dl]:py-[25px] [&_dd]:m-0 [&_dd]:text-right [&_dd]:font-semibold [&_dd]:break-all',
          '[&>a:first-of-type]:my-[18px] [&>a:first-of-type]:w-full [&_form>button]:my-[18px]',
          '[&_form>button]:w-full',
        ].join(' ')}
      >
        <ShieldCheck className="text-blue-600" size={32} />
        <h2>{order ? 'Order confirmation' : 'Order summary'}</h2>
        <p>{user.email}</p>
        <dl>
          <dt>Plan</dt>
          <dd>{plan.name}</dd>
          <dt>Billing</dt>
          <dd>{plan.id === 'starter' ? 'One-time' : 'Monthly'}</dd>
          <dt>Starting price (USD)</dt>
          <dd>${plan.price}</dd>
          {order && (
            <>
              <dt>Order reference</dt>
              <dd>#{order.id}</dd>
              <dt>Status</dt>
              <dd>Pending payment</dd>
            </>
          )}
        </dl>
        {order ? (
          <Link
            className={[
              'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[7px] border',
              'border-blue-600 bg-blue-600 px-[18px] py-3 text-[13px] font-semibold text-white!',
              'hover:bg-blue-700 disabled:opacity-55',
            ].join(' ')}
            to="/account"
          >
            View my orders →
          </Link>
        ) : (
          <form onSubmit={submit}>
            <p className="my-4! rounded-lg bg-blue-50 p-3.5">
              Online payments are not enabled yet. This submits a pending order; it does
              not activate a paid plan or charge your account.
            </p>
            <label className="block text-xs leading-[1.8] [&_input]:mr-1.5 [&_a]:underline">
              <input type="checkbox" required /> I agree to the{' '}
              <Link to="/terms-and-conditions">terms and conditions</Link> and understand
              that final scope and payment will be confirmed separately.
            </label>
            {error && (
              <p
                className="my-4! rounded-lg border border-rose-200 bg-rose-50 p-3 text-red-700!"
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              className={[
                'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[7px] border',
                'border-blue-600 bg-blue-600 px-[18px] py-3 text-[13px] font-semibold text-white!',
                'hover:bg-blue-700 disabled:opacity-55',
              ].join(' ')}
              disabled={busy}
            >
              {busy ? 'Submitting…' : 'Submit plan order'}
            </button>
          </form>
        )}
        <Link to="/plans">← Explore other plans</Link>
      </div>
    </section>
  );
}
