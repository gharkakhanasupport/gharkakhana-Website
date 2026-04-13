import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Container } from './Container';

export function BannerSection({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <section className="py-8">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-cream/30 shadow-soft border border-white/50">
          <div className="relative aspect-[21/9] w-full overflow-hidden md:aspect-[24/7]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <img
                  src={banners[currentIndex].image}
                  alt={banners[currentIndex].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-md"
                  >
                    <h2 className="text-3xl font-bold text-white md:text-5xl tracking-tight">
                      {banners[currentIndex].title}
                    </h2>
                    <p className="mt-4 text-sm text-white/90 md:text-lg leading-relaxed">
                      {banners[currentIndex].subtitle}
                    </p>
                    <button
                      onClick={() => navigate(banners[currentIndex].link)}
                      className="mt-8 rounded-2xl bg-brand-green px-8 py-3 text-sm font-bold text-white shadow-xl hover:scale-105 transition-transform"
                    >
                      {banners[currentIndex].buttonText}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {banners.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition-colors"
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40 transition-colors"
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
