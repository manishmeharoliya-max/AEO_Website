import { useState, useId } from 'react';
import { faqs } from '../../data/faqs.js';
import { ChevronDown } from 'lucide-react';

export function FAQAccordion() {
  const [open, setOpen] = useState(0);
  const id = useId();
  return (
    <div className="faq-list">
      {faqs.map(([q, a], i) => (
        <div
          className={[
            [
              'faq-item border-b border-b-[#e0e6ef] first:border-t first:border-t-[#e0e6ef]',
              '[&_button]:w-full [&_button]:flex [&_button]:items-center [&_button]:justify-between',
              '[&_button]:gap-[15px] [&_button]:text-left [&_button]:[background:none] [&_button]:border-0',
              '[&_button]:py-[21px] [&_button]:px-0 [&_button]:text-[13px] [&_button]:font-[550]',
              '[&_button]:text-[#31455e] [&_button_svg]:text-[#8291a7]',
              '[&_button_svg]:[transition:transform_0.2s] [&.is-open_button_svg]:[transform:rotate(180deg)]',
              '[&.is-open_button_svg]:text-[#2563eb] [&_p]:pb-[22px] [&_p]:text-[12px] [&_p]:leading-[1.85]',
              'max-[720px]:[&_button]:text-[13px] max-[720px]:[&_button]:py-[19px]',
            ].join(' '),
            open === i ? 'is-open' : '',
          ].join(' ')}
          key={q}
        >
          <h3>
            <button
              id={`${id}-q-${i}`}
              aria-expanded={open === i}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {q}
              <ChevronDown size={19} />
            </button>
          </h3>
          <div
            id={`${id}-${i}`}
            role="region"
            aria-labelledby={`${id}-q-${i}`}
            hidden={open !== i}
          >
            <p>{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
