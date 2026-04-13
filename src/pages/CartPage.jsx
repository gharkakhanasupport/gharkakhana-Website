import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { Container } from '../components/Container';
import { SiteFooter } from '../components/SiteFooter';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex min-h-screen flex-col bg-[#f2d4a8]">
      
      <main className="flex-1 pt-24 pb-16">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-brand-brown lg:text-4xl">
              Your Cart
            </h1>
            <p className="mt-2 text-brand-brown/70">
              Review your items before proceeding to checkout.
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white/60 p-12 text-center border border-brand-brown/10 backdrop-blur-sm min-h-[50vh]">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-cream text-brand-brown shadow-inner">
                <FiShoppingBag className="h-10 w-10 opacity-40" />
              </div>
              <h2 className="text-2xl font-bold text-brand-brown">Your cart is feeling light</h2>
              <p className="max-w-sm mt-3 text-brand-brown/70">
                Explore our menu to find your next delicious homemade meal!
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="mt-8 rounded-full bg-brand-green px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-brand-green/90 hover:-translate-y-0.5"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                {cart.map((cartItem, index) => {
                  const { item, quantity } = cartItem;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row items-center gap-4 rounded-[1.8rem] border border-brand-brown/10 bg-white p-4 shadow-sm"
                    >
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-cream/50">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl">🍽️</div>
                        )}
                      </div>
                      
                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between w-full">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-brand-brown">{item.name}</h3>
                          <p className="text-sm font-medium text-brand-brown/50">{item.category}</p>
                          <div className="mt-2 text-brand-green font-bold text-lg">
                            ₹{item.price}
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-3">
                          <div className="flex items-center rounded-full border border-brand-brown/10 bg-brand-cream/30 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-brown shadow-sm transition-colors hover:text-red-500"
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-brand-brown">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-brown shadow-sm transition-colors hover:text-brand-green"
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <FiTrash2 className="h-4 w-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-[380px] lg:sticky lg:top-28">
                <div className="rounded-[2rem] border border-brand-brown/10 bg-white p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-brand-brown mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-brand-brown/80 font-medium">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-brown/80 font-medium">
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
                    onClick={() => navigate('/checkout')}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-green/90 hover:-translate-y-0.5"
                  >
                    Proceed to Checkout <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
