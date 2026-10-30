# Razorpay Payment Page Integration - Complete Guide

## 🎯 Steps to Follow:

### STEP 1: Create Payment Page in Razorpay Dashboard

1. **Login to Razorpay Dashboard**
   - URL: https://dashboard.razorpay.com/

2. **Click: "Select Payment Page"** (from your screenshot)

3. **Fill the Form:**
   ```
   Page Title: Thread & Bloom
   Description: Luxury Bedding Store
   Purpose: Products/Services
   Amount Type: Customer can enter amount ✓
   Upload Logo: (optional - upload your logo)
   Custom URL: threadandbloom (or any available name)
   ```

4. **Click: Create Payment Page**

5. **You'll Get:**
   - Payment Page URL: `https://rzp.io/l/threadandbloom`
   - QR Code (download it)
   - Shareable link

---

### STEP 2: Get Payment Page ID

After creating, you'll see something like:
```
Payment Page ID: pl_xxxxxxxxxxxx
Payment Link: https://rzp.io/l/threadandbloom
```

**Copy the Payment Page ID** - we'll use it in code!

---

### STEP 3: Update Backend Code

Add new function in `paymentController.ts`:

```typescript
/**
 * Create Razorpay Payment Link for Order
 * Uses Payment Pages - gives QR code automatically
 */
export async function createPaymentLink(req: Request, res: Response): Promise<void> {
  try {
    const { items, customer, couponCode } = req.body;

    // Validate items and customer (same as before)
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart items required' });
      return;
    }

    const customerRes = validateCustomerPayload(customer);
    if (!customerRes.isValid || !customerRes.value) {
      res.status(400).json({ success: false, message: customerRes.message });
      return;
    }

    const validCustomer = customerRes.value;

    // Calculate totals
    const { subtotal, discount, shippingFee, grandTotal } = calculateOrderTotals(
      items as CartItemPayload[], 
      couponCode
    );
    const orderNumber = generateOrderNumber();
    const amountInPaise = Math.round(grandTotal * 100);

    // Create Payment Link with Razorpay
    const paymentLink = await razorpay.paymentLink.create({
      amount: amountInPaise,
      currency: 'INR',
      description: `Thread & Bloom - Order #${orderNumber}`,
      customer: {
        name: `${validCustomer.firstName} ${validCustomer.lastName || ''}`.trim(),
        email: validCustomer.email,
        contact: validCustomer.phone.replace(/\D/g, ''), // Remove non-digits
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        order_number: orderNumber,
        customer_name: validCustomer.firstName,
        customer_phone: validCustomer.phone,
      },
      callback_url: `${process.env.FRONTEND_URL}/payment/success?order=${orderNumber}`,
      callback_method: 'get',
    });

    // Save order in database (payment pending)
    const orderRecord = {
      order_number: orderNumber,
      customer_name: `${validCustomer.firstName} ${validCustomer.lastName || ''}`.trim(),
      customer_email: validCustomer.email,
      customer_phone: validCustomer.phone,
      shipping_address: validCustomer.address,
      city: validCustomer.city,
      state: validCustomer.state,
      pincode: validCustomer.pincode,
      items: items,
      subtotal: subtotal,
      discount_amount: discount,
      coupon_code: couponCode || null,
      total_amount: grandTotal,
      payment_method: 'ONLINE',
      payment_status: 'PENDING',
      order_status: 'PLACED',
      razorpay_payment_link_id: paymentLink.id,
      created_at: new Date().toISOString(),
    };

    await supabase.from('orders').insert([orderRecord]);

    // Return payment link details
    res.status(200).json({
      success: true,
      orderNumber,
      paymentLink: paymentLink.short_url, // Short URL for customer
      qrCodeUrl: paymentLink.short_url + '/qr', // QR code image
      amount: grandTotal,
      currency: 'INR',
      expiresAt: paymentLink.expire_by,
    });

  } catch (err: any) {
    console.error('[Create Payment Link Error]:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment link',
      error: err.message 
    });
  }
}
```

---

### STEP 4: Add Webhook Handler

Create new file: `backend/src/controllers/webhookController.ts`

```typescript
import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/supabase';
import { sendOrderConfirmation } from '../utils/whatsapp';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

