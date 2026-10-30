# 🚀 Thread & Bloom - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Database Migration (Supabase)
Run this SQL in Supabase SQL Editor:
```sql
-- Add Shiprocket tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shiprocket_order_id BIGINT,
ADD COLUMN IF NOT EXISTS shiprocket_shipment_id BIGINT,
ADD COLUMN IF NOT EXISTS awb_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_status VARCHAR(50) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS courier_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Add index for faster tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_awb_code ON orders(awb_code);
CREATE INDEX IF NOT EXISTS idx_orders_shiprocket_order_id ON orders(shiprocket_order_id);
```

### 2. Razorpay Setup (Live Keys)

#### Step 1: Complete KYC
- Login to Razorpay Dashboard: https://dashboard.razorpay.com
- Complete KYC verification (PAN, Aadhar, Bank)
- Wait for approval (usually 24-48 hours)

#### Step 2: Get Live API Keys
1. Go to Settings → API Keys
2. Click "Generate Live Keys"
3. Copy `Key ID` and `Key Secret`

#### Step 3: Setup Webhook
1. Go to Settings → Webhooks
2. Click "Add Webhook URL"
3. Enter: `https://your-domain.com/api/payment/webhook`
4. Select Events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
5. Copy `Webhook Secret`

#### Step 4: Update Backend .env
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3. Shiprocket Configuration

#### Already Configured ✅
- Email: threadandbloomsupport@gmail.com
- Password: sg#og692
- KYC: Verified
- Pickup Address: Flat 419, Dhruva Apartments, Trilok Puri, Delhi 110092
- Razorpay Integration: Connected

#### Additional Steps:
1. **Enable Couriers**
   - Login to Shiprocket: https://app.shiprocket.in
   - Go to Payment & Courier Selection
   - Enable 5-6 couriers (Bluedart, Delhivery, DTDC, Xpressbees, Ecom Express)
   - Save

2. **Recharge Wallet** (before going live)
   - Go to Wallet
   - Add ₹500-1000 for initial orders
   - Top-up as needed

3. **Set Default Pickup Location**
   - Go to Settings → Pickup Locations
   - Ensure "Primary" location is set to your address
   - This is used automatically by the API

### 4. Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here

# Payment Gateway (LIVE KEYS)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Shipping
SHIPROCKET_EMAIL=your_shiprocket_email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_API_TOKEN=

# Admin
ADMIN_SECRET_KEY=admin123
JWT_SECRET=Tb_sec_9f7b19dc635a91ee4c78e4745c92c9085d3fbe2e92c5780a

# Auth
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

---

## 🔄 Complete Payment Flow (Production)

### Customer Journey:
```
1. Browse products → Add to cart
2. Click "Checkout"
3. Fill shipping details
4. Select payment method (Card/UPI/NetBanking)
5. Redirected to Razorpay payment page
6. Complete payment
7. Redirected back to success page
```

### Backend Automation:
```
1. Payment successful → Razorpay webhook fires
2. Backend verifies payment signature
3. Order status: PENDING → CONFIRMED
4. Shiprocket order created automatically
5. AWB (tracking number) generated
6. Pickup scheduled automatically
7. Customer gets order confirmation email/WhatsApp
8. Admin sees order in dashboard with tracking
```

**Zero Manual Work Required! 🎉**

---

## 📦 Automatic Shiprocket Flow

### When Payment Succeeds:

1. **Order Creation**
   - API call to Shiprocket: `/orders/create/adhoc`
   - Returns `order_id` and `shipment_id`
   - Saved to database

2. **AWB Generation**
   - API call: `/courier/assign/awb`
   - Returns tracking number (AWB code)
   - Customer can track shipment

3. **Pickup Scheduling**
   - API call: `/courier/generate/pickup`
   - Courier notified to pick from your address
   - Usually picked up next working day

4. **Database Updated**
   - `shiprocket_order_id`: Shiprocket's internal ID
   - `shiprocket_shipment_id`: Shipment ID
   - `awb_code`: Tracking number
   - `tracking_status`: Current status
   - `courier_name`: Which courier assigned

### Manual Shipping (Fallback)
If automatic shipping fails:
1. Admin portal shows order with status "MANUAL_REQUIRED"
2. Admin clicks "Ship Now" button
3. Same automation runs manually
4. Order shipped successfully

---

## 🧪 Testing Guide

### Test Mode (Current Setup)
```bash
# Backend
cd d:\bedsheet\backend
npm run dev

# Frontend
cd d:\bedsheet
npm run dev
```

### Test Payment Flow:
1. Use Razorpay Test Cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
   - OTP: 123456

