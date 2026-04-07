import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScroll } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { navLinks } from '../data/site';
import { Button } from './Button';
import { Container } from './Container';
import { AuthModal } from './AuthModal';
import { WishlistModal } from './WishlistModal';
const logoUrl = new URL('../Images/GharKakhana Logo.png', import.meta.url).href;

const mobileLinks = [
  ...navLinks,
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Refund Policy', to: '/refund-policy' },
];

function navClassName({ isActive }) {
  return `font-navbar relative rounded-full px-3 py-2 text-sm font-bold tracking-tight transition ${
    isActive
      ? 'bg-brand-beige/70 text-brand-brown shadow-[0_6px_14px_rgba(47,42,61,0.06)]'
      : 'text-brand-brown/82 hover:bg-white hover:text-brand-brown'
  }`;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open || isAuthOpen || isWishlistOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, isAuthOpen, isWishlistOpen]);

  return (
    <>
      <motion.div className="fixed left-0 top-0 z-[70] h-1 origin-left bg-brand-green" style={{ scaleX: scrollYProgress }} />
      <header className="sticky top-0 z-50 bg-[#f2d4a8] py-3">
        <Container>
          <div className="grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 rounded-[1.65rem] border border-brand-brown/12 bg-white/86 px-4 shadow-soft backdrop-blur md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-7">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3.5 text-left justify-self-start"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/30 bg-brand-green shadow-[0_10px_20px_rgba(47,42,61,0.1)]">
                <img src={logoUrl} alt="Ghar Ka Khana logo" className="h-8 w-8 object-contain drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]" />
              </span>
              <div className="font-navbar">
                <strong className="block text-[1.15rem] font-bold leading-none tracking-[-0.04em] text-brand-brown drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
                  Ghar Ka Khana
                </strong>
                <span className="mt-1 block text-[0.74rem] font-semibold tracking-[0.14em] text-brand-brown/60">Food delivery</span>
              </div>
            </button>

            <nav className="font-navbar hidden items-center gap-2 rounded-full border border-brand-brown/10 bg-brand-cream/55 px-2 py-1.5 md:flex md:justify-self-center">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex md:justify-self-end">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="font-navbar flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white/50 px-5 py-2.5 text-sm font-bold text-brand-brown transition-all hover:bg-white hover:text-brand-green"
              >
                <FiMail className="text-brand-green" />
                <span>Get Offer Alerts</span>
              </button>
              <Button onClick={() => setIsAuthOpen(true)} className="font-navbar h-[46px] px-6 text-base font-bold tracking-tight cursor-pointer">
                Sign Up
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-brown/15 bg-white md:hidden"
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-brand-brown transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-brand-brown transition ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 top-3 h-0.5 w-5 rounded-full bg-brand-brown transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-brand-brown/28 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[60] h-full w-[86%] max-w-sm border-l border-brand-brown/15 bg-brand-cream p-5 shadow-soft md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between border-b border-brand-brown/15 pb-4 font-navbar">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-green/30 bg-brand-green shadow-[0_8px_16px_rgba(47,42,61,0.1)]">
                    <img src={logoUrl} alt="Ghar Ka Khana logo" className="h-7 w-7 object-contain drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
                  </span>
                  <div>
                    <strong className="block text-lg font-bold leading-none tracking-[-0.04em] text-brand-brown">Ghar Ka Khana</strong>
                    <span className="mt-1 block text-[0.62rem] font-semibold tracking-[0.12em] text-brand-brown/58">Food delivery</span>
                  </div>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="text-xl text-brand-brown/70">
                  ×
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {mobileLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `font-navbar flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold ${isActive ? 'bg-white text-brand-brown shadow-[0_8px_18px_rgba(47,42,61,0.08)]' : 'text-brand-brown hover:bg-white/85'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="font-navbar mt-8 rounded-3xl border border-brand-brown/15 bg-white p-4">
                <Button onClick={() => { setOpen(false); setIsAuthOpen(true); }} className="font-navbar w-full font-bold tracking-tight cursor-pointer">
                  Sign Up
                </Button>
                <button
                  onClick={() => { setOpen(false); setIsWishlistOpen(true); }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 py-3 text-sm font-bold text-brand-green transition-all hover:bg-brand-green/10"
                >
                  <FiMail />
                  <span>Get Offer Alerts</span>
                </button>
                <div className="mt-4 pt-4 border-t border-brand-brown/10 text-xs uppercase tracking-[0.2em] text-brand-brown/70">Contact</div>
                <div className="mt-2 space-y-1 text-sm text-brand-brown">
                  <div>noreplay.gkk26@gmail.com</div>
                  <div>+91-9477564633</div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}
