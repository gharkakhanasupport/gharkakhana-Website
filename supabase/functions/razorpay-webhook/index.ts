// Supabase Edge Function — Razorpay Webhook Handler
// Deploy to Supabase: supabase functions deploy razorpay-webhook
//
// This function receives POST requests from Razorpay webhook events,
// verifies the signature, and updates the payments/orders tables accordingly.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

// Your Razorpay Key Secret (set as Supabase secret)
// Run: supabase secrets set RAZORPAY_KEY_SECRET=mb1I4CJxFKFZQDEDTml37sTa
// Run: supabase secrets set RAZORPAY_WEBHOOK_SECRET=<your_webhook_secret_from_razorpay>
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verify Razorpay webhook signature
 */
function verifyWebhookSignature(body, signature, secret) {
  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Verify signature if webhook secret is set
    if (RAZORPAY_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(body, signature, RAZORPAY_WEBHOOK_SECRET);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.event;
    const payload = event.payload;

    console.log(`Received webhook event: ${eventType}`);

    switch (eventType) {
      // ─── Payment Authorized ───
      case 'payment.authorized': {
        const payment = payload.payment.entity;
        const orderId = payment.notes?.order_id;

        if (orderId) {
          await supabase
            .from('payments')
            .update({
              status: 'authorized',
              transaction_id: payment.id,
              metadata: payment,
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId)
            .eq('payment_type', 'razorpay');
        }
        break;
      }

      // ─── Payment Captured (Success) ───
      case 'payment.captured': {
        const payment = payload.payment.entity;
        const orderId = payment.notes?.order_id;

        if (orderId) {
          // Update payment record
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              transaction_id: payment.id,
              metadata: payment,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId)
            .eq('payment_type', 'razorpay');

          // Update order status
          await supabase
            .from('orders')
            .update({
              status: 'pending',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
            .eq('status', 'pending_payment');
        }
        break;
      }

      // ─── Payment Failed ───
      case 'payment.failed': {
        const payment = payload.payment.entity;
        const orderId = payment.notes?.order_id;

        if (orderId) {
          await supabase
            .from('payments')
            .update({
              status: 'failed',
              transaction_id: payment.id,
              metadata: payment,
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId)
            .eq('payment_type', 'razorpay');

          await supabase
            .from('orders')
            .update({
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);
        }
        break;
      }

      // ─── Refund Processed ───
      case 'refund.processed': {
        const refund = payload.refund.entity;
        const payment = payload.payment.entity;
        const orderId = payment.notes?.order_id;

        if (orderId) {
          await supabase
            .from('payments')
            .update({
              refund_status: 'processed',
              refund_amount: refund.amount / 100, // Convert from paise
              refund_id: refund.id,
              refund_reason: refund.notes?.reason || 'Refund processed',
              refunded_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId)
            .eq('payment_type', 'razorpay');

          await supabase
            .from('orders')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
