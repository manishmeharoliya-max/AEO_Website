import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slugify.js';
import { Icon } from '../ui/Icon.jsx';
import { ArrowRight } from 'lucide-react';

export function ServiceCard({ service }) {
  return (
    <Link
      className={[
        'service-card p-[28px] bg-white border border-[#e2e8f0] rounded-[12px] flex flex-col',
        'items-start [transition:transform_0.2s,_box-shadow_0.2s,_border-color_0.2s]',
        'hover:[transform:translateY(-4px)] hover:border-[#c3d5f6]',
        'hover:shadow-[0_12px_28px_#1736560a] [&_h3]:mt-[20px] [&_h3]:mx-0 [&_h3]:mb-[10px] [&_h3]:text-[17px]',
        '[&_p]:text-[13px] [&_p]:mb-[22px] [&_.text-link]:mt-auto [&_.text-link]:text-[11px]',
        'max-[950px]:p-[22px] max-[950px]:[&_h3]:text-[15px] max-[720px]:p-[25px]',
        'max-[720px]:[&_h3]:text-[18px] max-[720px]:[&_p]:text-[13px]',
      ].join(' ')}
      to={`/services#${slugify(service.title)}`}
    >
      <span
        className={[
          'icon-box inline-flex w-[47px] h-[47px] items-center justify-center rounded-[11px]',
          'bg-[#eaf2ff] text-[#2563eb]',
        ].join(' ')}
      >
        <Icon name={service.icon} size={22} />
      </span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <span
        className={[
          'text-link text-[#2563eb] inline-flex items-center gap-[10px] text-[12px] font-semibold',
          'hover:gap-[14px]',
        ].join(' ')}
      >
        Explore service <ArrowRight size={15} />
      </span>
    </Link>
  );
}
