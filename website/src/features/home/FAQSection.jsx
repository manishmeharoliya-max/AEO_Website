import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FAQAccordion } from '../../components/common/FAQAccordion.jsx';

export function FAQSection() {
  return (
    <section className="section py-[88px] max-[950px]:py-[65px] max-[720px]:py-[55px] secondary bg-[#f7f9fc]">
      <div
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] faq-layout grid',
          'grid-cols-[0.8fr_1.2fr] gap-[80px] [&>div>p]:mt-[16px] [&>div>p]:mx-0 [&>div>p]:mb-[23px] max-[950px]:gap-[40px]',
          'max-[720px]:grid-cols-[1fr] max-[720px]:gap-[30px] max-[720px]:[&_h2_br]:hidden',
        ].join(' ')}
      >
        <div>
          <span
            className={[
              'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
              'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
            ].join(' ')}
          >
            A little more clarity
          </span>
          <h2>
            Frequently
            <br />
            asked questions
          </h2>
          <p>New to AEO? Start here.</p>
          <Link
            className={[
              'text-link text-[#2563eb] inline-flex items-center gap-[10px] text-[12px] font-semibold',
              'hover:gap-[14px]',
            ].join(' ')}
            to="/contact"
          >
            Have another question? Let’s talk <ArrowRight size={15} />
          </Link>
        </div>
        <FAQAccordion />
      </div>
    </section>
  );
}
