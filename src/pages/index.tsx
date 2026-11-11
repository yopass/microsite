import React, { useEffect, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import CheckoutModal from '../components/CheckoutModal';
// The page body is plain HTML: the design kit in static/assets styles and animates it, so React
// only mounts it and opens the checkout.
import body from './_home/body.html';

const TITLE = 'Yopass: encrypted secret sharing you host yourself';
const DESCRIPTION = 'Share passwords, API keys and files through one-time links that are encrypted in the browser. Open source and self-hosted, with a business license for €149 a year.';

// Docusaurus re-renders the page on every location change, a #pricing click included, and React then
// writes the HTML in again: the kit's scripts stay bound to the old nodes and the sections go blank.
// Memoized with no props, the body renders once and later re-renders of Home never reach it.
const BODY = { __html: body };
const Body = React.memo(React.forwardRef<HTMLDivElement>(function Body(_, ref) {
  return <div id="home" ref={ref} dangerouslySetInnerHTML={BODY} />;
}));

export default function Home(): React.ReactElement {
  const root = useRef<HTMLDivElement>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-checkout]')) setCheckoutOpen(true);
    };
    el.addEventListener('click', onClick);

    // The kit's scripts only run when the server sent this page, and they keep document-level
    // listeners. So the home page is always its own document: arriving or leaving by client-side
    // navigation (the docs logo, back and forward) reloads.
    // shortcut: a full reload on those navigations, upgrade if the kit ever gets mount/unmount hooks
    const w = window as unknown as { __homeParsed?: number };
    if (!w.__homeParsed) {
      // once in a row: if the flag can never be set (inline scripts blocked), do not loop; blocked storage never reloads
      let first = false;
      try { first = !sessionStorage.getItem('home-reload'); sessionStorage.setItem('home-reload', '1'); } catch { /* storage blocked */ }
      if (first) { window.location.reload(); return; }
    } else {
      delete w.__homeParsed;
    }
    // cleared on both paths, so a reload that failed once does not switch the reload off for the session
    try { sessionStorage.removeItem('home-reload'); } catch { /* storage blocked */ }
    return () => { el.removeEventListener('click', onClick); window.location.reload(); };
  }, []);

  return (
    <>
      <Head>
        <html lang="en" data-type="software" data-radius="sharp" data-ground="sand" data-buttons="tonal" data-motion="" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://yopass.se/img/share.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://yopass.se/" />
        <meta name="site-kind" content="software" />
        <meta name="page-type" content="software" />
        <script>{`document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)`}</script>
        <script>{`document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)`}</script>
        <link rel="modulepreload" href="/assets/moments/moments.js" />
        <link rel="modulepreload" href="/assets/moments/lib.js" />
        <link rel="modulepreload" href="/assets/moments/word-highlight/moment.js" />
        <link rel="modulepreload" href="/assets/moments/pinned-chapters/moment.js" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Yopass',
          description: 'Open source end-to-end encrypted secret sharing with self-destructing one-time links.',
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Web',
          url: 'https://yopass.se',
          logo: 'https://yopass.se/logo/yopass-full.svg',
          author: { '@type': 'Person', name: 'Johan Haals', url: 'https://github.com/jhaals' },
          offers: [
            { '@type': 'Offer', name: 'Open Source', price: '0', priceCurrency: 'USD', description: 'Free forever. Self-hosted, end-to-end encryption, one-time secret links.' },
            { '@type': 'Offer', name: 'Business License', price: '149', priceCurrency: 'EUR', description: 'Secret requests, read receipts, webhooks, custom branding, higher upload limits. Billed annually.' },
          ],
          featureList: ['End-to-end encryption', 'Self-destructing links', 'One-time downloads', 'No account required', 'Open source', 'Docker and Kubernetes support'],
          isAccessibleForFree: true,
          license: 'https://github.com/jhaals/yopass/blob/master/LICENSE',
        })}</script>
      </Head>
      <Body ref={root} />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
