import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Link } from 'react-router-dom';
import { footerColumns } from '../data/site';
import { Container } from './Container';
const logoUrl = new URL('../Images/GharKakhana Logo.png', import.meta.url).href;

export function SiteFooter() {
  const footerRef = useRef(null);
  const logoWrapRef = useRef(null);
  const columnRefs = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;
    const logoWrap = logoWrapRef.current;
    const columns = columnRefs.current.filter(Boolean);

    if (!footer || !logoWrap || columns.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();

        const timeline = anime.timeline({ easing: 'easeOutQuad' });

        timeline
          .add({
            targets: logoWrap,
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 700,
          })
          .add(
            {
              targets: columns,
              opacity: [0, 1],
              translateY: [18, 0],
              duration: 650,
              delay: anime.stagger(120),
            },
            '-=380',
          );
      },
      { threshold: 0.2 },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer ref={footerRef} className="warm-gradient pb-10 pt-6">
      <Container className="py-12 md:py-14">
        <div className="surface-panel relative overflow-hidden grid gap-10 p-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.42),transparent_26%),radial-gradient(circle_at_88%_10%,rgba(103,165,57,0.1),transparent_24%)]" />
          <div ref={(node) => {
            logoWrapRef.current = node;
          }} className="relative opacity-0">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-green/30 bg-brand-green shadow-[0_14px_28px_rgba(47,42,61,0.12)]">
                <img src={logoUrl} alt="Ghar Ka Khana logo" className="h-10 w-10 object-contain drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]" />
              </span>
              <span className="text-base font-semibold text-brand-brown">Ghar Ka Khana</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-brand-brown/80">
              Bringing the taste of home-cooked meals to everyone. Order from verified home chefs in your neighborhood.
            </p>
            <div className="mt-4 text-sm text-brand-brown/70">Will be available on social media soon</div>
          </div>

          {footerColumns.map((column, index) => (
            <div
              key={column.title}
              ref={(node) => {
                if (node) {
                  columnRefs.current[index] = node;
                }
              }}
              className="relative opacity-0"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-brown">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-brown/80">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition hover:text-brand-greenDark hover:translate-x-0.5 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.6rem] border border-brand-brown/10 bg-white/55 px-5 py-4 text-sm text-brand-brown/72 shadow-[0_10px_24px_rgba(47,42,61,0.05)] backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span>© 2026 Ghar Ka Khana. All rights reserved.</span>
              <span className="hidden h-1 w-1 rounded-full bg-brand-green sm:inline-block" />
              <span className="text-brand-brown/60">Home-style meals, made simple.</span>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-brand-brown/10 bg-white/80 px-3 py-1.5 text-brand-brown/70 sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-brand-green" />
              <span>Kolkata, West Bengal, India</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
