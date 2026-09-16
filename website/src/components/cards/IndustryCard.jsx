import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slugify.js';
import { Icon } from '../ui/Icon.jsx';
import { ArrowRight } from 'lucide-react';

export function IndustryCard({ industry }) {
  return (
    <Link
      className={[
        'industry-card relative border border-[#e2e8f0] rounded-[10px] py-[23px] px-[19px]',
        '[transition:background_0.2s,_border-color_0.2s] [&>svg:first-child]:text-[#537cc3]',
        '[&>svg:first-child]:mb-[15px] [&_h3]:text-[13px] [&_h3]:mb-[7px] [&_p]:text-[11px]',
        '[&_p]:max-w-[180px] hover:bg-[#f7faff] hover:border-[#bfd0ef] max-[720px]:py-[20px] max-[720px]:px-[14px]',
        'max-[720px]:[&_h3]:text-[12px] max-[720px]:[&_p]:text-[10px]',
      ].join(' ')}
      to={`/industries#${slugify(industry[0])}`}
    >
      <Icon name={industry[1]} size={22} />
      <h3>{industry[0]}</h3>
      <p>{industry[2]}</p>
      <ArrowRight
        className="industry-arrow absolute top-[27px] right-[17px] text-[#a2afc2] max-[720px]:right-[12px]"
        size={16}
      />
    </Link>
  );
}
