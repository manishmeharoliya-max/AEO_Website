import { Link } from 'react-router-dom';
import { brand } from '../../config/brand.js';
import { Sparkles } from 'lucide-react';

export function Logo() {
  return (
    <Link
      className={[
        'logo inline-flex items-center gap-[9px] text-[24px] tracking-[-1px] font-[750]',
        'whitespace-nowrap text-[#102a43] max-[1150px]:text-[22px]',
      ].join(' ')}
      to="/"
      aria-label={`${brand.name} home`}
    >
      <span className="logo-mark w-[34px] h-[36px] grid place-items-center bg-[#2563eb] text-[white] rounded-[9px]">
        <Sparkles size={22} />
      </span>
      <span>
        {brand.name.slice(0, 6)}
        <span className="logo-light font-medium">{brand.name.slice(6)}</span>
        <span className="logo-dot text-[#2563eb]">.</span>
      </span>
    </Link>
  );
}
