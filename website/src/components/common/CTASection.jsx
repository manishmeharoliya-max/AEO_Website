import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function CTASection() {
  return (
    <section
      className={[
        'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
        'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] cta-section py-[72px]',
        'max-[720px]:py-[48px]',
      ].join(' ')}
    >
      <div
        className={[
          'cta-inner',
          '[background:linear-gradient(white,_white)_padding-box,_linear-gradient(110deg,_#c9dcff,_#e0d0fc)_border-box]',
          'border border-[transparent] rounded-[13px] py-[49px] px-[28px] text-center relative',
          '[&_.eyebrow]:justify-center [&_.eyebrow]:text-[9px] [&_h2]:text-[31px]',
          '[&_p]:mt-[15px] [&_p]:mx-0 [&_p]:mb-[24px] [&_p]:text-[13px] [&_.button-row]:justify-center',
          'max-[720px]:py-[36px] max-[720px]:px-[20px] max-[720px]:[&_h2]:text-[27px] max-[720px]:[&_p]:text-[12px]',
          'max-[720px]:[&_.button]:text-[11px] max-[380px]:[&_.button-row]:flex-col',
        ].join(' ')}
      >
        <span
          className={[
            'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
            'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
          ].join(' ')}
        >
          <Sparkles size={15} /> Your next chapter in search
        </span>
        <h2>Ready to improve your AI search visibility?</h2>
        <p>
          Start with a clear analysis of your website, competitors and biggest answer
          opportunities.
        </p>
        <div className="button-row flex gap-[12px] flex-wrap">
          <Button>Get Free AEO Analysis</Button>
          <Button to="/contact" secondary>
            Book a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
