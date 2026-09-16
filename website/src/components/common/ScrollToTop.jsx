import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { brand } from '../../config/brand.js';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const [visible, setVisible] = useState(false);
  const hasWhatsApp = /^\d{8,15}$/.test(brand.whatsappNumber.replace(/\D/g, ''));
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
  }, [pathname, hash]);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', update, {
      passive: true,
    });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    visible && (
      <button
        className={[
          'scroll-top fixed right-[22px] bottom-[22px] z-[20] bg-white text-[#2563eb]',
          'border border-[#dbe4f1] rounded-[10px] w-[42px] h-[42px] grid place-items-center',
          'shadow-[0_4px_15px_#102a4310] max-[720px]:right-[13px] max-[720px]:bottom-[13px]',
          pathname === '/' &&
            hasWhatsApp &&
            'right-[28px] bottom-[87px] max-[720px]:right-[19px] max-[720px]:bottom-[78px]',
        ].join(' ')}
        aria-label="Scroll to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
      >
        <ArrowUp size={20} />
      </button>
    )
  );
}
