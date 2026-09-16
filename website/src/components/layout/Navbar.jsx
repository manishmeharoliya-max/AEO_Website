import { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { nav } from '../../config/navigation.js';
import { Button } from '../ui/Button.jsx';
import { X, Menu, LogIn, LogOut } from 'lucide-react';
import { MobileMenu } from './MobileMenu.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <header
      className={[
        'site-header h-[83px] sticky top-0 bg-[#fffffffa] border-b border-b-[#e9edf3] z-[30]',
        '[backdrop-filter:blur(12px)] max-[950px]:h-[72px]',
      ].join(' ')}
    >
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] nav-inner h-full flex',
          'items-center justify-between gap-[22px] max-[1150px]:gap-[16px]',
        ].join(' ')}
      >
        <Logo />
        <nav
          className={[
            'desktop-nav flex gap-[25px] items-center [&_a]:text-[12px] [&_a]:font-medium',
            '[&_a]:text-[#526074] [&_a]:relative [&_a]:py-[31px] [&_a]:px-0 [&_a.active]:text-[#2563eb]',
            "[&_a:hover]:text-[#2563eb] [&_a.active:after]:content-[''] [&_a.active:after]:absolute",
            '[&_a.active:after]:bottom-[19px] [&_a.active:after]:w-[4px] [&_a.active:after]:h-[4px]',
            '[&_a.active:after]:bg-[#2563eb] [&_a.active:after]:rounded-[50%]',
            '[&_a.active:after]:left-[calc(50%_-_2px)] max-[1150px]:gap-[17px] max-[950px]:hidden',
          ].join(' ')}
          aria-label="Main navigation"
        >
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Button
          className={[
            'nav-cta [&.nav-cta]:text-[11px] [&.nav-cta]:min-h-[41px] [&.nav-cta]:py-[10px] [&.nav-cta]:px-[14px]',
            'max-[1150px]:[&.nav-cta]:p-[10px] max-[1150px]:[&.nav-cta]:text-[10px]',
            'max-[950px]:[&.nav-cta]:hidden',
          ].join(' ')}
        >
          Get Free AEO Analysis
        </Button>
        <button
          type="button"
          aria-label={user ? 'Log out' : 'Log in'}
          title={user ? 'Log out' : 'Log in'}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 max-[950px]:ml-auto"
          onClick={() => {
            if (user) logout();
            navigate('/login');
          }}
        >
          {user ? <LogOut size={19} aria-hidden="true" /> : <LogIn size={19} aria-hidden="true" />}
        </button>
        <button
          className="menu-toggle hidden border-0 bg-transparent p-[8px] text-[#102a43] max-[950px]:block"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <MobileMenu open={open} close={() => setOpen(false)} />
    </header>
  );
}
