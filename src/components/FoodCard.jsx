import { motion } from 'framer-motion';
import { FiPlus, FiCheck, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const categoryColors = {
  Breakfast: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Lunch: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Dinner: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Snacks: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Desserts: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Main Course': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Biryani: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Beverages: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
};

const defaultColor = { bg: 'bg-brand-cream/60', text: 'text-brand-brown', border: 'border-brand-brown/10' };

export function FoodCard({ item, onClick, index = 0 }) {
  const colors = categoryColors[item.category] || defaultColor;
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(item.id);

  const isAvailable = item.is_available !== false && (item.quantity_available === undefined || item.quantity_available > 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onClick?.(item)}
      className="group cursor-pointer overflow-hidden rounded-[1.8rem] border border-brand-brown/8 bg-white shadow-[0_4px_20px_rgba(47,42,61,0.06)] transition-shadow hover:shadow-[0_12px_36px_rgba(47,42,61,0.12)]"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-cream to-brand-cream/60">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-cream via-white to-brand-cream/80">
            <div className="text-center">
              <span className="text-5xl">🍽️</span>
              <p className="mt-2 text-xs font-medium text-brand-brown/40">Image coming soon</p>
            </div>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute right-3 top-3 rounded-full bg-brand-green px-3.5 py-1.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(95,166,59,0.3)]">
          ₹{item.price}
        </div>

        {/* Category Tag */}
        {item.category && (
          <div className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${colors.bg} ${colors.text} ${colors.border}`}>
            {item.category}
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute left-3 bottom-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
          isAvailable
            ? 'bg-green-50/90 text-green-700 border border-green-200/60'
            : 'bg-red-50/90 text-red-600 border border-red-200/60'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
          {isAvailable ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-brand-brown tracking-tight line-clamp-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="mt-1.5 text-sm text-brand-brown/60 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.quantity_available > 0 ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-green">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                {item.quantity_available} left
              </span>
            ) : item.quantity_available !== undefined ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Sold out
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-green">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                Available
              </span>
            )}
          </div>
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-3 rounded-full bg-brand-green/10 px-2 py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, quantityInCart - 1);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-green shadow-sm transition-transform active:scale-95"
              >
                <FiMinus className="h-3 w-3" />
              </button>
              <span className="w-4 text-center text-xs font-bold text-brand-green">
                {quantityInCart}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, quantityInCart + 1);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-white shadow-sm transition-transform active:scale-95"
              >
                <FiPlus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}
              disabled={!isAvailable}
              className="flex items-center gap-1 rounded-full bg-brand-green/10 px-3 py-1.5 text-xs font-bold text-brand-green transition-colors hover:bg-brand-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus /> Add
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
