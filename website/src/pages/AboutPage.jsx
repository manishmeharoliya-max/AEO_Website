import { PageHero } from '../components/common/PageHero.jsx';
import { Sparkles, Check, Users } from 'lucide-react';
import { brand } from '../config/brand.js';
import { SectionHeading } from '../components/common/SectionHeading.jsx';
import { CTASection } from '../components/common/CTASection.jsx';

export function About() {
  return (
    <>
      <PageHero path="/about" label="Clear thinking. Useful answers." />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] section py-[88px]',
          'max-[950px]:py-[65px] max-[720px]:py-[55px]',
        ].join(' ')}
      >
        <div
          className={[
            'about-intro text-center max-w-[760px] mt-0 mx-auto mb-[65px] [&_h2]:mt-[25px] [&_h2]:mx-0 [&_h2]:mb-[20px]',
            '[&_p]:text-[16px] max-[720px]:mb-[40px] max-[720px]:[&_h2]:text-[28px]',
            'max-[720px]:[&_p]:text-[14px]',
          ].join(' ')}
        >
          <span
            className={[
              'icon-box inline-flex w-[47px] h-[47px] items-center justify-center rounded-[11px]',
              'bg-[#eaf2ff] text-[#2563eb]',
            ].join(' ')}
          >
            <Sparkles size={27} />
          </span>
          <h2>
            A clearer connection between
            <br />
            your expertise and your customers.
          </h2>
          <p>
            {brand.name} is an Answer Engine Optimization agency focused on helping
            businesses communicate their expertise clearly across traditional and
            AI-powered search experiences.
          </p>
        </div>
        <div
          className={[
            'grid-2 grid grid-cols-2 gap-[78px] items-center about-cards [&.about-cards]:items-stretch',
            '[&.about-cards]:gap-[25px] [&.about-cards]:mb-[70px]',
            '[&.about-cards_article]:border [&.about-cards_article]:border-[#e2e8f0] [&.about-cards_article]:rounded-[12px]',
            '[&.about-cards_article]:p-[34px] [&.about-cards_article]:bg-[#f9fbfe]',
            '[&.about-cards_h2]:text-[27px] [&.about-cards_h2]:mb-[18px] [&.about-cards_p]:text-[14px]',
            'max-[720px]:[&.about-cards]:grid-cols-[1fr] max-[720px]:[&.about-cards]:mb-[45px]',
            'max-[720px]:[&.about-cards_article]:p-[28px]',
          ].join(' ')}
        >
          <article>
            <span
              className={[
                'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
                'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
              ].join(' ')}
            >
              01 / Our mission
            </span>
            <h2>Make useful businesses easier to discover.</h2>
            <p>
              To help useful and reliable businesses become easier to understand, trust
              and discover.
            </p>
          </article>
          <article>
            <span
              className={[
                'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
                'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
              ].join(' ')}
            >
              02 / Our approach
            </span>
            <h2>
              Research first.
              <br />
              Purpose in every recommendation.
            </h2>
            <p>
              We combine research, content strategy, technical SEO and transparent
              measurement. Every recommendation is connected to a real customer question
              or business objective.
            </p>
          </article>
        </div>
        <SectionHeading label="What guides us" title="Our values" />
        <div
          className={[
            'values-row flex flex-wrap gap-[15px] [&>span]:flex [&>span]:items-center [&>span]:gap-[8px]',
            '[&>span]:border [&>span]:border-[#e2e8f0] [&>span]:py-[14px] [&>span]:px-[18px] [&>span]:rounded-[7px]',
            '[&>span]:text-[12px] [&_svg]:text-[#2563eb] max-[720px]:gap-[10px]',
            'max-[720px]:[&>span]:text-[11px]',
          ].join(' ')}
        >
          {[
            'Clarity',
            'Accuracy',
            'Transparency',
            'Continuous learning',
            'Customer-focused strategy',
          ].map((value) => (
            <span key={value}>
              <Check size={17} />
              {value}
            </span>
          ))}
        </div>
        <div
          className={[
            'team-placeholder text-center [border:1px_dashed_#cedbec] rounded-[12px] py-[50px] px-[25px]',
            'mt-[70px] bg-[#fafbfd] [&>svg]:text-[#7993bc] [&>svg]:mt-0 [&>svg]:mx-auto [&>svg]:mb-[18px] [&_h2]:text-[27px]',
            '[&_h2]:mb-[13px] max-[720px]:mt-[45px] max-[720px]:py-[35px] max-[720px]:px-[20px]',
            'max-[720px]:[&_h2]:text-[25px]',
          ].join(' ')}
        >
          <Users size={34} />
          <h2>Meet the team behind {brand.name}</h2>
          <p>Team profiles and professional photographs will be added here.</p>
        </div>
      </section>
      <CTASection />
    </>
  );
}
