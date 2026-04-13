import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight, FiPlus, FiShield, FiSmartphone } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Container } from '../components/Container';
import { SiteFooter } from '../components/SiteFooter';
import { AddAddressModal } from '../components/AddAddressModal';
import { openRazorpayCheckout } from '../utils/razorpay';

export function CheckoutPage() {
  const { user } = useAuthStore();
  const { cart, getCartTotal, getTotalItems, clearCart } = useCart();
  const { demoMode } = useSiteSettings();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, online, wallet

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/signin');
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [user, cart]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
      if (data && data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      toast.error('Could not load your addresses.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates the order record in Supabase.
   * For online payments, status starts as 'pending_payment'.
   * For COD/wallet, status starts as 'pending'.
   */
  const createOrder = async (status = 'pending') => {
    const subtotal = getCartTotal();
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    const orderItems = cart.map(c => ({
      menu_item_id: c.item.id,
      name: c.item.name,
      quantity: c.quantity,
      price: c.item.price
    }));

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        cook_id: cart[0].item.cook_id,
        customer_name: user.user_metadata?.full_name || user.user_metadata?.first_name || '',
        customer_phone: user.user_metadata?.phone || '',
        items: orderItems,
        total_amount: total,
        status,
        delivery_address: selectedAddressId
      })
      .select()
      .single();

    if (error) throw error;
    return { order, total };
  };

  /**
   * Creates an initial payment record in Supabase.
   */
  const createPaymentRecord = async (orderId, amount, method, status = 'pending') => {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        order_id: orderId,
        amount: Math.round(amount),
        currency: 'INR',
        payment_method: method,
        payment_type: method === 'online' ? 'razorpay' : method,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    return payment;
  };

  /**
   * Updates the payment record after Razorpay success.
   */
  const updatePaymentSuccess = async (paymentId, razorpayResponse) => {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        transaction_id: razorpayResponse.razorpay_payment_id,
        gateway_reference: razorpayResponse.razorpay_order_id || null,
        razorpay_signature: razorpayResponse.razorpay_signature || null,
        completed_at: new Date().toISOString(),
        metadata: razorpayResponse,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (error) throw error;
  };

  /**
   * Updates the payment record on failure.
   */
  const updatePaymentFailure = async (paymentId, errorMsg) => {
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        metadata: { error: errorMsg },
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);
  };

  /**
   * Updates the order status.
   */
  const updateOrderStatus = async (orderId, status) => {
    await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
  };

  /* ─── Handle Razorpay Online Payment ─── */
  const handleOnlinePayment = async () => {
    let order = null;
    let payment = null;

    try {
      // 1. Create order with pending_payment status
      const result = await createOrder('pending_payment');
      order = result.order;

      // 2. Create payment record
      payment = await createPaymentRecord(order.id, result.total, 'online', 'initiated');

      // 3. Open Razorpay Checkout
      const rzpResponse = await openRazorpayCheckout({
        amount: result.total,
        orderId: order.id,
        customerName: user.user_metadata?.full_name || user.user_metadata?.first_name || '',
        customerEmail: user.email,
        customerPhone: user.user_metadata?.phone || '',
        description: `Order #${order.id.slice(0, 8)} - Ghar Ka Khana`,
      });

      // 4. Payment succeeded — update records
      await updatePaymentSuccess(payment.id, rzpResponse);
      await updateOrderStatus(order.id, 'pending');

      toast.success('Payment successful! 🎉');
      setOrderComplete(true);
      clearCart();
      setTimeout(() => navigate('/dashboard'), 3000);

    } catch (err) {
      console.error('Online payment error:', err);

      // Update records if they were created
      if (payment?.id) {
        await updatePaymentFailure(payment.id, err.message);
      }
      if (order?.id) {
        await updateOrderStatus(order.id, 'payment_failed');
      }

      if (err.message === 'Payment cancelled by user.') {
        toast('Payment was cancelled', { icon: '⚠️' });
        // Clean up the failed order
        if (order?.id) {
          await supabase.from('orders').delete().eq('id', order.id);
          await supabase.from('payments').delete().eq('id', payment?.id);
        }
      } else {
        toast.error(err.message || 'Payment failed. Please try again.');
      }
    }
  };

  /* ─── Handle COD / Wallet Payment ─── */
  const handleCodOrWalletPayment = async () => {
    try {
      const { order, total } = await createOrder('pending');
      await createPaymentRecord(
        order.id,
        total,
        paymentMethod,
        paymentMethod === 'cod' ? 'pending' : 'completed'
      );

      setOrderComplete(true);
      clearCart();
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order. Please try again.');
    }
  };

  /* ─── Main Place Order Handler ─── */
  const handlePlaceOrder = async () => {
    if (demoMode) {
      toast.error('Ordering is disabled in Demo Mode.', {
        icon: '🚫',
        duration: 4000
      });
      return;
    }

    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      if (paymentMethod === 'online') {
        await handleOnlinePayment();
      } else {
        await handleCodOrWalletPayment();
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-green/5">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-[3rem] bg-white p-12 text-center shadow-xl border border-brand-green/20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-green/20 text-brand-green"
          >
            <FiCheckCircle className="h-12 w-12" />
          </motion.div>
          <h1 className="mt-8 text-3xl font-bold text-brand-brown">Order Confirmed!</h1>
          <p className="mt-4 text-brand-brown/70 max-w-sm">
            {paymentMethod === 'online' 
              ? 'Payment received successfully! Your food is being prepared.'
              : 'Your food is being prepared. You will be redirected to your dashboard to track the status.'
            }
          </p>
          {paymentMethod === 'online' && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              <FiShield className="h-4 w-4" /> Payment Verified
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex min-h-screen flex-col bg-[#f2d4a8]">
      
      <main className="flex-1 pt-24 pb-16">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-brand-brown lg:text-4xl">
              Checkout
            </h1>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Main Checkout Flow */}
            <div className="flex-1 space-y-6">
              
              {/* Address Section */}
              <div className="rounded-[2rem] border border-brand-brown/10 bg-white p-6 md:p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-brown/5 text-brand-brown">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-brown">Delivery Address</h2>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="ml-auto flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1.5 text-xs font-bold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
                  >
                    <FiPlus /> Add New
                  </button>
                </div>

                {loading ? (
                  <div className="py-4 text-center text-brand-brown/50">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-brand-brown/20 p-6 text-center">
                    <p className="text-brand-brown/60 mb-4">You don't have any saved addresses yet.</p>
                    <button onClick={() => setIsAddressModalOpen(true)} className="font-bold text-brand-green hover:underline">
                      Add a new address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-brand-green bg-brand-green/5'
                            : 'border-brand-brown/10 hover:border-brand-brown/30 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-brand-brown">{addr.type || 'Home'}</h3>
                          {selectedAddressId === addr.id && (
                            <FiCheckCircle className="text-brand-green h-5 w-5" />
                          )}
                        </div>
                        <p className="mt-1 font-medium text-brand-brown/80">{addr.full_name} • {addr.phone_number}</p>
                        <p className="mt-2 text-sm text-brand-brown/60 leading-relaxed">
                          {addr.full_address}, {addr.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="rounded-[2rem] border border-brand-brown/10 bg-white p-6 md:p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-brown/5 text-brand-brown">
                    <FiCreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-brown">Payment Method</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Pay on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex items-center gap-3 ${
                      paymentMethod === 'cod'
                        ? 'border-brand-green bg-brand-green/5'
                        : 'border-brand-brown/10 hover:border-brand-brown/30'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-green' : 'border-brand-brown/30'}`}>
                      {paymentMethod === 'cod' && <div className="h-2 w-2 rounded-full bg-brand-green" />}
                    </div>
                    <div>
                      <span className="font-bold text-brand-brown text-sm">Pay on Delivery</span>
                      <p className="text-[10px] text-brand-brown/50 mt-0.5">Cash / UPI at door</p>
                    </div>
                  </div>

                  {/* Pay Online (Razorpay) */}
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex items-center gap-3 ${
                      paymentMethod === 'online'
                        ? 'border-brand-green bg-brand-green/5 shadow-md shadow-brand-green/10'
                        : 'border-brand-brown/10 hover:border-brand-brown/30'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-brand-green' : 'border-brand-brown/30'}`}>
                      {paymentMethod === 'online' && <div className="h-2 w-2 rounded-full bg-brand-green" />}
                    </div>
                    <div>
                      <span className="font-bold text-brand-brown text-sm">Pay Online</span>
                      <p className="text-[10px] text-brand-brown/50 mt-0.5">UPI / Card / NetBanking</p>
                    </div>
                  </div>

                  {/* GKK Wallet */}
                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex items-center gap-3 ${
                      paymentMethod === 'wallet'
                        ? 'border-brand-green bg-brand-green/5'
                        : 'border-brand-brown/10 hover:border-brand-brown/30'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-brand-green' : 'border-brand-brown/30'}`}>
                      {paymentMethod === 'wallet' && <div className="h-2 w-2 rounded-full bg-brand-green" />}
                    </div>
                    <div>
                      <span className="font-bold text-brand-brown text-sm">GKK Wallet</span>
                      <p className="text-[10px] text-brand-brown/50 mt-0.5">Use wallet balance</p>
                    </div>
                  </div>
                </div>

                {/* Online payment badge */}
                <AnimatePresence>
                  {paymentMethod === 'online' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 border border-blue-100">
                        <FiShield className="h-4 w-4 text-blue-600 shrink-0" />
                        <p className="text-xs text-blue-700">
                          <span className="font-bold">Secure Payment</span> — You'll be redirected to Razorpay's secure payment gateway. Supports UPI, Debit/Credit Cards, Net Banking, and Wallets.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[400px]">
              <div className="rounded-[2rem] border border-brand-brown/10 bg-white p-6 md:p-8 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-xl font-bold text-brand-brown mb-6">Order Details</h2>
                
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
                  {cart.map((c) => (
                    <div key={c.item.id} className="flex justify-between text-sm">
                      <span className="text-brand-brown/80">
                        <span className="font-bold">{c.quantity}x</span> {c.item.name}
                      </span>
                      <span className="font-medium text-brand-brown">₹{c.item.price * c.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="my-4 border-t border-brand-brown/10"></div>
                  
                  <div className="flex justify-between text-sm text-brand-brown/80 font-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-brown/80 font-medium">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="my-4 border-t border-brand-brown/10"></div>
                  
                  <div className="flex justify-between items-center text-brand-brown font-bold text-xl">
                    <span>Total</span>
                    <span className="text-brand-green">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !selectedAddressId}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 ${
                    paymentMethod === 'online'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-brand-green hover:bg-brand-green/90'
                  }`}
                >
                  {isPlacingOrder ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : paymentMethod === 'online' ? (
                    <>
                      <FiCreditCard className="h-5 w-5" />
                      Pay ₹{total.toFixed(2)} Online
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </button>

                {/* Payment methods info */}
                {paymentMethod === 'online' && (
                  <div className="mt-4 flex items-center justify-center gap-3 text-brand-brown/30">
                    <span className="text-[10px] font-medium uppercase tracking-wider">Powered by</span>
                    <span className="text-xs font-bold text-blue-600">Razorpay</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </Container>
      </main>

      <SiteFooter />

      <AddAddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        userId={user?.id}
        onAddressAdded={() => {
          fetchAddresses();
        }}
      />
    </div>
  );
}
