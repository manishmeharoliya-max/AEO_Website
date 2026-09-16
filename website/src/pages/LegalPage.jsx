import { PageHero } from '../components/common/PageHero.jsx';

export function Legal({ privacy = false }) {
  const path = privacy ? '/privacy-policy' : '/terms-and-conditions';
  const content = privacy
    ? [
        [
          'About this website',
          'This is a frontend demonstration of the AnswerEdge website. This policy describes the behaviour implemented in this project. It must be reviewed against the actual hosting and business practices before a public launch.',
        ],
        [
          'Information you enter',
          'Contact and audit forms hold the information you enter in temporary React component memory. Form submissions are not sent to a server, emailed, or stored in a database, browser storage or cookies. Reloading the page or leaving the form clears this temporary information.',
        ],
        [
          'Website readiness checker',
          'The homepage checker sends the URL you enter to our analysis server, which requests that public page and examines its initial HTML. The application does not save submitted URLs, fetched HTML or reports to a database. The server temporarily counts requests by IP address for rate limiting, for up to one minute. Hosting and target websites may record ordinary access logs. Choosing a plan carries your website URL in the contact-page address; avoid submitting private or sensitive URLs.',
        ],
        [
          'Cookies and analytics',
          'This frontend does not implement analytics, advertising trackers or cookies. A hosting provider may process standard request information, such as IP addresses and access logs; its practices need to be reviewed separately.',
        ],
        [
          'External links and email',
          'Selecting an email link opens your email application. Information you then send is handled by your email provider and the recipient. The contact email on this demonstration is a placeholder.',
        ],
        [
          'Questions and updates',
          'Contact details and any applicable privacy-rights process must be confirmed before launch. This policy should be updated if form delivery, analytics or other data processing is introduced.',
        ],
      ]
    : [
        [
          'Using this demonstration',
          'This website presents information about Answer Engine Optimization services. The current frontend is a demonstration; submitting a form does not establish a client relationship, book a consultation or place an order.',
        ],
        [
          'Information and expectations',
          'Content is provided for general information. Search platforms operate independently, and no ranking, citation, recommendation or business outcome is guaranteed. Any future paid work would require a separate agreement defining scope and terms.',
        ],
        [
          'Responsible use',
          'Use the website lawfully. Do not attempt to disrupt its operation or submit content that infringes the rights of others.',
        ],
        [
          'Names and third-party platforms',
          'Google, ChatGPT, Bing and other product names belong to their respective owners. AnswerEdge is not affiliated with these platforms. References describe the search experiences discussed on the website.',
        ],
        [
          'Before public launch',
          'These demonstration terms require review for the actual business entity, jurisdiction, service arrangements and contact information before public use.',
        ],
      ];
  return (
    <>
      <PageHero path={path} label="Website information" />
      <section
        className={[
          'site-container w-[min(1180px,_calc(100%_-_80px))] mx-auto max-[1150px]:w-[calc(100%_-_56px)]',
          'max-[720px]:w-[calc(100%_-_40px)] max-[380px]:w-[calc(100%_-_32px)] section py-[88px]',
          'max-[950px]:py-[65px] max-[720px]:py-[55px] legal-content max-w-[780px] [&>section]:mb-[32px]',
          '[&_h2]:text-[25px] [&_h2]:mb-[14px]',
        ].join(' ')}
      >
        <p className="legal-date text-[12px] mb-[35px]">
          Last updated: 15 September 2026
        </p>
        {content.map(([title, copy]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </section>
        ))}
      </section>
    </>
  );
}
