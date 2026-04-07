import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiCheckCircle, FiLoader, FiX, FiUser, FiPhone } from 'react-icons/fi';
import { Button } from './Button';
import { submitWishlistEmail } from '../utils/wishlistApi';

export function WishlistModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    honeypot: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your number';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setStatus('loading');

    try {
      await submitWishlistEmail(formData);
      // Since it's no-cors, we assume success if no error is thrown
      setStatus('success');
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-md md:p-10"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-brand-brown/40 transition hover:bg-brand-brown/5 hover:text-brand-brown"
            >
              <FiX className="h-5 w-5" />
            </button>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <FiCheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-brand-brown">You're on the wishlist!</h3>
                <p className="mt-4 text-brand-brown/70">
                  Fresh offers coming your way soon 🍲
                </p>
                <Button onClick={onClose} className="mt-8 px-10">
                  Got it
                </Button>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-brand-green/10 text-brand-green">
                  <FiMail className="h-7 w-7" />
                </div>
                
                <h3 className="text-3xl font-bold tracking-tight text-brand-brown">Join the Wishlist</h3>
                <p className="mt-3 text-brand-brown/70 leading-relaxed">
                  Get exclusive homemade food offers, chef specials, and launch updates.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Honeypot */}
                  <input 
                    type="text" 
                    name="honeypot" 
                    style={{ display: 'none' }} 
                    tabIndex="-1" 
                    autoComplete="off" 
                    value={formData.honeypot}
                    onChange={handleInputChange}
                  />

                  {/* Name Input */}
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className={`w-full rounded-2xl border bg-brand-cream/30 py-4 pl-12 pr-5 text-brand-brown outline-none transition-all placeholder:text-brand-brown/30 focus:bg-white focus:ring-4 ${
                        errors.name ? 'border-error/30 focus:ring-error/10' : 'border-brand-brown/10 focus:border-brand-green/30 focus:ring-brand-green/10'
                      }`}
                    />
                    {errors.name && <p className="mt-1 ml-1 text-[10px] font-bold text-error uppercase tracking-wider">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className={`w-full rounded-2xl border bg-brand-cream/30 py-4 pl-12 pr-5 text-brand-brown outline-none transition-all placeholder:text-brand-brown/30 focus:bg-white focus:ring-4 ${
                        errors.email ? 'border-error/30 focus:ring-error/10' : 'border-brand-brown/10 focus:border-brand-green/30 focus:ring-brand-green/10'
                      }`}
                    />
                    {errors.email && <p className="mt-1 ml-1 text-[10px] font-bold text-error uppercase tracking-wider">{errors.email}</p>}
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className={`w-full rounded-2xl border bg-brand-cream/30 py-4 pl-12 pr-5 text-brand-brown outline-none transition-all placeholder:text-brand-brown/30 focus:bg-white focus:ring-4 ${
                        errors.phone ? 'border-error/30 focus:ring-error/10' : 'border-brand-brown/10 focus:border-brand-green/30 focus:ring-brand-green/10'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 ml-1 text-[10px] font-bold text-error uppercase tracking-wider">{errors.phone}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 text-base shadow-glow"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center gap-2">
                        <FiLoader className="h-5 w-5 animate-spin" />
                        <span>Joining...</span>
                      </div>
                    ) : (
                      'Notify Me'
                    )}
                  </Button>

                  <p className="text-center text-xs font-semibold text-brand-green/90">
                    Be the first to taste what’s coming next 👀
                  </p>
                </form>

                {status === 'error' && (
                  <p className="mt-4 text-center text-sm font-medium text-error">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
