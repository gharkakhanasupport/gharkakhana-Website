import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { ScrollToTop } from './components/ScrollToTop';
import { Loader } from './components/Loader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { policies } from './data/site';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function AnimatedRoute({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2d4a8] text-brand-brown antialiased">
      <AnimatePresence>
        {loading && (
          <motion.div key="premium-loader" exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeIn' }} className="relative z-[200]">
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!loading && (
        <>
          <ScrollToTop />
      <SiteHeader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
          <Route path="/about" element={<AnimatedRoute><AboutPage /></AnimatedRoute>} />
          <Route path="/contact" element={<AnimatedRoute><ContactPage /></AnimatedRoute>} />
          <Route path="/privacy-policy" element={<AnimatedRoute><PrivacyPolicyPage /></AnimatedRoute>} />
          <Route path="/terms-and-conditions" element={<AnimatedRoute><PolicyPage policy={policies.terms} /></AnimatedRoute>} />
          <Route path="/refund-policy" element={<AnimatedRoute><PolicyPage policy={policies.refund} /></AnimatedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <SiteFooter />
        </>
      )}
    </div>
  );
}