import { Logo } from './Logo.jsx';
import { brand } from '../../config/brand.js';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      className={[
        'footer border-t border-t-[#e7edf5] bg-[#f9fafc] pt-[54px] px-0 pb-[23px]',
        '[&_.logo]:text-[22px] [&_h3]:text-[12px] [&_h3]:mb-[18px] [&_a:hover]:text-[#2563eb]',
        'max-[720px]:pt-[40px]',
      ].join(' ')}
    >
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)]',
        ].join(' ')}
      >
        <div
          className={[
            'footer-grid grid grid-cols-[2fr_1fr_1fr_1fr] gap-[65px] [&>div:first-child_p]:text-[12px]',
            '[&>div:first-child_p]:my-[17px] [&>div:first-child_p]:mx-0 [&>div:first-child_p]:max-w-[280px]',
            '[&>div:not(:first-child)>a]:block [&>div:not(:first-child)>a]:text-[#7a879b]',
            '[&>div:not(:first-child)>a]:text-[11px] [&>div:not(:first-child)>a]:mb-[13px]',
            'max-[1150px]:gap-[35px] max-[950px]:grid-cols-[1.6fr_1fr_1fr_1fr] max-[950px]:gap-[22px]',
            'max-[720px]:grid-cols-[1fr_1fr] max-[720px]:gap-[34px_20px]',
            'max-[720px]:[&>div:first-child]:[grid-column:1/-1]',
            'max-[720px]:[&>div:first-child_p]:max-w-[350px]',
          ].join(' ')}
        >
          <div>
            <Logo />
            <p>{brand.tagline}</p>
            <span className="global-note flex items-center gap-[7px] text-[10px] text-[#8b97a8]">
              <Globe size={15} /> Built for a world of questions.
            </span>
          </div>
          {[
            [
              'Services',
              [
                ['AEO Audit', '/aeo-audit'],
                ['Plans & Pricing', '/plans'],
                ['Content Strategy', '/services#answer-focused-content'],
                ['Technical AEO', '/services#technical-aeo'],
                ['AI Visibility Monitoring', '/services#ai-visibility-monitoring'],
              ],
            ],
            [
              'Company',
              [
                ['About', '/about'],
                ['Industries', '/industries'],
                ['Insights', '/insights'],
                ['Contact', '/contact'],
                ['Workspace sign in', '/login'],
              ],
            ],
            [
              'Legal',
              [
                ['Privacy Policy', '/privacy-policy'],
                ['Terms and Conditions', '/terms-and-conditions'],
              ],
            ],
          ].map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              {links.map(([label, to]) => (
                <Link to={to} key={to}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div
          className={[
            'footer-bottom border-t border-t-[#e3e9f2] mt-[40px] pt-[22px] flex justify-between',
            'text-[10px] text-[#8793a5] max-[720px]:gap-[15px] max-[720px]:flex-col max-[720px]:mt-[30px]',
          ].join(' ')}
        >
          <span>© 2026 {brand.name}. All rights reserved.</span>
          <span>Clarity. Authority. Visibility.</span>
        </div>
        <p className="trademark text-[9px]! mt-[16px] leading-[1.7] max-w-[800px]">
          Google, ChatGPT, Bing and other product names belong to their respective owners.{' '}
          {brand.name} is not affiliated with these platforms.
        </p>
      </div>
    </footer>
  );
}
