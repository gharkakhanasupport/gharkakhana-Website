/**
 * Razorpay Payment Integration Utility
 * Uses Test API keys — switch to live keys for production.
 */

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Opens Razorpay Checkout modal and returns a promise that resolves
 * with the payment response on success, or rejects on failure/dismiss.
 *
 * @param {object} options
 * @param {number} options.amount        — Amount in INR (will be converted to paise)
 * @param {string} options.orderId       — Internal Supabase order ID (for reference)
 * @param {string} options.customerName  — Customer's display name
 * @param {string} options.customerEmail — Customer's email
 * @param {string} options.customerPhone — Customer's phone
 * @param {string} [options.description] — Payment description
 * @returns {Promise<{razorpay_payment_id: string, razorpay_order_id?: string, razorpay_signature?: string}>}
 */
export function openRazorpayCheckout({
  amount,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  description = 'GKK - Ghar Ka Khana Order',
}) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded. Please refresh the page.'));
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      reject(new Error('Razorpay Key ID is not configured.'));
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'Ghar Ka Khana',
      description,
      image: '/src/Images/GharKakhana%20Logo.png',
      notes: {
        order_id: orderId,
      },
      prefill: {
        name: customerName || '',
        email: customerEmail || '',
        contact: customerPhone || '',
      },
      theme: {
        color: '#5FA63B', // brand-green
        backdrop_color: 'rgba(0,0,0,0.6)',
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled by user.'));
        },
        confirm_close: true,
        escape: true,
      },
      handler: (response) => {
        // Called on successful payment
        resolve({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || null,
          razorpay_signature: response.razorpay_signature || null,
        });
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response) => {
      reject(new Error(
        response.error?.description || 
        response.error?.reason || 
        'Payment failed. Please try again.'
      ));
    });

    rzp.open();
  });
}
