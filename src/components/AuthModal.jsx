import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiX, BiHide, BiShow } from 'react-icons/bi';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('signUp'); // 'signUp' | 'signIn'
  const [showPassword, setShowPassword] = useState(false);

  const toggleView = () => {
    setView(view === 'signUp' ? 'signIn' : 'signUp');
    setShowPassword(false);
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
    exit: { opacity: 0 }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-brand-brown/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[28rem] overflow-hidden rounded-[2.5rem] bg-brand-cream/95 shadow-[0_32px_80px_rgba(47,42,61,0.25)] z-10 border border-white/60 backdrop-blur-xl"
          >
            {/* Decorative background blur / glow */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_70%)] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(95,166,59,0.1),transparent_70%)] blur-3xl" />

            <div className="relative p-8 sm:p-10">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-brand-brown/50 transition-all hover:bg-black/10 hover:text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              >
                <BiX size={20} />
              </button>

              <div className="mb-8 mt-2 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-brand-brown sm:text-[2rem]">
                      {view === 'signUp' ? 'Create an account' : 'Welcome back'}
                    </h2>
                    <p className="mt-3 font-body text-[1rem] leading-relaxed text-brand-brown/70">
                      {view === 'signUp'
                        ? 'Join us to order warm, home-style meals with ease.'
                        : 'Sign in to continue your comfort-food experience.'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.form 
                onSubmit={(e) => e.preventDefault()} 
                className="space-y-4"
                variants={containerVars}
                initial="hidden"
                animate="show"
                exit="exit"
                key={view}
              >
                {view === 'signUp' && (
                  <motion.div variants={itemVars} className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40">
                      <FiUser size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full rounded-[1.25rem] border border-black/5 bg-white/80 py-4 pl-12 pr-5 font-body text-[1.05rem] text-brand-brown placeholder:text-brand-brown/40 shadow-sm transition-all focus:border-brand-green/40 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-green/15"
                    />
                  </motion.div>
                )}
                
                <motion.div variants={itemVars} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40">
                    <FiMail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-[1.25rem] border border-black/5 bg-white/80 py-4 pl-12 pr-5 font-body text-[1.05rem] text-brand-brown placeholder:text-brand-brown/40 shadow-sm transition-all focus:border-brand-green/40 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-green/15"
                  />
                </motion.div>

                <motion.div variants={itemVars} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40">
                    <FiLock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full rounded-[1.25rem] border border-black/5 bg-white/80 py-4 pl-12 pr-12 font-body text-[1.05rem] text-brand-brown placeholder:text-brand-brown/40 shadow-sm transition-all focus:border-brand-green/40 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-green/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-brand-brown/40 transition-colors hover:bg-black/5 hover:text-brand-brown"
                  >
                    {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
                  </button>
                </motion.div>

                {view === 'signIn' && (
                  <motion.div variants={itemVars} className="flex justify-end pt-1">
                    <a href="#" className="font-body text-sm font-semibold text-brand-brown/60 transition-colors hover:text-brand-green">
                      Forgot password?
                    </a>
                  </motion.div>
                )}

                <motion.div variants={itemVars} className="pt-4">
                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-[1.25rem] bg-brand-green py-4 font-body text-[1.1rem] font-bold text-white shadow-[0_8px_20px_rgba(95,166,59,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(95,166,59,0.35)] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[100%]" />
                    <span className="relative">{view === 'signUp' ? 'Create Account' : 'Sign In'}</span>
                  </button>
                </motion.div>
              </motion.form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/5"></div>
                  <span className="font-body text-[0.7rem] font-bold tracking-widest text-brand-brown/40 uppercase">OR</span>
                  <div className="h-px flex-1 bg-black/5"></div>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-[1.25rem] border border-black/5 bg-white py-3.5 font-body text-[1.05rem] font-semibold text-brand-brown shadow-sm transition-all hover:bg-black/[0.02] hover:shadow"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.79 15.7 17.57V20.34H19.27C21.01 18.74 22.56 15.74 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.16 22.02 18.77 20.65L15.2 17.88C14.33 18.41 13.25 18.73 12 18.73C9.57 18.73 7.51 17.09 6.75 14.88H3.08V17.72C4.72 20.97 8.08 23 12 23Z" fill="#34A853"/>
                    <path d="M6.3 14.77C6.11 14.19 6 13.56 6 12.91C6 12.26 6.11 11.63 6.3 11.05V8.21H2.63C1.86 9.75 1.41 11.28 1.41 12.91C1.41 14.54 1.86 16.07 2.63 17.61L6.3 14.77Z" fill="#FBBC05"/>
                    <path d="M12 7.09C13.62 7.09 15.06 7.64 16.2 8.71L19.4 5.51C17.15 3.42 14.96 2.5 12 2.5C8.08 2.5 4.72 4.53 3.08 7.78L6.75 10.62C7.51 8.41 9.57 7.09 12 7.09Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="mt-8 text-center font-body text-[0.95rem] text-brand-brown/70">
                  {view === 'signUp' ? 'Already have an account?' : 'New here?'}
                  {' '}
                  <button
                    onClick={toggleView}
                    className="font-bold text-brand-green transition-colors hover:text-brand-greenDark focus:outline-none focus:underline"
                  >
                    {view === 'signUp' ? 'Sign in' : 'Create account'}
                  </button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}