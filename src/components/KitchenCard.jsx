import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiShoppingBag, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export function KitchenCard({ kitchen }) {
  const photoUrl = kitchen.profile_image_url || (kitchen.kitchen_photos && kitchen.kitchen_photos[0]) || null;
  const isActive = kitchen.is_available !== false;
  const dishCount = kitchen.dish_count ?? kitchen.total_dishes ?? 0;

  return (
    <Link to={`/kitchen/${kitchen.cook_id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_20px_rgba(47,42,61,0.04)] transition-all hover:shadow-[0_12px_28px_rgba(47,42,61,0.08)]"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream/40">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={kitchen.kitchen_name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-brand-brown/10">
              <FiShoppingBag className="h-12 w-12" />
            </div>
          )}

          {/* Status Badge */}
          <div className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            isActive
              ? 'bg-green-50/90 text-green-700 border border-green-200/60'
              : 'bg-red-50/90 text-red-600 border border-red-200/60'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            {isActive ? 'Active' : 'Inactive'}
          </div>

          {/* Vegetarian Badge */}
          {kitchen.is_vegetarian && (
            <div className="absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-green-700 shadow-sm backdrop-blur-md flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-600"></span> Pure Veg
            </div>
          )}

          {/* Rating Badge */}
          {kitchen.rating ? (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-brand-brown shadow-sm backdrop-blur-md">
              <FiStar className="fill-amber-400 text-amber-400" />
              <span>{kitchen.rating?.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-1">
            <h3 className="font-navbar text-[1.1rem] font-bold leading-tight tracking-tight text-brand-brown">
              {kitchen.kitchen_name}
            </h3>
          </div>

          {/* Chef & Dish Count */}
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-brown/50">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-cream/80 text-brand-brown/40">
                👨‍🍳
              </span>
              Chef {kitchen.owner_name?.split(' ')[0] || 'GKK'}
            </span>
            {dishCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-brand-brown/50">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-cream/80 text-brand-brown/40">
                  🍽️
                </span>
                {dishCount} dishes
              </span>
            )}
          </div>

          <p className="line-clamp-2 text-sm text-brand-brown/60">
            {kitchen.description || 'Authentic home-cooked meals prepared with love and hygiene.'}
          </p>

          {/* Quick Actions Row */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-brand-brown/6">
            <div className="flex items-center gap-1.5 text-xs font-medium text-brand-brown/50">
              <FiMapPin className="text-brand-brown/40" />
              <span className="line-clamp-1">{kitchen.location || 'Local Kitchen'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green">
              View Dishes <FiChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
