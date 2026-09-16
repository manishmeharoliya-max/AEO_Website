import { Button } from '../components/ui/Button.jsx';

export function NotFound() {
  return (
    <section
      className={[
        'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
        'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] not-found py-[110px]',
        'text-center min-h-[60vh] [&_.eyebrow]:justify-center [&_p]:max-w-[520px]',
        '[&_p]:mt-[23px] [&_p]:mx-auto [&_p]:mb-[30px] max-[720px]:[&_h1]:text-[40px]',
      ].join(' ')}
    >
      <span
        className={[
          'eyebrow flex items-center gap-[8px] text-[11px] tracking-[1.8px] uppercase font-bold',
          'text-[#2563eb] mb-[17px] max-[720px]:text-[10px] max-[720px]:tracking-[1.5px]',
        ].join(' ')}
      >
        404 / A question without a page
      </span>
      <h1>This answer isn’t here.</h1>
      <p>
        The page may have moved, or the address may be incorrect. Let’s get you back to a
        useful starting point.
      </p>
      <Button to="/">Back to Home</Button>
    </section>
  );
}
