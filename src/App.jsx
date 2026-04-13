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
import { AccountDeletionPage } from './pages/AccountDeletionPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { MenuPage } from './pages/MenuPage';
import { KitchenDetailPage } from './pages/KitchenDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { useAuthStore } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';
import { DemoBanner } from './components/DemoBanner';
import { CartToast } from './components/CartToast';
import { policies } from './data/site';
import homeVideo from './Video/home-video.mp4';

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

function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const [splashLoading, setSplashLoading] = useState(true);
  const { initializeAuth, loading: authLoading } = useAuthStore();

  useEffect(() => {
    const unsub = initializeAuth();
    const timer = setTimeout(() => setSplashLoading(false), 2600);
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [initializeAuth]);

  // Combined initialization state
  const isInitializing = splashLoading || authLoading;

  return (
    <SiteSettingsProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#f2d4a8] text-brand-brown antialiased">
          <AnimatePresence>
            {isInitializing && (
              <motion.div 
                key="premium-loader" 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.8, ease: 'easeIn' }} 
                className="relative z-[200]"
              >
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>

          {!isInitializing && <AppContent />}
        </div>
      </CartProvider>
    </SiteSettingsProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { demoMode } = useSiteSettings();

  return (
    <>
      <video
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        src={homeVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <ScrollToTop />
      {demoMode && <DemoBanner />}
      <SiteHeader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
          <Route path="/menu" element={<AnimatedRoute><MenuPage /></AnimatedRoute>} />
          <Route path="/about" element={<AnimatedRoute><AboutPage /></AnimatedRoute>} />
          <Route path="/contact" element={<AnimatedRoute><ContactPage /></AnimatedRoute>} />
          <Route path="/privacy-policy" element={<AnimatedRoute><PrivacyPolicyPage /></AnimatedRoute>} />
          <Route path="/account-deletion" element={<AnimatedRoute><AccountDeletionPage /></AnimatedRoute>} />
          <Route path="/terms-and-conditions" element={<AnimatedRoute><PolicyPage policy={policies.terms} /></AnimatedRoute>} />
          <Route path="/refund-policy" element={<AnimatedRoute><PolicyPage policy={policies.refund} /></AnimatedRoute>} />
          <Route path="/signin" element={<AnimatedRoute><AuthRoute><SignInPage /></AuthRoute></AnimatedRoute>} />
          <Route path="/signup" element={<AnimatedRoute><AuthRoute><SignUpPage /></AuthRoute></AnimatedRoute>} />
          <Route path="/dashboard" element={<AnimatedRoute><ProtectedRoute><DashboardPage /></ProtectedRoute></AnimatedRoute>} />
          <Route path="/checkout" element={<AnimatedRoute><ProtectedRoute><CheckoutPage /></ProtectedRoute></AnimatedRoute>} />
          <Route path="/cart" element={<AnimatedRoute><CartPage /></AnimatedRoute>} />
          <Route path="/kitchen/:cookId" element={<AnimatedRoute><KitchenDetailPage /></AnimatedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <SiteFooter />
      <CartToast />
    </>
  );
}