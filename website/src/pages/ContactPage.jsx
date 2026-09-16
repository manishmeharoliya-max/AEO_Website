import { PageHero } from '../components/common/PageHero.jsx';
import { Mail, Globe, Clock, Sparkles } from 'lucide-react';
import { brand } from '../config/brand.js';
import { InquiryForm } from '../features/inquiries/components/InquiryForm.jsx';
import { useSearchParams } from 'react-router-dom';
import { plans } from '../data/plans.js';

export function Contact() {
  const [searchParams] = useSearchParams();
  const selectedPlan = plans.find((plan) => plan.id === searchParams.get('plan'));
  const website = (searchParams.get('website') || '').slice(0, 2048);
  const initialValues = selectedPlan
    ? {
        website,
        service: 'AEO Website Audit',
        message: `I am interested in the ${selectedPlan.name} plan, starting at $${selectedPlan.price} ${selectedPlan.interval}. Please review my website and confirm the scope and quote.`,
      }
    : {};
  return (
    <>
      <PageHero path="/contact" label="Let’s find your starting point" />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] section py-[88px]',
          'max-[950px]:py-[65px] max-[720px]:py-[55px] form-layout grid grid-cols-[0.85fr_1.15fr]',
          'gap-[85px] items-start [&>div>p]:mt-[20px] [&>div>p]:text-[14px] max-[1150px]:gap-[45px]',
          'max-[950px]:gap-[30px] max-[950px]:grid-cols-[0.8fr_1.2fr] max-[720px]:grid-cols-[1fr]',
          'max-[720px]:gap-[35px]',
        ].join(' ')}
      >
        <div>
          <h2>
            Good strategy starts
            <br />
            with a conversation.
          </h2>
          <p>
            Share what you do, who you serve and where search is falling short. We’ll use
            that context to discuss a practical next step.
          </p>
          <div
            className={[
              'contact-details grid gap-[27px] mt-[37px] [&>div]:flex [&>div]:gap-[15px]',
              '[&_svg]:text-[#2563eb] [&_svg]:w-[20px] [&_svg]:mt-[3px] [&_h3]:text-[13px] [&_h3]:mb-[6px]',
              '[&_a]:text-[13px] [&_p]:text-[13px] [&_small]:block [&_small]:text-[10px]',
              '[&_small]:text-[#8590a1] [&_small]:mt-[6px]',
            ].join(' ')}
          >
            <div>
              <Mail />
              <section>
                <h3>Email</h3>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
                <small>Placeholder email — replace before launch.</small>
              </section>
            </div>
            <div>
              <Globe />
              <section>
                <h3>Location</h3>
                <p>Serving businesses worldwide</p>
              </section>
            </div>
            <div>
              <Clock />
              <section>
                <h3>Working hours</h3>
                <p>Monday to Friday</p>
              </section>
            </div>
          </div>
          <div
            className={[
              'info-callout p-[22px] bg-[#f3f7ff] border border-[#e1eafb] rounded-[10px] flex gap-[14px]',
              'mt-[28px] [&>svg]:text-[#2563eb] [&_h3]:text-[13px] [&_h3]:mb-[7px] [&_p]:text-[12px]',
            ].join(' ')}
          >
            <Sparkles size={22} />
            <p>
              Not sure what you need yet? Choose “Other / not sure yet” and tell us a
              little about your website.
            </p>
          </div>
        </div>
        <InquiryForm
          key={`${selectedPlan?.id || 'contact'}-${website}`}
          initialValues={initialValues}
          selectedPlan={selectedPlan}
        />
      </section>
    </>
  );
}
