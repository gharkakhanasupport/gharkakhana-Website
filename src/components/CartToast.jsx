import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { FiShoppingBag, FiChevronRight, FiChevronUp, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export function CartToast() {
  const { cart, getCartTotal, getTotalItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const bounceControls = useAnimationControls();
  const prevItemCount = useRef(0);

  const totalItems = getTotalItems();
  const totalPrice = getCartTotal();

  // Bounce once when items are added
  useEffect(() => {
    if (totalItems > prevItemCount.current && prevItemCount.current !== 0) {
      bounceControls.start({
        scale: [1, 1.07, 0.97, 1.03, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      });
    }
    prevItemCount.current = totalItems;
  }, [totalItems, bounceControls]);

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          className="fixed bottom-4 left-0 right-0 z-[60] mx-auto w-full max-w-lg px-4"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <motion.div
            animate={bounceControls}
            className="overflow-hidden rounded-2xl bg-brand-green shadow-[0_8px_30px_rgba(95,166,59,0.35)] backdrop-blur-md"
          >

            {/* Expanded item list */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="max-h-52 overflow-y-auto border-b border-white/15">
                    {cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                      >
                        {/* Item image */}
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-9 w-9 rounded-lg object-cover border border-white/20 shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                            <FiShoppingBag className="h-4 w-4 text-white/60" />
                          </div>
                        )}

                        {/* Name + price */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                          <p className="text-xs text-white/65">₹{item.price} × {quantity} = <span className="font-bold text-white/90">₹{(item.price * quantity).toFixed(0)}</span></p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity - 1); }}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-white hover:bg-white/25 transition-colors"
                          >
                            <FiMinus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">{quantity}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity + 1); }}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-white hover:bg-white/25 transition-colors"
                          >
                            <FiPlus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:text-red-300 hover:bg-red-400/15 transition-colors shrink-0"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom bar — always visible */}
            <div
              onClick={() => navigate('/cart')}
              className="flex cursor-pointer items-center justify-between p-4 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-white/90">
                  <FiShoppingBag className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                  </span>
                  <motion.span
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronUp className="h-3.5 w-3.5 text-white/50" />
                  </motion.span>
                </div>
                <span className="mt-0.5 text-lg font-bold text-white">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 font-bold text-white">
                View Cart <FiChevronRight className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
