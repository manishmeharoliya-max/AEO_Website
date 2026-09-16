import { PageHero } from '../components/common/PageHero.jsx';
import { industries } from '../data/industries.js';
import { slugify } from '../utils/slugify.js';
import { Icon } from '../components/ui/Icon.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Link } from 'react-router-dom';
import { CTASection } from '../components/common/CTASection.jsx';

export function Industries() {
  return (
    <>
      <PageHero path="/industries" label="Context makes the difference" />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] section py-[88px]',
          'max-[950px]:py-[65px] max-[720px]:py-[55px] detail-list [&.detail-list]:pt-[20px]',
          'max-[950px]:[&.detail-list]:pt-[65px] max-[720px]:[&.detail-list]:pt-[55px]',
        ].join(' ')}
      >
        {industries.map((industry) => (
          <article
            className={[
              'industry-detail grid grid-cols-[1fr_1.15fr] gap-[85px] py-[58px] px-0',
              'border-b border-b-[#e2e8f0] scroll-mt-[90px] [&>div>p]:mb-[24px] [&>div>p]:text-[14px]',
              '[&_h2]:text-[29px] [&_h2]:mt-[19px] [&_h2]:mx-0 [&_h2]:mb-[13px] max-[1150px]:gap-[45px]',
              'max-[720px]:grid-cols-[1fr] max-[720px]:gap-[30px] max-[720px]:py-[38px]',
              'max-[720px]:[&_h2]:text-[26px]',
            ].join(' ')}
            id={slugify(industry[0])}
            key={industry[0]}
          >
            <div>
              <span
                className={[
                  'icon-box inline-flex w-[47px] h-[47px] items-center justify-center rounded-[11px]',
                  'bg-[#eaf2ff] text-[#2563eb]',
                ].join(' ')}
              >
                <Icon name={industry[1]} size={26} />
              </span>
              <h2>{industry[0]}</h2>
              <p>{industry[2]}</p>
              <Button to="/contact">Discuss your industry</Button>
            </div>
            <div
              className={[
                'industry-details-grid [&_h3]:text-[14px] grid grid-cols-[1fr_1fr] gap-[24px]',
                '[&_p]:text-[12px] [&_p]:mt-[8px] [&_a]:block [&_a]:text-[#2563eb] [&_a]:text-[12px]',
                '[&_a]:mt-[10px] max-[380px]:grid-cols-[1fr]',
              ].join(' ')}
            >
              {[
                ['How customers search', industry[3]],
                ['Common content gaps', industry[4]],
                ['How AEO can help', industry[5]],
              ].map(([title, copy]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
              <div>
                <h3>Relevant services</h3>
                <Link to="/aeo-audit">AEO Website Audit</Link>
                <Link to="/services#answer-focused-content">Answer-Focused Content</Link>
                <Link to="/services#authority-building">Authority Building</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <CTASection />
    </>
  );
}
