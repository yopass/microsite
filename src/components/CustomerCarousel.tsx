import React, { useEffect, useRef, useState } from 'react';

const companies = [
  { name: 'Spotify', logo: 'spotify.svg' },
  { name: 'Milwaukee Tool', logo: 'milwaukee.svg' },
  { name: 'Hydrolix', logo: 'hydrolix.svg' },
  { name: 'BeamNG', logo: 'beamng.svg' },
  { name: 'Lightspeed Commerce', logo: 'lightspeed.svg' },
  { name: 'Orange Business', logo: 'orange-business.svg' },
  { name: 'Einride', logo: 'einride.svg' },
  { name: 'Monese', logo: 'monese.svg' },
  { name: 'Unikie', logo: 'unikie.svg' },
  { name: 'Elisa', logo: 'elisa.svg' },
  { name: 'Bechtle', logo: 'bechtle.svg' },
  { name: 'Stillfront Group', logo: 'stillfront.svg' },
  { name: 'Doddle', logo: 'doddle.png' },
  { name: 'Gumtree Australia', logo: 'gumtree.png' },
  { name: 'Funnel', logo: 'funnel.svg' },
];

export default function CustomerCarousel(): React.ReactElement {
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section.current!);
    const updateVisibility = () => setHidden(document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="companies-heading" className="customer-carousel mt-12 md:mt-14 pt-6 border-t border-gray-200/80">
      <h2 id="companies-heading" className="customer-carousel-heading">Used by teams at</h2>
      <div className="customer-carousel-window">
        <div className="customer-carousel-track" data-paused={paused || !visible || hidden}>
          {[false, true].map(duplicate => (
            <ul key={String(duplicate)} className="customer-carousel-group" aria-hidden={duplicate || undefined}>
              {companies.map(({ name, logo }) => (
                <li key={name}>
                  <img src={`/logo/customers/${logo}`} alt={duplicate ? '' : name} width={120} height={30} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button type="button" className="customer-carousel-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume customer carousel' : 'Pause customer carousel'}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M7 4v16l13-8z" /> : <path d="M6 4h4v16H6zm8 0h4v16h-4z" />}
        </svg>
      </button>
    </section>
  );
}
