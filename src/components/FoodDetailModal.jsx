import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShoppingBag, FiClock } from 'react-icons/fi';
import { useAuthStore } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function FoodDetailModal({ item, isOpen, onClose }) {
  const { user } = useAuthStore();
  const { addToCart } = useCart();
  const [favLoading, setFavLoading] = useState(false);
  const [favDone, setFavDone] = useState(false);
  const [showAppPrompt, setShowAppPrompt] = useState(false);

  if (!item) return null;

  const handleFavorite = async () => {
    if (!user) {
      onClose();
      window.location.href = '/signin';
      return;
    }
    setFavLoading(true);
    try {
      await supabase.from('favorites').upsert({
        user_id: user.id,
        menu_item_id: item.id,
        item_name: item.name,
        created_at: new Date().toISOString(),
      });
      setFavDone(true);
      setTimeout(() => setFavDone(false), 2000);
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
    setFavLoading(false);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-brown/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white shadow-[0_32px_80px_rgba(47,42,61,0.2)] border border-brand-brown/8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-brown/70 shadow-md backdrop-blur-sm hover:bg-white hover:text-brand-brown transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-cream to-white">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-cream via-white to-brand-cream/70">
                  <span className="text-7xl">🍽️</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 rounded-full bg-brand-green px-4 py-2 text-lg font-bold text-white shadow-lg">
                ₹{item.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-brand-brown tracking-tight">{item.name}</h2>
                  {item.category && (
                    <span className="mt-2 inline-block rounded-full bg-brand-cream/80 px-3 py-1 text-xs font-semibold text-brand-brown/70 border border-brand-brown/8">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="mt-4 text-sm leading-relaxed text-brand-brown/65">{item.description}</p>
              )}

              {/* Meta info */}
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-brand-cream/50 px-3 py-2 text-xs font-medium text-brand-brown/70">
                  <FiClock className="text-brand-green" />
                  Added {timeAgo(item.created_at)}
                </div>
                {item.quantity_available > 0 ? (
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    {item.quantity_available} available
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    Sold out
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-bold transition-all ${
                    favDone
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-brand-brown/10 bg-white text-brand-brown hover:bg-brand-cream/50'
                  }`}
                >
                  <FiHeart className={favDone ? 'fill-red-500 text-red-500' : ''} />
                  {favDone ? 'Saved!' : 'Add to Favorites'}
                </button>
                <button
                  onClick={() => {
                    addToCart(item);
                    onClose();
                  }}
                  disabled={item.quantity_available <= 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-green py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(95,166,59,0.25)] hover:shadow-[0_12px_28px_rgba(95,166,59,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingBag />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
