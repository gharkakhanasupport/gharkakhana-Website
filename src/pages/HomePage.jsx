import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { FiCheck, FiZap } from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import homeVideo from '../Video/home-video.mp4';
import { WishlistModal } from '../components/WishlistModal';



const featureCards = [
  {
    title: 'Live kitchen quality',
    body: 'Prepared in trusted home kitchens with real care, hygiene checks, and familiar everyday cooking.',
    icon: <FiCheck />,
  },
  {
    title: 'Delivery under 30 mins',
    body: 'Local routing and simple dispatch keep deliveries moving quickly without feeling rushed.',
    icon: <FiZap />,
  },
  {
    title: 'Comfort-first menu',
    body: 'Meals that feel warm, familiar, and easy to choose for an everyday meal at home.',
    icon: <BiRestaurant />,
  },
];

const journeySteps = [
  {
    title: 'Choose your meal',
    description: 'From light snacks to full meals, pick what fits your mood.',
  },
  {
    title: 'Track your order',
    description: 'Follow real-time updates from kitchen to delivery.',
  },
  {
    title: 'Enjoy home-style food',
    description: 'Fresh, warm, and comforting meals delivered to your door.',
  },
];

const philosophyCards = [
  {
    title: 'Fast & Simple Ordering',
    body: 'The flow stays short and clear so people can place an order without digging through extra steps.',
  },
  {
    title: 'Home-style Trusted Meals',
    body: 'The experience is built around familiar food, reliable kitchens, and the comfort of something homemade.',
  },
  {
    title: 'Clean & Distraction-free UI',
    body: 'The interface keeps the focus on decision-making, helping users understand what to order at a glance.',
  },
];

function HeroVisual() {
  const visualRef = useRef(null);
  const panelRef = useRef(null);
  const sweepRef = useRef(null);

  const steamRefs = useRef([]);
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] });
  const rise = useTransform(scrollYProgress, [0, 1], [10, -12]);

  useEffect(() => {
    const panel = panelRef.current;
    const sweep = sweepRef.current;

    const steam = steamRefs.current.filter(Boolean);

    const animations = [
      ...(panel
        ? [
            anime({
              targets: panel,
              translateY: [0, -4, 0],
              duration: 5200,
              easing: 'easeInOutSine',
              loop: true,
            }),
          ]
        : []),
      ...(sweep
        ? [
            anime({
              targets: sweep,
              translateX: [-28, 28],
              opacity: [0.18, 0.42, 0.18],
              duration: 4200,
              easing: 'easeInOutSine',
              loop: true,
            }),
          ]
        : []),

      ...steam.map((node, index) =>
        anime({
          targets: node,
          translateY: [0, -18, 0],
          translateX: [0, index % 2 === 0 ? -3 : 3, 0],
          opacity: [0.08, 0.42, 0.08],
          duration: 2400 + index * 180,
          easing: 'easeInOutSine',
          loop: true,
        }),
      ),
    ];

    return () => animations.forEach((instance) => instance.pause());
  }, []);

  return (
    <motion.div ref={visualRef} style={{ y: rise }} className="relative mx-auto w-full max-w-[37.5rem]">
      <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(248,212,158,0.45),transparent_72%)] blur-xl" />
      <div className="absolute -bottom-7 -left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,241,217,0.62),transparent_72%)] blur-xl" />

      <div ref={panelRef} className="surface-panel relative overflow-hidden rounded-[2.2rem] p-2.5 md:p-3.5">
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.5),rgba(255,255,255,0.22))]" />
        <div
          ref={sweepRef}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.42),transparent_58%)] mix-blend-screen blur-2xl"
        />
        <div className="pointer-events-none absolute left-[18%] top-[14%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,214,160,0.5),transparent_68%)] blur-3xl" />
        <div className="pointer-events-none absolute left-[26%] bottom-[16%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(103,165,57,0.14),transparent_72%)] blur-3xl" />
        <div className="pointer-events-none absolute left-[34%] top-[20%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8),transparent_68%)] blur-2xl" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="relative z-10 w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-[1.8rem] object-cover bg-brand-cream/50" 
        >
          <source src={homeVideo} type="video/mp4" />
        </video>

        <span
          ref={(node) => {
            steamRefs.current[0] = node;
          }}
          className="pointer-events-none absolute left-[38%] top-[30%] h-6 w-1.5 rounded-full bg-white/70 blur-[2px]"
        />
        <span
          ref={(node) => {
            steamRefs.current[1] = node;
          }}
          className="pointer-events-none absolute left-[44%] top-[28%] h-8 w-1.5 rounded-full bg-white/65 blur-[2px]"
        />
        <span
          ref={(node) => {
            steamRefs.current[2] = node;
          }}
          className="pointer-events-none absolute left-[50%] top-[27%] h-7 w-1.5 rounded-full bg-white/60 blur-[2px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="surface-panel absolute left-[-0.5rem] top-[68%] z-20 w-40 rounded-[1.2rem] p-3 md:left-[-1.35rem] md:top-[55%] md:w-52 md:rounded-[1.4rem] md:p-4"
      >
        <div className="text-[10px] uppercase tracking-[0.16em] text-brand-brown/60 md:text-xs">Customer rating</div>
        <div className="mt-2 flex items-center gap-1 text-brand-brown md:mt-3 md:gap-2">
          <span className="text-base md:text-lg">⭐</span>
          <span className="text-xs font-semibold md:text-sm">4.9</span>
          <span className="text-[10px] text-brand-brown/70 md:text-xs">10.6k reviews</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
        className="surface-panel absolute bottom-[-1rem] right-[-0.5rem] z-20 w-48 rounded-[1.2rem] p-3 md:bottom-[-1.3rem] md:right-[-1rem] md:w-56 md:rounded-[1.4rem] md:p-4"
      >
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-brand-brown/60 md:text-xs">Order status</div>
            <div className="mt-1 text-xs font-semibold text-brand-brown md:text-sm">Confirmed and cooking</div>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm text-white md:h-9 md:w-9 md:text-base">✓</div>
        </div>
      </motion.div>


    </motion.div>
  );
}