2. Check logs for:
   ```
   [Shiprocket Auto] Creating order for: TB-xxxxx
   [Shiprocket Auto] Order created: { order_id: xxx, shipment_id: xxx }
   [Shiprocket Auto] AWB generated: xxxxxxxxx
   [Shiprocket Auto] Pickup scheduled
   [Shiprocket Auto] ✅ Complete automation successful
   ```

3. Verify in Admin Portal:
   - Order shows tracking number
   - Status is "CONFIRMED"
   - Shiprocket details visible

4. Check Shiprocket Dashboard:
   - Login: https://app.shiprocket.in
   - Go to Orders
   - Order should be visible with AWB

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd d:\bedsheet
vercel --prod
```

#### Backend (Railway):
1. Go to: https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Connect repo
4. Add environment variables
5. Deploy

### Option 2: Single VPS (DigitalOcean/AWS)
```bash
# Setup PM2 for backend
npm i -g pm2
cd backend
pm2 start dist/server.js --name thread-bloom-api

# Setup Nginx for frontend
# (Separate guide needed)
```

---

## 📊 Admin Portal Features

### Order Management:
- View all orders
- Filter by status
- See payment details
- Track shipments
- Manual shipping (if needed)

### Tracking Information:
- Shiprocket Order ID
- Shipment ID
- AWB Code (tracking number)
- Courier Name
- Estimated Delivery Date
- Real-time tracking status
- Direct link to track: `https://shiprocket.co/tracking/{awb_code}`

### Dashboard Stats:
- Total orders
- Pending orders
- Total revenue
- Today's orders
- Low stock alerts

---

## 🔐 Security Checklist

- [x] Razorpay webhook signature verification
- [x] Admin portal password protected
- [x] JWT tokens for user auth
- [x] Rate limiting on all APIs
- [x] CORS configured
- [x] Environment variables secured
- [x] SQL injection prevention (Supabase)
- [x] XSS protection headers

---

## 🐛 Troubleshooting

### Shiprocket Order Creation Fails:
1. Check logs: `[Shiprocket Auto] Order creation failed:`
2. Verify credentials in `.env`
3. Check Shiprocket dashboard for API status
4. Ensure pickup address is set
5. Verify wallet has balance

### Payment Webhook Not Firing:
1. Check webhook URL in Razorpay dashboard
2. Ensure URL is publicly accessible (not localhost)
3. Check webhook secret matches `.env`
4. Look at Razorpay webhook logs

### AWB Not Generated:
- Some orders need manual AWB assignment
- Shiprocket auto-assigns best courier
- May take 5-10 minutes
- Check Shiprocket dashboard

### Database Connection Issues:
- Verify Supabase URL and keys
- Check if table has all new columns
- Run migration SQL if needed

---

## 📞 Support Contacts

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: 1800-120-5432

**Shiprocket Support:**
- Email: support@shiprocket.in
- Phone: 092129 92129
- Dashboard: https://app.shiprocket.in

**Your Credentials:**
- Shiprocket Email: threadandbloomsupport@gmail.com
- Pickup Address: Flat 419, Dhruva Apartments, Trilok Puri, Delhi 110092

---

## ✅ Go-Live Checklist

- [ ] Database migration completed (ADD_SHIPROCKET_FIELDS.sql)
- [ ] Razorpay KYC approved
- [ ] Razorpay live keys added to .env
- [ ] Razorpay webhook configured
- [ ] Shiprocket couriers enabled
- [ ] Shiprocket wallet recharged (₹500+)
- [ ] Test order completed successfully
- [ ] Admin portal accessible
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Test payment with real card (₹10)
- [ ] Verify Shiprocket order auto-creation
- [ ] Check AWB generation
- [ ] Confirm tracking works

**When all checked, YOU'RE LIVE! 🎉**

---

## 💰 Cost Breakdown

### Monthly Costs (Estimated):
- **Razorpay**: 2% + ₹3 per transaction (no monthly fee)
- **Shiprocket LITE**: ₹0/month (pay per shipment)
- **Supabase**: ₹0/month (free tier - 500MB database)
- **Hosting**: ₹500-1000/month (Vercel free, Railway free tier)
- **Domain**: ₹500-1000/year

**Total: ~₹1000-2000/month to start**

---

## 🎯 Next Steps After Launch

1. **Marketing**
   - Add Google Analytics
   - Setup Facebook Pixel
   - Create Instagram shop

2. **Features**
   - COD option (available, just need to enable)
   - Product reviews
   - Wishlist
   - Referral program

3. **Automation**
   - Email order confirmations (add SendGrid)
   - SMS notifications (Twilio)
   - WhatsApp order updates (already integrated!)

4. **Analytics**
   - Track conversion rates
   - Monitor cart abandonment
   - Customer retention metrics

---

**Good luck with your launch! 🚀✨**

*Thread & Bloom - Where Luxury Meets Comfort*
