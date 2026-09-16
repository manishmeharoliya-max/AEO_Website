import { Check } from 'lucide-react';

export function CheckList({ items }) {
  return (
    <ul
      className={[
        'check-list list-none p-0 mt-[25px] mx-0 mb-[28px] grid gap-[12px] [&_li]:flex [&_li]:gap-[10px]',
        '[&_li]:text-[13px] [&_li]:items-start [&_li]:text-[#4a5c73] [&_li]:leading-[1.6]',
        '[&_svg]:text-[#2563eb] [&_svg]:mt-[2px]',
      ].join(' ')}
    >
      {items.map((item) => (
        <li key={item}>
          <Check size={16} />
          {item}
        </li>
      ))}
    </ul>
  );
}
