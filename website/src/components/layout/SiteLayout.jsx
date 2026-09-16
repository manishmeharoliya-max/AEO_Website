import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { SEO } from '../common/SEO.jsx';
import { ScrollToTop } from '../common/ScrollToTop.jsx';

export function SiteLayout({ children }) {
  return (
    <>
      <a
        className={[
          'skip-link fixed top-[-60px] left-[20px] bg-[#2563eb] text-[white] p-[12px] z-[100]',
          'focus:top-[10px]',
        ].join(' ')}
        href="#main"
      >
        Skip to content
      </a>
      <SEO />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
