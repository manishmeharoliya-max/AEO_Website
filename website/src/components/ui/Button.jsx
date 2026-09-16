import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Button({
  to = '/aeo-audit',
  children,
  secondary = false,
  className = '',
}) {
  return (
    <Link
      to={to}
      className={[
        [
          'button inline-flex justify-center items-center gap-[13px] bg-[#2563eb] text-white',
          'min-h-[47px] py-[13px] px-[20px] border border-[#2563eb] rounded-[7px] text-[12px]',
          'font-semibold leading-[1.5] whitespace-nowrap shadow-[0_3px_6px_#2563eb0c] hover:bg-[#1d4ed8]',
          'hover:shadow-[0_5px_15px_#2563eb20] hover:[transform:translateY(-1px)]',
        ].join(' '),
        secondary
          ? [
              'button-secondary [&.button-secondary]:bg-white [&.button-secondary]:border-[#dbe2eb]',
              '[&.button-secondary]:text-[#334155] [&.button-secondary]:shadow-none',
              '[&.button-secondary:hover]:bg-[#f3f7fc] [&.button-secondary:hover]:border-[#b5c7e5]',
            ].join(' ')
          : '',
        className,
      ].join(' ')}
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
