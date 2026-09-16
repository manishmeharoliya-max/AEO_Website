import { brand } from '../../config/brand.js';
import { CheckList } from '../../components/ui/CheckList.jsx';
import { values } from '../../data/company.js';
import { Sparkles } from 'lucide-react';

export function WhyChooseUsSection() {
  return (
    <section className="section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] secondary bg-[#f7f9fc]">
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] split-grid grid',
          'grid-cols-2 gap-[78px] items-center [&>div>p]:mt-[17px] [&>div>p]:max-w-[440px]',
          'max-[1150px]:gap-[45px] max-[720px]:grid-cols-[1fr] max-[720px]:gap-[35px] why-section',
          '[&.why-section]:gap-[100px] max-[720px]:[&.why-section]:gap-[35px]',
        ].join(' ')}
      >
        <div>
          <span
            className={[
              'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
              'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
            ].join(' ')}
          >
            The {brand.name} approach
          </span>
          <h2>
            Practical AEO without
            <br />
            unrealistic promises
          </h2>
          <p>
            Good search strategy starts with useful information and honest expectations.
          </p>
          <CheckList items={values} />
        </div>
        <div
          className={[
            'principle-card bg-white border border-[#e2e8f2] rounded-[12px] py-[34px] px-[38px]',
            'relative [&_h3]:text-[23px] [&_h3]:leading-[1.6] [&_h3]:font-medium [&_h3]:tracking-[-0.5px]',
            '[&_h3>span]:text-[#2563eb] [&>div]:border-t [&>div]:border-t-[#edf0f5] [&>div]:mt-[27px]',
            '[&>div]:pt-[20px] [&>div]:flex [&>div]:items-center [&>div]:gap-[9px] [&>div]:text-[10px]',
            '[&>div]:text-[#8590a1] max-[950px]:p-[27px] max-[950px]:[&_h3]:text-[21px]',
            'max-[720px]:p-[30px] max-[720px]:[&_h3]:text-[23px]',
          ].join(' ')}
        >
          <span
            className={[
              'quote-symbol [font-family:Georgia,_serif] text-[72px] text-[#cddcf9] leading-[0.8] block',
              'mb-[14px]',
            ].join(' ')}
          >
            “
          </span>
          <h3>
            We focus on making your business easier to{' '}
            <span>understand, trust and discover</span>—without promising guaranteed
            placement on any AI platform.
          </h3>
          <div>
            <span
              className={[
                'mini-mark bg-[#edf2ff] text-[#2563eb] w-[31px] h-[31px] rounded-[7px] inline-grid',
                'place-items-center',
              ].join(' ')}
            >
              <Sparkles size={17} />
            </span>
            Our commitment to you
          </div>
        </div>
      </div>
    </section>
  );
}
