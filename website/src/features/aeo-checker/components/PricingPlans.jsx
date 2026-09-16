import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { plans } from '../../../data/plans.js';

export function PricingPlans({ website }) {
  return (
    <section
      className="checker-plans mt-[55px] [&_.eyebrow]:justify-center max-[720px]:[&_.grid-3]:gap-[25px]"
      aria-labelledby="aeo-plans-heading"
    >
      <div
        className={[
          'section-heading flex justify-between items-end gap-[25px] mb-[37px] [&_p]:mt-[15px]',
          '[&_p]:max-w-[660px] [&_p]:text-[14px] [&.center]:block [&.center]:text-center',
          '[&.center]:max-w-[720px] [&.center]:mx-auto [&.center]:mb-[40px] [&>.button]:shrink-0',
          '[&>.button]:mb-[4px] max-[950px]:[&_h2]:text-[31px] max-[720px]:items-start',
          'max-[720px]:flex-col max-[720px]:gap-[22px] max-[720px]:mb-[28px]',
          'max-[720px]:[&.center]:mb-[28px] max-[720px]:[&_h2]:text-[29px] max-[720px]:[&_p]:text-[13px]',
          'center [&.center_.eyebrow]:justify-center [&.center_p]:mx-auto',
        ].join(' ')}
      >
        <span
          className={[
            'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
            'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
          ].join(' ')}
        >
          A practical next step
        </span>
        <h2 id="aeo-plans-heading">Turn your findings into a plan.</h2>
        <p>
          Choose the level of help that fits your website. All starting prices are in USD.
        </p>
      </div>
      <div className="grid-3 grid grid-cols-3 gap-[22px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[18px]">
        {plans.map((plan) => {
          const query = new URLSearchParams({
            plan: plan.id,
            website,
          });
          return (
            <article
              className={[
                [
                  'plan-card relative py-[30px] px-[25px] border border-[#dbe5f3] bg-white rounded-[12px]',
                  'flex flex-col [&_h3]:text-[22px] [&_h3]:mb-[8px] [&_p]:text-[12px] [&_ul]:list-none',
                  '[&_ul]:p-0 [&_ul]:my-[20px] [&_ul]:mx-0 [&_ul]:grid [&_ul]:gap-[14px] [&_li]:flex [&_li]:gap-[8px]',
                  '[&_li]:text-[12px] [&_li]:leading-[1.7] [&_li_svg]:text-[#2563eb] [&_li_svg]:mt-[3px]',
                  '[&_.plan-note]:text-[10px] [&_.plan-note]:mt-auto [&_.plan-note]:mb-[18px]',
                ].join(' '),
                plan.featured
                  ? [
                      'plan-featured [&.plan-featured]:border-[#2563eb]',
                      '[&.plan-featured]:shadow-[0_10px_25px_#2563eb0a]',
                    ].join(' ')
                  : '',
              ].join(' ')}
              key={plan.id}
            >
              {plan.featured && (
                <span
                  className={[
                    'plan-badge absolute top-[-12px] left-[22px] bg-[#2563eb] text-[white] py-[5px] px-[11px]',
                    'rounded-[5px] text-[10px]',
                  ].join(' ')}
                >
                  Ongoing improvement
                </span>
              )}
              <h3>{plan.name}</h3>
              <p>{plan.audience}</p>
              <div
                className={[
                  'plan-price flex items-baseline flex-wrap gap-x-[6px] mt-[23px] mx-0 mb-[17px] [&_small]:w-full',
                  '[&_small]:text-[10px] [&_small]:text-[#64748b] [&_strong]:text-[39px]',
                  '[&_strong]:tracking-[-1.5px] [&_strong]:text-[#102a43] [&_span]:text-[12px]',
                  '[&_span]:text-[#64748b]',
                ].join(' ')}
              >
                <small>From</small>
                <strong>${plan.price.toLocaleString('en-US')}</strong>
                <span>{plan.interval}</span>
              </div>
              <div className="plan-scope text-[11px] font-semibold pb-[15px] mb-[15px] border-b border-b-[#e2e8f0]">
                {plan.scope}
              </div>
              <p>{plan.description}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="plan-note">{plan.note}</p>
              <Link
                className={[
                  [
                    'button inline-flex justify-center items-center gap-[13px] bg-[#2563eb] text-white',
                    'min-h-[47px] py-[13px] px-[20px] border border-[#2563eb] rounded-[7px] text-[12px]',
                    'font-semibold leading-[1.5] whitespace-nowrap shadow-[0_3px_6px_#2563eb0c] hover:bg-[#1d4ed8]',
                    'hover:shadow-[0_5px_15px_#2563eb20] hover:[transform:translateY(-1px)]',
                  ].join(' '),
                  plan.featured
                    ? ''
                    : [
                        'button-secondary [&.button-secondary]:bg-white [&.button-secondary]:border-[#dbe2eb]',
                        '[&.button-secondary]:text-[#334155] [&.button-secondary]:shadow-none',
                        '[&.button-secondary:hover]:bg-[#f3f7fc] [&.button-secondary:hover]:border-[#b5c7e5]',
                      ].join(' '),
                ].join(' ')}
                to={`/checkout?${query}`}
              >
                Choose {plan.name}
                <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
      </div>
      <p className="plans-disclosure text-[11px] mt-[20px] mx-auto mb-0 text-center max-w-[800px]">
        Final scope and quote follow a website review. Monthly plans are billed monthly
        only after a separate agreement; taxes, if applicable, are additional. No payment
        is taken here. No plan guarantees AI placement or citations.
      </p>
    </section>
  );
}
