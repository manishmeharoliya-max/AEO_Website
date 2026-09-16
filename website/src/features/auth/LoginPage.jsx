import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api.js';
import { brand } from '../../config/brand.js';
import { useAuth } from './AuthContext.jsx';
import { loginDestination } from '../../config/access.js';
export function LoginPage() {
  const { user, authenticate } = useAuth();
  const [params] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const next = params.get('next');
  const safeNext = next && /^\/checkout(?:\?|$)/.test(next) ? next : null;
  if (user) return <Navigate to={loginDestination(user.role, next)} replace />;
  function changeMode(value) {
    setMode(value);
    setSent(false);
    setError('');
    setNotice('');
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'login')
        authenticate(await api('/auth/login', { method: 'POST', body: form }));
      else if (!sent) {
        const result = await api(
          mode === 'signup'
            ? '/auth/signup/request-otp'
            : '/auth/forgot-password/request-otp',
          { method: 'POST', body: { ...form, role: 'user', purpose: 'signup' } },
        );
        setSent(true);
        setNotice(
          result.demoOtp
            ? `Local development code: ${result.demoOtp}`
            : 'Check your email for the 6-digit verification code.',
        );
      } else if (mode === 'signup')
        authenticate(
          await api('/auth/signup/verify', {
            method: 'POST',
            body: { ...form, role: 'user', purpose: 'signup' },
          }),
        );
      else {
        await api('/auth/forgot-password/reset', { method: 'POST', body: form });
        changeMode('login');
        setNotice('Password updated. Sign in with your new password.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const field = (key, label, type = 'text') => (
    <label
      className={[
        'my-[18px] grid gap-2 text-xs font-semibold [&_input]:w-full [&_input]:rounded-[7px]',
        '[&_input]:border [&_input]:border-[#dbe2eb] [&_input]:bg-white [&_input]:p-3',
        '[&_select]:w-full [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#dbe2eb]',
        '[&_select]:bg-white [&_select]:p-3 [&_small]:font-normal [&_small]:text-slate-500',
      ].join(' ')}
    >
      {label}
      <input
        required
        type={type}
        autoComplete={
          key === 'password'
            ? mode === 'login'
              ? 'current-password'
              : 'new-password'
            : key === 'otp'
              ? 'one-time-code'
              : key
        }
        minLength={key === 'password' && mode !== 'login' ? 8 : undefined}
        maxLength={
          key === 'email' ? 254 : key === 'name' ? 255 : key === 'otp' ? 6 : undefined
        }
        readOnly={sent && key === 'email'}
        disabled={busy}
        pattern={key === 'otp' ? '[0-9]{6}' : undefined}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </label>
  );
  return (
    <section
      className={[
        'mx-auto grid max-w-[1140px] grid-cols-[1.1fr_1fr] items-center gap-[90px] px-6 py-20',
        'max-[1100px]:gap-[35px] max-[760px]:grid-cols-1 max-[760px]:gap-[30px] max-[760px]:px-5',
        'max-[760px]:py-10 text-sm text-[#102a43] [&_h1]:text-[34px] [&_h1]:tracking-[-1.3px]',
        '[&_h1]:leading-[1.2] [&_h2]:text-[21px] [&_h2]:tracking-[-.5px] [&_h3]:text-base',
        '[&_p]:text-sm [&_button:disabled]:opacity-55 [&_button:disabled]:cursor-wait',
        '[&_table]:w-full [&_table]:border-collapse [&_table]:whitespace-nowrap [&_table]:text-left',
        '[&_table]:text-xs [&_th]:bg-[#f8fafd] [&_th]:px-6 [&_th]:py-3.5 [&_th]:text-[10px]',
        '[&_th]:uppercase [&_th]:tracking-wide [&_th]:font-medium [&_th]:text-slate-500 [&_td]:px-6',
        '[&_td]:py-[18px] [&_td]:border-t [&_td]:border-[#edf1f7] [&_td_small]:block',
        '[&_td_small]:text-slate-400 [&_td_small]:text-[10px] [&_td_small]:mt-1',
        '[&_td_strong]:font-semibold max-[760px]:[&_td]:p-[15px] max-[760px]:[&_th]:p-[15px]',
      ].join(' ')}
    >
      <div className="[&_h1]:mb-6 [&_h1]:text-[44px] [&>p]:max-w-[430px] max-[760px]:[&_h1]:text-[34px]">
        <span className="mb-4 block text-[10px] font-bold tracking-[1.8px] text-blue-600">
          YOUR NEXT CHAPTER IN SEARCH
        </span>
        <h1>
          Be the answer.
          <br />
          Build your advantage.
        </h1>
        <p>
          Your AEO journey, from your first audit to a stronger presence in AI answers.
        </p>
        <div className="my-[35px] flex items-center gap-3 text-[13px] text-blue-600 max-[760px]:my-5">
          <ShieldCheck />
          <span>One account. Your plans, orders and next steps.</span>
        </div>
        <Link to="/">← Back to website</Link>
      </div>
      <div
        className={[
          'rounded-[14px] border border-[#e1e8f2] bg-white p-7 shadow-[0_4px_16px_#102a4303]',
          'max-[760px]:p-[22px] [&>p]:mt-3 [&_form>button]:mt-2 [&_form>button]:w-full',
        ].join(' ')}
      >
        <span className="mb-4 block text-[10px] font-bold tracking-[1.8px] text-blue-600">
          {brand.name.toUpperCase()} WORKSPACE
        </span>
        <h2>
          {mode === 'login'
            ? 'Welcome back'
            : mode === 'signup'
              ? 'Create your account'
              : 'Reset your password'}
        </h2>
        <p>
          {safeNext
            ? 'Sign in to continue with your selected plan.'
            : 'Sign in to access your workspace.'}
        </p>
        <form onSubmit={submit}>
          {mode === 'signup' && field('name', 'Full name')}
          {field('email', 'Email address', 'email')}
          {(mode !== 'reset' || sent) &&
            field('password', mode === 'reset' ? 'New password' : 'Password', 'password')}
          {sent && field('otp', 'Verification code')}
          {notice && (
            <p role="status" className="my-4! rounded-lg bg-blue-50 p-3.5">
              {notice}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="my-4! rounded-lg border border-rose-200 bg-rose-50 p-3 text-red-700!"
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
            {busy
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign in'
                : !sent
                  ? 'Send verification code'
                  : mode === 'signup'
                    ? 'Verify & continue'
                    : 'Update password'}
            <ArrowRight size={17} />
          </button>
        </form>
        <div className="mt-6 grid gap-3.5 text-left text-xs text-blue-600 [&_button]:text-left">
          <button onClick={() => changeMode(mode === 'signup' ? 'login' : 'signup')}>
            {mode === 'signup'
              ? 'Already have an account? Sign in'
              : 'New here? Create an account'}
          </button>
          <button onClick={() => changeMode(mode === 'reset' ? 'login' : 'reset')}>
            {mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}
          </button>
          {sent && (
            <button
              onClick={() => {
                setSent(false);
                setNotice('');
              }}
            >
              Request a new code
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
