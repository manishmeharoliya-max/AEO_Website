import { PageHero } from '../components/common/PageHero.jsx';
import { detailedServices } from '../data/services.js';
import { slugify } from '../utils/slugify.js';
import { Icon } from '../components/ui/Icon.jsx';
import { Button } from '../components/ui/Button.jsx';
import { CheckList } from '../components/ui/CheckList.jsx';
import { CTASection } from '../components/common/CTASection.jsx';

export function Services() {
  return (
    <>
      <PageHero path="/services" label="Built around your business" />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] section py-[88px]',
          'max-[950px]:py-[65px] max-[720px]:py-[55px] detail-list [&.detail-list]:pt-[20px]',
          'max-[950px]:[&.detail-list]:pt-[65px] max-[720px]:[&.detail-list]:pt-[55px]',
        ].join(' ')}
      >
        {detailedServices.map((service, index) => (
          <article
            className={[
              'service-detail grid grid-cols-[1fr_1.15fr] gap-[85px] py-[58px] px-0',
              'border-b border-b-[#e2e8f0] scroll-mt-[90px] [&_h2]:flex [&_h2]:gap-[13px]',
              '[&_h2]:items-center [&_h2]:text-[29px] [&_h2]:my-[18px] [&_h2]:mx-0 [&_h2_svg]:text-[#2563eb]',
              '[&>div>p]:mb-[24px] [&>div>p]:text-[14px] [&_h3]:text-[14px]',
              '[&_.check-list]:mt-[15px] [&_.check-list]:mx-0 [&_.check-list]:mb-[24px] max-[1150px]:gap-[45px] max-[720px]:grid-cols-[1fr]',
              'max-[720px]:gap-[30px] max-[720px]:py-[38px] max-[720px]:[&_h2]:text-[26px]',
            ].join(' ')}
            id={slugify(service.title)}
            key={service.title}
          >
            <div>
              <span className="detail-number text-[10px] tracking-[1.5px] text-[#8090a7]">
                0{index + 1} / OUR SERVICES
              </span>
              <h2>
                <Icon name={service.icon} size={26} />
                {service.title}
              </h2>
              <p>{service.description}</p>
              <Button to="/contact">Discuss this service</Button>
            </div>
            <div>
              <h3>What is included</h3>
              <CheckList items={service.included} />
              <div
                className={[
                  'service-facts grid grid-cols-[1fr_1fr] gap-[24px] [&_p]:text-[12px] [&_p]:mt-[7px]',
                  'max-[720px]:gap-[18px]',
                ].join(' ')}
              >
                <div>
                  <h3>Who it is for</h3>
                  <p>{service.audience}</p>
                </div>
                <div>
                  <h3>Expected business value</h3>
                  <p>{service.value}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <CTASection />
    </>
  );
}