function StorySection({ id, eyebrow, title, description, children, invert = false }) {
  return (
    <section id={id} className="section-pad">
      <Container className={`grid gap-10 lg:grid-cols-2 lg:items-center ${invert ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl">{title}</h2>
            <p className="mt-5 text-base leading-8 text-brand-brown/78 sm:text-lg">{description}</p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>{children}</Reveal>
      </Container>
    </section>
  );
}

export function HomePage() {
  const ctaSectionRef = useRef(null);
  const ctaGlowRef = useRef(null);
  const ctaButtonRefs = useRef([]);
  const [showToast, setShowToast] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleStoreClick = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const section = ctaSectionRef.current;
    const glow = ctaGlowRef.current;
    const buttons = ctaButtonRefs.current.filter(Boolean);

    if (!section || !glow || buttons.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        const timeline = anime.timeline({ easing: 'easeOutQuad' });

        timeline
          .add({
            targets: glow,
            opacity: [0.55, 1],
            duration: 900,
          })
          .add(
            {
              targets: buttons,
              opacity: [0, 1],
              translateY: [14, 0],
              scale: [0.98, 1],
              duration: 650,
              delay: anime.stagger(120),
            },
            '-=420',
          );

        return undefined;
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    const pulse = anime({
      targets: glow,
      scale: [1, 1.02],
      opacity: [0.92, 1],
      duration: 2800,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
      autoplay: false,
    });

    return () => {
      observer.disconnect();
      pulse.pause();
    };
  }, []);

  return (
    <main className="overflow-hidden pb-8">
      <section id="hero" className="relative overflow-hidden pb-10 pt-3 md:pb-12 md:pt-4">
        <div className="absolute inset-0 warm-gradient" />
        <Container className="relative z-10 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="surface-panel rounded-[2.25rem] border border-brand-brown/10 px-6 py-8 md:px-10 md:py-11 lg:px-12"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.04fr] lg:items-center lg:gap-12">
              <div className="max-w-xl">
                <span className="eyebrow bg-white/86">Super fast delivery</span>
                <h1 className="mt-6 text-5xl font-bold leading-[1.03] tracking-tight text-brand-brown sm:text-6xl lg:text-[4.15rem]">
                  From kitchen
                  <span className="block">to your doorstep,</span>
                  <span className="block text-brand-green">anywhere!</span>
                </h1>

                <p className="mt-6 max-w-lg text-[1.05rem] leading-8 text-brand-brown/78">
                  Home delivery and reservation platform for clean, comfort-first meals from trusted kitchens. Built to feel premium, simple, and reliable.
                </p>

                <div className="mt-8 flex flex-wrap gap-3.5">
                  <Button as="link" to="/contact" className="px-7 py-3.5">Order Now</Button>
                  <Button 
                    type="button"
                    variant="secondary" 
                    className="px-7 py-3.5"
                    onClick={() => setIsWishlistOpen(true)}
                  >
                    Get Offer Alerts
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-brand-brown/78">
                  <span className="rounded-full border border-brand-brown/12 bg-white/90 px-4 py-2 font-medium">Free delivery around 5 km</span>
                  <span className="rounded-full border border-brand-brown/12 bg-white/90 px-4 py-2 font-medium">Fresh every day</span>
                </div>
              </div>

              <HeroVisual />
            </div>
          </motion.div>
        </Container>
      </section>

      <section id="concept" className="section-pad">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-12">
            <Reveal>
              <div className="max-w-2xl">
                <span className="eyebrow">Why We Built This</span>
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[3.7rem] md:leading-[1.02]">
                  A better way to experience food delivery
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-brand-brown/78 sm:text-lg">
                  We wanted this platform to feel like the easiest way to reach a warm, familiar meal. The design stays simple and fast,
                  with enough clarity to help people decide quickly and enough softness to make the experience feel comforting and trustworthy.
                  Every detail is kept clean on purpose, so the food and the feeling behind it stay at the center.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="surface-panel rounded-[2.15rem] p-5 md:p-6">
                <div className="grid gap-4">
                  {philosophyCards.map((card) => (
                    <article key={card.title} className="rounded-[1.5rem] border border-brand-brown/10 bg-white/92 p-5 shadow-[0_8px_20px_rgba(47,42,61,0.04)]">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-green" />
                        <div>
                          <h3 className="text-lg font-semibold text-brand-brown">{card.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-brand-brown/76">{card.body}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="experience" className="section-pad">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-12">
            <Reveal>
              <div className="space-y-4">
                {journeySteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="surface-panel flex gap-4 rounded-[1.6rem] p-5 md:p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green text-base font-bold text-white shadow-[0_10px_20px_rgba(103,165,57,0.22)]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-brown md:text-xl">{step.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-brand-brown/78 md:text-base">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="max-w-2xl lg:pt-4">
                <span className="eyebrow">Why it feels easier</span>
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[3.55rem] md:leading-[1.02]">
                  From craving to comfort in 3 simple steps
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-brand-brown/78 sm:text-lg">
                  The journey stays simple so people do not have to think twice. Clear steps reduce friction, live order updates create
                  transparency, and familiar home-style meals make the whole experience feel trustworthy and calm. Everything is kept
                  intentionally clean, so the decision is fast and the comfort feels immediate.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {['Simple', 'Transparent', 'Comforting'].map((value) => (
                    <div key={value} className="rounded-full border border-brand-brown/12 bg-white/78 px-4 py-3 text-sm font-semibold text-brand-brown shadow-[0_8px_18px_rgba(47,42,61,0.04)]">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="features" className="section-pad">
        <Container>
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="eyebrow">Core value</span>
              <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[3.65rem] md:leading-[1.02]">
                Built for trust, speed, and everyday comfort
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-brand-brown/78 sm:text-lg">
                Every detail is designed to make ordering feel simple, reliable, and comforting, just like the kind of meal you already trust at home.
              </p>
            </div>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
          >
            {featureCards.map((card, index) => (
              <motion.article
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="surface-panel h-full rounded-[2rem] p-6 md:p-7"
              >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-2xl text-white shadow-[0_10px_18px_rgba(103,165,57,0.22)]">
                    {card.icon}
                  </div>
                  <h3 className="mt-5 text-[1.35rem] font-bold tracking-tight text-brand-brown">{card.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-brand-brown/78 md:text-[0.98rem]">{card.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </section>

      <section id="conclusion" className="section-pad">
        <Container ref={ctaSectionRef}>
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="surface-panel relative overflow-hidden rounded-[2.4rem] p-8 md:p-12"
          >
            <div
              ref={ctaGlowRef}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.38),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(103,165,57,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(255,228,190,0.42),transparent_36%)]"
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative max-w-2xl">
                <span className="eyebrow bg-white/85">Chapter 4</span>
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-6xl">
                  Ready for your next home-style meal?
                </h2>
                <p className="mt-5 text-base leading-8 text-brand-brown/78 sm:text-lg">
                  Fresh, home-style meals prepared with care and delivered right to your door. Simple to order, quick to arrive, and made to feel comforting from the first bite.
                </p>
              </div>

              <div className="relative flex flex-col gap-3 lg:items-end">
                <Button
                  as="link"
                  to="/contact"
                  className="min-w-44 px-8 py-3.5 text-base shadow-[0_14px_28px_rgba(103,165,57,0.24)] opacity-0 hover:scale-[1.02] hover:shadow-[0_18px_34px_rgba(103,165,57,0.3)]"
                  ref={(node) => {
                    ctaButtonRefs.current[0] = node;
                  }}
                >
                  Order Now
                </Button>
                <Button
                  as="anchor"
                  href="#features"
                  variant="secondary"
                  className="min-w-44 px-8 py-3.5 text-base opacity-0 hover:scale-[1.01]"
                  ref={(node) => {
                    ctaButtonRefs.current[1] = node;
                  }}
                >
                  Explore Menu
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* App Store / Google Play Gap */}
      <section className="pb-10 pt-4 text-center md:pb-12">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-6">
              <h3 className="text-xl font-medium text-brand-brown/80" style={{ fontFamily: 'Playfair Display, serif' }}>
                Take Ghar Ka Khana everywhere you go
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleStoreClick}
                  className="flex items-center gap-3 rounded-2xl bg-black px-6 py-3 text-left text-white transition hover:scale-105 hover:bg-black/80"
                >
                  <FaApple className="text-3xl" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wide opacity-80">Download on the</span>
                    <span className="text-lg font-semibold leading-none">App Store</span>
                  </div>
                </button>
                <button
                  onClick={handleStoreClick}
                  className="flex items-center gap-3 rounded-2xl bg-black px-6 py-3 text-left text-white transition hover:scale-105 hover:bg-black/80"
                >
                  <FaGooglePlay className="text-3xl" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wide opacity-80">GET IT ON</span>
                    <span className="text-lg font-semibold leading-none">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
      
      {/* Wishlist Final Section */}
      <section className="section-pad relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-cream/30" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="surface-panel overflow-hidden rounded-[2.5rem] bg-brand-brown p-8 md:p-16 text-center text-white"
          >
            <div className="mx-auto max-w-2xl">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/20 text-brand-green mb-8">
                <FiMail className="h-8 w-8" />
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Don't miss out on <span className="text-brand-green">homemade goodness.</span>
              </h2>
              <p className="mt-6 text-lg text-white/70 leading-relaxed">
                Join our wishlist to be the first to know about new chefs, daily specials, 
                and exclusive launch offers in your neighborhood.
              </p>
              <div className="mt-10">
                <Button 
                  onClick={() => setIsWishlistOpen(true)}
                  className="bg-brand-green px-10 py-4 text-lg hover:bg-brand-greenDark shadow-[0_20px_40px_rgba(95,166,59,0.3)]"
                >
                  Join Wishlist
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Centered Popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowToast(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-brown/5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-4 rounded-[1.4rem] bg-brand-brown px-8 py-5 text-white shadow-[0_24px_50px_rgba(47,42,61,0.25)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                <FiZap className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <span className="text-[1.1rem] font-medium tracking-wide">Will be available soon!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </main>
  );
}
