import { MessageCircle, Phone } from 'lucide-react';
import { brand } from '../../config/brand.js';

export function WhatsAppEnquiry() {
  const number = brand.whatsappNumber.replace(/\D/g, '');
  if (!number || number.length < 8 || number.length > 15) return null;

  const message = encodeURIComponent(
    `Hi, I would like to enquire about ${brand.name}'s AEO services.`,
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      title="Enquire on WhatsApp"
      className="fixed right-[22px] bottom-[22px] z-[25] grid size-[54px] place-items-center rounded-full bg-[#25d366] text-white shadow-[0_5px_20px_#102a4333] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#128c7e] max-[720px]:right-[13px] max-[720px]:bottom-[13px]"
    >
      <MessageCircle size={29} strokeWidth={2.1} aria-hidden="true" />
      <Phone
        size={13}
        strokeWidth={2.3}
        aria-hidden="true"
        className="absolute rotate-[-20deg]"
      />
    </a>
  );
}
