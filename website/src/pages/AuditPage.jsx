import { PageHero } from '../components/common/PageHero.jsx';
import { CheckList } from '../components/ui/CheckList.jsx';
import { fullAuditChecks } from '../data/audit.js';
import { ShieldCheck } from 'lucide-react';
import { InquiryForm } from '../features/inquiries/components/InquiryForm.jsx';

export function Audit() {
  return (
    <>
      <PageHero path="/aeo-audit" label="Start with understanding" />
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
          <span
            className={[
              'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
              'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
            ].join(' ')}
          >
            A practical, complete review
          </span>
          <h2>
            Find the gaps.
            <br />
            Know what to do next.
          </h2>
          <p>
            We look at the whole picture, from the questions your pages answer to the
            signals that establish your expertise.
          </p>
          <CheckList items={fullAuditChecks} />
          <div
            className={[
              'info-callout p-[22px] bg-[#f3f7ff] border border-[#e1eafb] rounded-[10px] flex gap-[14px]',
              'mt-[28px] [&>svg]:text-[#2563eb] [&_h3]:text-[13px] [&_h3]:mb-[7px] [&_p]:text-[12px]',
            ].join(' ')}
          >
            <ShieldCheck size={23} />
            <div>
              <h3>Clarity, without inflated promises</h3>
              <p>
                No guaranteed citations or rankings. Just a useful review of your website
                and a prioritised path forward.
              </p>
            </div>
          </div>
        </div>
        <InquiryForm audit />
      </section>
    </>
  );
}