/**
 * Verify Razorpay webhook signature
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  return expectedSignature === signature;
}

/**
 * Handle Razorpay Webhooks
 * POST /api/webhooks/razorpay
 */
export async function handleRazorpayWebhook(req: Request, res: Response): Promise<void> {
  try {
    // Verify signature
    const signature = req.headers['x-razorpay-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!verifyWebhookSignature(payload, signature)) {
      console.error('[Webhook] Invalid signature');
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;
    const paymentLinkEntity = req.body.payload?.payment_link?.entity;

    console.log('[Webhook] Event received:', event);

    // Handle payment success
    if (event === 'payment.captured') {
      const orderNumber = paymentEntity?.notes?.order_number;
      
      if (!orderNumber) {
        console.error('[Webhook] No order number in payment notes');
        res.status(400).json({ error: 'No order number' });
        return;
      }

      // Update order in database
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_status: 'PAID',
          order_status: 'CONFIRMED',
          razorpay_payment_id: paymentEntity.id,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', orderNumber)
        .select()
        .single();

      if (error) {
        console.error('[Webhook] Database update error:', error);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      // Send WhatsApp confirmation
      try {
        await sendOrderConfirmation(
          data.customer_phone,
          data.order_number,
          data.customer_name,
          data.total_amount
        );
      } catch (whatsappError) {
        console.error('[Webhook] WhatsApp error:', whatsappError);
        // Don't fail webhook if WhatsApp fails
      }

      console.log(`[Webhook] Order ${orderNumber} marked as PAID`);
    }

    // Handle payment failure
    if (event === 'payment.failed') {
      const orderNumber = paymentEntity?.notes?.order_number;
      
      if (orderNumber) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'FAILED',
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', orderNumber);

        console.log(`[Webhook] Order ${orderNumber} marked as FAILED`);
      }
    }

    // Handle payment link expiry
    if (event === 'payment_link.expired') {
      const orderNumber = paymentLinkEntity?.notes?.order_number;
      
      if (orderNumber) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'EXPIRED',
            order_status: 'CANCELLED',
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', orderNumber);

        console.log(`[Webhook] Order ${orderNumber} expired`);
      }
    }

    res.json({ status: 'ok' });

  } catch (err: any) {
    console.error('[Webhook] Error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
```

---

### STEP 5: Create Webhook Route

Create: `backend/src/routes/webhookRoutes.ts`

```typescript
import { Router } from 'express';
import { handleRazorpayWebhook } from '../controllers/webhookController';

const router = Router();

// Razorpay webhook endpoint
router.post('/razorpay', handleRazorpayWebhook);

export default router;
```

---

### STEP 6: Register Routes in server.ts

Add in `backend/src/server.ts`:

```typescript
import webhookRoutes from './routes/webhookRoutes';

// ... other imports

// Add webhook route (BEFORE other routes - webhooks need raw body)
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// ... rest of your routes
```

---

### STEP 7: Update Frontend Checkout Page

Create: `app/payment/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader, CheckCircle, XCircle, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState<'loading' | 'waiting' | 'success' | 'failed'>('loading');

  useEffect(() => {
    // Get payment link from previous page (stored in sessionStorage)
    const linkData = sessionStorage.getItem('payment_link_data');
    if (linkData) {
      const data = JSON.parse(linkData);
      setPaymentLink(data.paymentLink);
      setQrCodeUrl(data.qrCodeUrl);
      setAmount(data.amount);
      setStatus('waiting');
      startPaymentPolling();
    }
  }, []);

  const startPaymentPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}/status`);
        const data = await response.json();
        
        if (data.payment_status === 'PAID') {
          setStatus('success');
          clearInterval(interval);
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            window.location.href = `/order-confirmation?order=${orderNumber}`;
          }, 2000);
        } else if (data.payment_status === 'FAILED') {
          setStatus('failed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(interval), 600000);
  };

  return (
    <div className="min-h-screen bg-[#12100E] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8">
        {/* Waiting for Payment */}
        {status === 'waiting' && (
          <>
            <div className="text-center mb-6">
              <QrCode className="w-16 h-16 text-[#E6C594] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#FAF6F0] mb-2">
                Scan QR Code to Pay
              </h1>
              <p className="text-[#C7B9A5]">
                Order #{orderNumber}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg mb-6">
              <Image
                src={qrCodeUrl}
                alt="Payment QR Code"
                width={300}
                height={300}
                className="w-full"
              />
            </div>

            {/* Amount */}
            <div className="text-center mb-6">
              <p className="text-sm text-[#C7B9A5] mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-[#E6C594]">
                ₹{amount.toLocaleString()}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-[#12100E] border border-[#3A3125] rounded-lg p-4 mb-6">
              <p className="text-sm text-[#FAF6F0] font-semibold mb-2">
                Payment Instructions:
              </p>
              <ol className="text-sm text-[#C7B9A5] space-y-1">
                <li>1. Scan QR code with any UPI app</li>
                <li>2. Verify amount (₹{amount.toLocaleString()})</li>
                <li>3. Complete payment</li>
                <li>4. Wait for confirmation</li>
              </ol>
            </div>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center gap-2 text-[#C7B9A5]">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="text-sm">Waiting for payment...</span>
            </div>

            {/* Payment Link Button */}
            <div className="mt-4">
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-[#E6C594] text-[#12100E] text-center font-bold rounded-lg hover:bg-[#FAF6F0] transition-colors"
              >
                Open Payment Page
              </a>
            </div>
          </>
        )}

        {/* Payment Success */}
        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#FAF6F0] mb-2">
              Payment Successful!
            </h2>
            <p className="text-[#C7B9A5]">
              Redirecting to order confirmation...
            </p>
          </div>
        )}

        {/* Payment Failed */}
        {status === 'failed' && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#FAF6F0] mb-2">
              Payment Failed
            </h2>
            <p className="text-[#C7B9A5] mb-4">
              Please try again or contact support
            </p>
            <button
              onClick={() => window.location.href = '/checkout'}
              className="px-6 py-3 bg-[#E6C594] text-[#12100E] font-bold rounded-lg hover:bg-[#FAF6F0] transition-colors"
            >
              Retry Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### STEP 8: Update .env File

Add to `backend/.env`:

```env
# Razorpay Webhook Secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

---

### STEP 9: Configure Webhook in Razorpay Dashboard

1. Go to: Settings → Webhooks
2. Click: + Add New Webhook
3. Webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Active Events: Select:
   - payment.captured
   - payment.failed
   - payment_link.expired
5. Secret: Copy the generated secret
6. Paste in `.env` file
7. Save!

---

## 🎯 How It All Works Together:

```
Customer Cart → Checkout → Backend creates Payment Link
                                ↓
                        Returns QR Code + Link
                                ↓
                   Frontend shows QR Code
                                ↓
                    Customer scans & pays
                                ↓
            Razorpay detects payment (1-2 sec)
                                ↓
              Sends webhook to your backend
                                ↓
        Backend verifies & updates order status
                                ↓
         Frontend polls backend every 3 sec
                                ↓
        Detects "PAID" status → Shows success!
                                ↓
            WhatsApp notification sent
                                ↓
                          DONE! ✅
```

---

## 💡 Benefits of This Approach:

✅ **Automatic QR Generation** - Razorpay creates QR
✅ **No Manual Verification** - Webhook handles everything
✅ **Real-time Updates** - Customer sees instant confirmation
✅ **Secure** - Webhook signature verification
✅ **Multiple Payment Methods** - UPI, Cards, Net Banking all work
✅ **SMS/Email Notifications** - Built-in from Razorpay
✅ **Payment Reminders** - Automatic from Razorpay
✅ **Professional** - Branded payment page

---

## 🚀 Ready to Implement?

Tell me:
1. ✅ Did you create Payment Page in Razorpay?
2. ✅ Got the Payment Page ID?
3. ✅ Want me to add these code changes now?

Bol do, main implement kar deta hoon! 🔥
