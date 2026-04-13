import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gkk_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gkk_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.item.id === item.id);
      if (existing) {
        toast.success(`Updated ${item.name} quantity in cart!`);
        return prev.map((p) =>
          p.item.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      toast.success(`Added ${item.name} to cart!`);
      return [...prev, { item, quantity }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.item.id !== itemId);
      return prev.map((p) =>
        p.item.id === itemId ? { ...p, quantity } : p
      );
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((p) => p.item.id !== itemId));
    toast('Item removed from cart', { icon: '🗑️' });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, { item, quantity }) => total + (item.price * quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, { quantity }) => total + quantity, 0);
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find((p) => p.item.id === itemId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
