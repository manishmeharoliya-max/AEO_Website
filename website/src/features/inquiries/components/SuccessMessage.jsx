import { CircleCheck } from 'lucide-react';

export function SuccessMessage({ audit, onReset }) {
  return (
    <div
      className={[
        'success-state border border-[#d6e8df] py-[45px] px-[35px] bg-[#f6fbf8] rounded-[13px]',
        'text-center [&>svg]:text-[#27896b] [&>svg]:mt-0 [&>svg]:mx-auto [&>svg]:mb-[20px] [&_h2]:text-[28px]',
        '[&_h2]:mb-[15px] [&_.form-note]:block',
      ].join(' ')}
      role="status"
    >
      <CircleCheck size={44} />
      <h2>Thank you!</h2>
      <p>
        {audit
          ? 'Your audit request has been received. Our team will contact you shortly.'
          : 'Your message has been received. Thank you for telling us about your business.'}
      </p>
      <p className="form-note flex gap-[7px] items-start text-[10px] leading-[1.7] my-[20px] mx-0 text-[#7c899e]">
        Your details have been saved for our team to review.
      </p>
      <button
        className={[
          'button inline-flex justify-center items-center gap-[13px] bg-[#2563eb] text-white',
          'min-h-[47px] py-[13px] px-[20px] border border-[#2563eb] rounded-[7px] text-[12px]',
          'font-semibold leading-[1.5] whitespace-nowrap shadow-[0_3px_6px_#2563eb0c] hover:bg-[#1d4ed8]',
          'hover:shadow-[0_5px_15px_#2563eb20] hover:[transform:translateY(-1px)] button-secondary',
          '[&.button-secondary]:bg-white [&.button-secondary]:border-[#dbe2eb]',
          '[&.button-secondary]:text-[#334155] [&.button-secondary]:shadow-none',
          '[&.button-secondary:hover]:bg-[#f3f7fc] [&.button-secondary:hover]:border-[#b5c7e5]',
        ].join(' ')}
        onClick={onReset}
      >
        Submit another {audit ? 'request' : 'message'}
      </button>
    </div>
  );
}
