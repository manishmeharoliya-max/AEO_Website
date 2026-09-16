import { nav } from '../../config/navigation.js';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';

export function MobileMenu({ open, close }) {
  return (
    open && (
      <nav
        className={[
          'mobile-menu bg-white py-[18px] px-[24px] border-b border-b-[#e2e8f0]',
          'shadow-[0_12px_16px_#102a4308] [&>a:not(.button)]:block [&>a:not(.button)]:py-[11px] [&>a:not(.button)]:px-[4px]',
          '[&>a:not(.button)]:text-[14px] [&_.active]:text-[#2563eb]',
        ].join(' ')}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        {nav.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={close}>
            {label}
          </NavLink>
        ))}
        <Button>Get Free AEO Analysis</Button>
      </nav>
    )
  );
}
