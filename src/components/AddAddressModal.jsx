import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiPhone, FiUser, FiHome, FiBriefcase, FiMap, FiNavigation } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function AddAddressModal({ isOpen, onClose, userId, onAddressAdded, initialData = null }) {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    street_address: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        phone_number: initialData.phone_number || '',
        street_address: initialData.street_address || initialData.full_address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
        type: initialData.type || 'Home'
      });
    } else if (isOpen && !initialData) {
      setFormData({
        full_name: '',
        phone_number: '',
        street_address: '',
        city: '',
        state: '',
        pincode: '',
        type: 'Home'
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone_number || !formData.street_address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (initialData) {
        // Edit mode
        const { data, error } = await supabase
          .from('saved_addresses')
          .update({
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            type: formData.type
          })
          .eq('id', initialData.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast.success('Address updated successfully!');
      } else {
        // Add mode
        const { data, error } = await supabase
          .from('saved_addresses')
          .insert({
            user_id: userId,
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            type: formData.type
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast.success('Address saved successfully!');
      }
      
      onAddressAdded?.(result);
      onClose();
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    toast.loading('Fetching your location...', { id: 'locationToast' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error('Failed to fetch address');
          
          const data = await res.json();
          // Construct a very precise formatted address
          const addressParts = [];
          const addr = data.address;
          
          if (addr.building || addr.amenity || addr.office) addressParts.push(addr.building || addr.amenity || addr.office);
          if (addr.house_number) addressParts.push(`No. ${addr.house_number}`);
          if (addr.road || addr.pedestrian) addressParts.push(addr.road || addr.pedestrian);
          if (addr.neighbourhood || addr.suburb) addressParts.push(addr.neighbourhood || addr.suburb);
          
          let streetAddress = addressParts.filter(Boolean).join(', ');
          
          // Style with directional markers
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lonDir = longitude >= 0 ? 'E' : 'W';
          const absLat = Math.abs(latitude).toFixed(6);
          const absLon = Math.abs(longitude).toFixed(6);
          
          streetAddress += `\n📍 ${absLat}° ${latDir}, ${absLon}° ${lonDir}`;
          
          const city = addr.city || addr.town || addr.village || '';
          const state = addr.state || '';
          const pincode = addr.postcode || '';

          setFormData(prev => ({
            ...prev,
            street_address: streetAddress,
            city: city,
            state: state,
            pincode: pincode
          }));

          toast.success('Precise location fetched!', { id: 'locationToast' });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          toast.error('Failed to get address details', { id: 'locationToast' });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Allow location permissions to use this feature', { id: 'locationToast' });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-brown/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-brown/5 p-6">
              <h2 className="text-xl font-bold text-brand-brown">
                {initialData ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button 
                onClick={onClose}
                className="rounded-full p-2 text-brand-brown/40 hover:bg-brand-brown/5 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 pl-11 pr-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/30" />
                  <input
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="+91 9876543210"
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 pl-11 pr-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider">Street Address</label>
                  <button 
                    type="button" 
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiNavigation className={locationLoading ? 'animate-pulse' : ''} />
                    {locationLoading ? 'Locating...' : 'Use Current Location'}
                  </button>
                </div>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-4 text-brand-brown/30" />
                  <textarea
                    required
                    rows="2"
                    value={formData.street_address}
                    onChange={(e) => setFormData({...formData, street_address: e.target.value})}
                    placeholder="House No, Building, Street, Area..."
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 pl-11 pr-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Kolkata"
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 px-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider ml-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="West Bengal"
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 px-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider ml-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    placeholder="700001"
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 px-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-brown/50 uppercase tracking-wider ml-1">Address Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full rounded-2xl border-brand-brown/10 bg-brand-cream/20 py-3 px-4 text-sm focus:border-brand-green focus:ring-brand-green transition-all"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2">
                {['Home', 'Work', 'Other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, type})}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition-all ${
                      formData.type === type 
                        ? 'border-brand-green bg-brand-green/5 text-brand-green' 
                        : 'border-brand-brown/10 text-brand-brown/40 hover:border-brand-brown/30'
                    }`}
                  >
                    {type === 'Home' && <FiHome />}
                    {type === 'Work' && <FiBriefcase />}
                    {type === 'Other' && <FiMap />}
                    <span className="text-[10px] font-bold">{type}</span>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-full bg-brand-green py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-green/90 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
