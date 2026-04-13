import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup, Reorder } from 'framer-motion';
import { FiSearch, FiX, FiPlus, FiTrash2, FiCheck, FiEdit3, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import { Container } from '../components/Container';
import { FoodCard } from '../components/FoodCard';
import { KitchenCard } from '../components/KitchenCard';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { FoodModeSwitch } from '../components/FoodModeSwitch';
import { useNavigate } from 'react-router-dom';
import { useMenu, useKitchens } from '../hooks/useMenu';
import { BannerSection } from '../components/BannerSection';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useBanners } from '../hooks/useBanners';
import { DEMO_MENU_SECTIONS } from '../data/demoData';

const SORT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'name-asc', label: 'Name A–Z' },
  { key: 'price-asc', label: 'Price Low–High' },
  { key: 'newest', label: 'Newest First' },
];

const AVAILABILITY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'soldout', label: 'Sold Out' },
];

function SectionSidebar({ sections, activeSection, onSelect, onReorder, onAdd, onRename, onDelete, dishCountMap }) {
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
      setAddingNew(false);
    }
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-brown/6">
        <h3 className="text-sm font-bold text-brand-brown uppercase tracking-wider">Sections</h3>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-1 text-xs font-bold text-brand-green hover:text-brand-greenDark transition-colors"
        >
          <FiPlus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {addingNew && (
        <div className="px-3 py-2 border-b border-brand-brown/6">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Section name..."
              className="flex-1 rounded-lg border border-brand-brown/10 bg-white px-3 py-1.5 text-sm text-brand-brown placeholder:text-brand-brown/40 focus:border-brand-green/40 focus:outline-none focus:ring-1 focus:ring-brand-green/20"
            />
            <button onClick={handleAdd} className="rounded-lg bg-brand-green p-1.5 text-white hover:bg-brand-greenDark transition-colors">
              <FiCheck className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setAddingNew(false); setNewName(''); }} className="rounded-lg bg-brand-brown/10 p-1.5 text-brand-brown/50 hover:bg-brand-brown/20 transition-colors">
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={onReorder}
        className="flex-1 overflow-y-auto py-1 space-y-0.5"
      >
        {/* All section */}
        <button
          onClick={() => onSelect('All')}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all ${
            activeSection === 'All'
              ? 'bg-brand-green/10 text-brand-green border-l-4 border-brand-green'
              : 'text-brand-brown/70 hover:bg-brand-cream/50 border-l-4 border-transparent'
          }`}
        >
          <span>All Dishes</span>
          <span className="text-xs text-brand-brown/40">{Object.values(dishCountMap).reduce((a, b) => a + b, 0)}</span>
        </button>

        {sections.map((section) => (
          <Reorder.Item key={section.id} value={section} className="list-none">
            <div
              className={`group flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all cursor-grab active:cursor-grabbing ${
                activeSection === section.name
                  ? 'bg-brand-green/10 text-brand-green border-l-4 border-brand-green'
                  : 'text-brand-brown/70 hover:bg-brand-cream/50 border-l-4 border-transparent'
              }`}
            >
              {editingId === section.id ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(section.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 rounded border border-brand-brown/10 bg-white px-2 py-1 text-sm focus:outline-none focus:border-brand-green/40"
                  />
                  <button onClick={() => handleRename(section.id)} className="text-brand-green hover:text-brand-greenDark">
                    <FiCheck className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => onSelect(section.name)} className="flex-1 text-left truncate">
                    {section.name}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-brand-brown/40">{dishCountMap[section.name] || 0}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingId(section.id); setEditName(section.name); }}
                        className="rounded p-1 text-brand-brown/30 hover:text-brand-brown/60 hover:bg-brand-brown/5 transition-colors"
                      >
                        <FiEdit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
                        className="rounded p-1 text-brand-brown/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

export function MenuPage() {
  const navigate = useNavigate();
  const { demoMode } = useSiteSettings();
  const { banners } = useBanners();
  const { items, categories, loading: menuLoading, error } = useMenu();
  const { kitchens, loading: kitchensLoading } = useKitchens();
  const [activeSection, setActiveSection] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [foodMode, setFoodMode] = useState('all');
  const [viewMode, setViewMode] = useState('dishes');
  const [sortBy, setSortBy] = useState('default');
  const [availFilter, setAvailFilter] = useState('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Menu sections with local ordering
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('gkk_menu_sections');
    if (stored) {
      try { setSections(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (sections.length === 0 && categories.length > 0) {
      const initial = demoMode
        ? DEMO_MENU_SECTIONS
        : categories.map((cat, i) => ({ id: `sec-${i}`, name: cat, order: i }));
      setSections(initial);
    }
  }, [categories, demoMode]);

  const saveSections = (newSections) => {
    setSections(newSections);
    localStorage.setItem('gkk_menu_sections', JSON.stringify(newSections));
  };

  const handleAddSection = (name) => {
    const newSection = { id: `sec-${Date.now()}`, name, order: sections.length };
    saveSections([...sections, newSection]);
  };

  const handleRenameSection = (id, newName) => {
    saveSections(sections.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleDeleteSection = (id) => {
    saveSections(sections.filter(s => s.id !== id));
  };

  // Dish count per section
  const dishCountMap = useMemo(() => {
    const map = {};
    items.forEach(item => {
      const cat = item.category || 'Uncategorized';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Food mode
    if (foodMode === 'veg') {
      result = result.filter((item) => {
        if (typeof item.is_veg === 'boolean') return item.is_veg;
        if (item.food_type) return item.food_type.toLowerCase() === 'veg';
        return true;
      });
    } else if (foodMode === 'nonveg') {
      result = result.filter((item) => {
        if (typeof item.is_veg === 'boolean') return !item.is_veg;
        if (item.food_type) return item.food_type.toLowerCase() !== 'veg';
        return true;
      });
    }

    // Section filter
    if (activeSection !== 'All') {
      result = result.filter((item) => item.category === activeSection);
    }

    // Availability filter
    if (availFilter === 'available') {
      result = result.filter(item => item.is_available !== false && (item.quantity_available === undefined || item.quantity_available > 0));
    } else if (availFilter === 'soldout') {
      result = result.filter(item => item.is_available === false || (item.quantity_available !== undefined && item.quantity_available <= 0));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [items, activeSection, searchQuery, foodMode, sortBy, availFilter]);

  const filteredKitchens = useMemo(() => {
    let result = kitchens;
    if (foodMode === 'veg') {
      result = result.filter(k => k.is_vegetarian);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(k =>
        k.kitchen_name?.toLowerCase().includes(q) ||
        k.location?.toLowerCase().includes(q) ||
        k.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [kitchens, searchQuery, foodMode]);

  const isLoading = viewMode === 'dishes' ? menuLoading : kitchensLoading;

  return (
    <main className="min-h-screen pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden pt-4 pb-8 md:pb-12">
        <div className="absolute inset-0 warm-gradient" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="eyebrow bg-white/86">🍽️ Fresh from home kitchens</span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-brand-brown sm:text-5xl lg:text-6xl">
              Today's <span className="text-brand-green">Menu</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-brand-brown/70 leading-relaxed sm:text-lg">
              Explore fresh, home-cooked meals prepared with love by our verified home chefs.
            </p>
          </motion.div>
        </Container>
      </section>

      {banners.length > 0 && (
        <BannerSection banners={banners} />
      )}

      {/* Top Controls */}
      <section className="sticky top-[90px] z-30 bg-[#f2d4a8]/95 backdrop-blur-md py-4 border-b border-brand-brown/5">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex rounded-full bg-brand-cream/60 p-1 border border-brand-brown/10">
                <button
                  onClick={() => setViewMode('dishes')}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${viewMode === 'dishes' ? 'bg-white text-brand-brown shadow-sm' : 'text-brand-brown/60 hover:text-brand-brown'}`}
                >
                  Dishes
                </button>
                <button
                  onClick={() => setViewMode('kitchens')}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${viewMode === 'kitchens' ? 'bg-white text-brand-brown shadow-sm' : 'text-brand-brown/60 hover:text-brand-brown'}`}
                >
                  Kitchens
                </button>
              </div>

              <div className="h-6 w-px bg-brand-brown/10 hidden sm:block" />

              <FoodModeSwitch active={foodMode} onChange={setFoodMode} />
            </div>

            {/* Search */}
            <div className="relative min-w-[220px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-brown/40" />
              <input
                type="text"
                placeholder={`Search ${viewMode}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-brand-brown/10 bg-white/80 py-2.5 pl-10 pr-10 text-sm text-brand-brown placeholder:text-brand-brown/40 focus:border-brand-green/40 focus:outline-none focus:ring-2 focus:ring-brand-green/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 hover:text-brand-brown"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="pt-6 md:pt-8">
        <Container>
          {viewMode === 'dishes' ? (
            /* Two-Panel Layout */
            <div className="flex gap-6">
              {/* Sidebar - Desktop */}
              <div className="hidden lg:block w-[260px] shrink-0">
                <div className="sticky top-[180px] rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow-sm overflow-hidden max-h-[calc(100vh-200px)]">
                  <SectionSidebar
                    sections={sections}
                    activeSection={activeSection}
                    onSelect={setActiveSection}
                    onReorder={saveSections}
                    onAdd={handleAddSection}
                    onRename={handleRenameSection}
                    onDelete={handleDeleteSection}
                    dishCountMap={dishCountMap}
                  />
                </div>
              </div>

              {/* Mobile Section Pills */}
              <div className="lg:hidden w-full">
                <div className="mb-4 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-2 pb-2">
                    <button
                      onClick={() => setActiveSection('All')}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                        activeSection === 'All'
                          ? 'bg-brand-green text-white shadow-sm'
                          : 'bg-white/70 text-brand-brown/60 border border-brand-brown/10'
                      }`}
                    >
                      All
                    </button>
                    {sections.map(sec => (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.name)}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                          activeSection === sec.name
                            ? 'bg-brand-green text-white shadow-sm'
                            : 'bg-white/70 text-brand-brown/60 border border-brand-brown/10'
                        }`}
                      >
                        {sec.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 min-w-0">
                {/* Right panel filters */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Availability Pills */}
                    {AVAILABILITY_FILTERS.map(f => (
                      <button
                        key={f.key}
                        onClick={() => setAvailFilter(f.key)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                          availFilter === f.key
                            ? 'bg-brand-green text-white shadow-sm'
                            : 'bg-white/70 text-brand-brown/50 border border-brand-brown/10 hover:border-brand-green/30'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-brand-brown/50">
                      {filteredItems.length} dish{filteredItems.length !== 1 ? 'es' : ''}
                    </p>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center gap-1.5 rounded-xl border border-brand-brown/10 bg-white/80 px-3 py-1.5 text-xs font-bold text-brand-brown/60 hover:border-brand-green/30 transition-all"
                      >
                        {SORT_OPTIONS.find(s => s.key === sortBy)?.label || 'Sort'}
                        <FiChevronDown className="h-3 w-3" />
                      </button>
                      <AnimatePresence>
                        {showSortDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-white border border-brand-brown/10 shadow-soft py-1 z-20"
                          >
                            {SORT_OPTIONS.map(opt => (
                              <button
                                key={opt.key}
                                onClick={() => { setSortBy(opt.key); setShowSortDropdown(false); }}
                                className={`w-full px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                  sortBy === opt.key
                                    ? 'bg-brand-green/10 text-brand-green'
                                    : 'text-brand-brown/70 hover:bg-brand-cream/50'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Dishes Grid */}
                {isLoading && (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse rounded-[1.8rem] bg-white/60 border border-brand-brown/8">
                        <div className="aspect-[4/3] rounded-t-[1.8rem] bg-brand-cream/80" />
                        <div className="p-5 space-y-3">
                          <div className="h-5 w-2/3 rounded-lg bg-brand-cream/80" />
                          <div className="h-3 w-full rounded-lg bg-brand-cream/60" />
                          <div className="h-3 w-1/2 rounded-lg bg-brand-cream/60" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">
                    <p className="text-red-600 font-medium">Failed to load menu: {error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 text-sm font-bold text-brand-green hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!isLoading && !error && filteredItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="text-7xl mb-6">👨‍🍳</div>
                    <h3 className="text-2xl font-bold text-brand-brown">
                      {searchQuery ? 'No dishes match your search' : 'Menu is being prepared'}
                    </h3>
                    <p className="mt-3 max-w-md text-sm text-brand-brown/60 leading-relaxed">
                      {searchQuery
                        ? `No results for "${searchQuery}". Try a different search term.`
                        : 'Our home chefs are crafting delicious meals. Check back soon for fresh dishes!'}
                    </p>
                    {(searchQuery || activeSection !== 'All') && (
                      <button
                        onClick={() => { setSearchQuery(''); setActiveSection('All'); setAvailFilter('all'); }}
                        className="mt-5 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-greenDark transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </motion.div>
                )}

                {!isLoading && !error && filteredItems.length > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection + searchQuery + foodMode + sortBy + availFilter}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    >
                      {filteredItems.map((item, idx) => (
                        <FoodCard
                          key={item.id}
                          item={item}
                          index={idx}
                          onClick={(item) => navigate(`/kitchen/${item.cook_id}`)}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          ) : (
            /* Kitchens View */
            <>
              {kitchensLoading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-3xl bg-white/60 border border-brand-brown/8">
                      <div className="aspect-[4/3] rounded-t-3xl bg-brand-cream/80" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 w-2/3 rounded-lg bg-brand-cream/80" />
                        <div className="h-3 w-full rounded-lg bg-brand-cream/60" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!kitchensLoading && filteredKitchens.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="text-7xl mb-6">🏪</div>
                  <h3 className="text-2xl font-bold text-brand-brown">
                    {searchQuery ? 'No kitchens match your search' : 'No kitchens available yet'}
                  </h3>
                  <p className="mt-3 max-w-md text-sm text-brand-brown/60 leading-relaxed">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try a different search term.`
                      : 'Home chefs are getting ready to serve you. Check back soon!'}
                  </p>
                </motion.div>
              )}

              {!kitchensLoading && filteredKitchens.length > 0 && (
                <>
                  <div className="mb-6">
                    <p className="text-sm font-medium text-brand-brown/60">
                      {filteredKitchens.length} kitchen{filteredKitchens.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={searchQuery + foodMode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {filteredKitchens.map((kitchen) => (
                        <KitchenCard key={kitchen.id} kitchen={kitchen} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Food Detail Modal */}
      <FoodDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
