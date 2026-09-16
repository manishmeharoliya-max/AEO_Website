export function SectionHeading({ label, title, description, center = false, children }) {
  return (
    <div
      className={[
        [
          'section-heading flex justify-between items-end gap-[25px] mb-[37px] [&_p]:mt-[15px]',
          '[&_p]:max-w-[660px] [&_p]:text-[14px] [&.center]:block [&.center]:text-center',
          '[&.center]:max-w-[720px] [&.center]:mx-auto [&.center]:mb-[40px] [&>.button]:shrink-0',
          '[&>.button]:mb-[4px] max-[950px]:[&_h2]:text-[31px] max-[720px]:items-start',
          'max-[720px]:flex-col max-[720px]:gap-[22px] max-[720px]:mb-[28px]',
          'max-[720px]:[&.center]:mb-[28px] max-[720px]:[&_h2]:text-[29px] max-[720px]:[&_p]:text-[13px]',
        ].join(' '),
        center ? 'center [&.center_.eyebrow]:justify-center [&.center_p]:mx-auto' : '',
      ].join(' ')}
    >
      <div>
        {label && (
          <span
            className={[
              'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
              'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
            ].join(' ')}
          >
            {label}
          </span>
        )}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
