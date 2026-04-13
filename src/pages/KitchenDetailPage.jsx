import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiStar, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { Container } from '../components/Container';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailModal } from '../components/FoodDetailModal';

export function KitchenDetailPage() {
  const { cookId } = useParams();
  const navigate = useNavigate();
  const [kitchen, setKitchen] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchKitchenData() {
      setLoading(true);
      // Fetch kitchen
      const { data: kitchenData, error: kitchenError } = await supabase
        .from('kitchens')
        .select('*')
        .eq('cook_id', cookId)
        .single();

      if (kitchenError || !kitchenData) {
        setError('Kitchen not found');
        setLoading(false);
        return;
      }
      setKitchen(kitchenData);

      // Fetch menu items
      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*')
        .eq('cook_id', cookId)
        .eq('is_available', true);

      // Fetch daily menus
      const { data: dailyData } = await supabase
        .from('daily_menus')
        .select('*')
        .eq('cook_id', cookId)
        .eq('is_available', true);

      const combinedItems = [...(menuData || []), ...(dailyData || [])];
      combinedItems.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setItems(combinedItems);
      setLoading(false);
    }

    fetchKitchenData();
  }, [cookId]);

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-4xl animate-pulse space-y-8">
            <div className="h-64 w-full rounded-3xl bg-white/60"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-white/60 border border-brand-brown/8"></div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (error || !kitchen) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-2xl font-bold text-brand-brown">Kitchen not found</h2>
            <button onClick={() => navigate('/menu')} className="mt-4 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-greenDark">
              Back to Menu
            </button>
          </div>
        </Container>
      </main>
    );
  }

  const photoUrl = kitchen.profile_image_url || (kitchen.kitchen_photos && kitchen.kitchen_photos[0]) || null;

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="absolute inset-0 warm-gradient" />
        <Container className="relative z-10 mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/menu')}
            className="mb-6 flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white/50 px-4 py-2 text-sm font-bold text-brand-brown backdrop-blur-md transition-colors hover:bg-white"
          >
            <FiArrowLeft /> Back
          </button>

          <div className="overflow-hidden rounded-3xl bg-white/70 shadow-soft backdrop-blur-md border border-brand-brown/5">
            <div className="md:flex">
              {photoUrl ? (
                <div className="h-64 w-full md:w-1/3 md:h-auto overflow-hidden">
                  <img src={photoUrl} alt={kitchen.kitchen_name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-64 w-full md:w-1/3 md:h-auto items-center justify-center bg-brand-cream/50 text-brand-brown/10">
                  <FiShoppingBag className="h-16 w-16" />
                </div>
              )}
              
              <div className="flex-1 p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {kitchen.is_vegetarian && (
                      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                        <span className="h-2 w-2 rounded-full bg-green-600"></span> Pure Veg
                      </span>
                    )}
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-brown sm:text-4xl">
                      {kitchen.kitchen_name}
                    </h1>
                    <p className="mt-2 text-sm font-bold text-brand-brown/60 uppercase tracking-widest">
                      By Chef {kitchen.owner_name}
                    </p>
                  </div>

                  {kitchen.rating ? (
                    <div className="flex shrink-0 items-center justify-center gap-1 rounded-2xl bg-amber-50 px-3 py-2 text-lg font-bold text-amber-600 border border-amber-200">
                      <FiStar className="fill-amber-400" />
                      {kitchen.rating?.toFixed(1)}
                    </div>
                  ) : null}
                </div>

                <p className="mt-6 text-brand-brown/70 leading-relaxed text-sm sm:text-base">
                  {kitchen.description || 'Authentic home-cooked meals prepared with love and hygiene.'}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-brand-brown shadow-sm border border-brand-brown/10">
                    <FiMapPin className="text-brand-green" />
                    <span>{kitchen.location || 'Local Kitchen'}</span>
                  </div>
                  {kitchen.total_orders > 0 && (
                    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-brand-blue shadow-sm border border-blue-100">
                      <FiShoppingBag className="text-brand-blue" />
                      <span>{kitchen.total_orders}+ Orders Delivered</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Menu Section */}
      <section className="pt-4">
        <Container className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between border-b border-brand-brown/10 pb-4">
            <h2 className="text-2xl font-bold text-brand-brown tracking-tight">Available Dishes</h2>
            <span className="rounded-full bg-brand-cream/80 px-3 py-1 text-xs font-bold text-brand-brown/70">
              {items.length} items
            </span>
          </div>

          {items.length === 0 ? (
             <motion.div
             initial={{ opacity: 0, scale: 0.96 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex flex-col items-center justify-center py-16 text-center"
           >
             <div className="text-6xl mb-6">🍳</div>
             <h3 className="text-xl font-bold text-brand-brown">No dishes available</h3>
             <p className="mt-2 text-sm text-brand-brown/60 max-w-sm">
               The chef hasn't added any available dishes at the moment. Please check back later.
             </p>
           </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((item, idx) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onClick={setSelectedItem}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </Container>
      </section>

      <FoodDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
