# Manual UPI Payment System - Thread & Bloom

## 🎯 Complete Flow

### Customer Journey:

1. **Checkout Page**
   - Select payment method: "Pay via UPI/QR Code"
   - See QR code displayed
   - See payment instructions
   - Amount clearly shown: ₹12,999

2. **Payment Process**
   - Customer scans QR with Google Pay/PhonePe/Paytm
   - Enters amount manually (or pre-filled)
   - Completes payment
   - Gets success message from UPI app

3. **Upload Screenshot**
   - Button: "Upload Payment Screenshot"
   - Customer selects screenshot from gallery
   - Upload happens
   - Order confirmation shown

4. **Order Confirmation**
   - Order Number: TB-123456
   - Status: "Payment Verification Pending"
   - Message: "Your order is placed! We'll confirm payment within 1 hour."
   - WhatsApp message sent with order details

### Admin Journey:

1. **New Order Alert**
   - Dashboard shows: "1 New Order - Payment Pending"
   - Notification sound/email (optional)

2. **Order Details Page**
   - Customer info visible
   - Order items visible
   - Payment screenshot visible (full size preview)
   - Payment details:
     - Amount: ₹12,999
     - Method: UPI/QR Code
     - Screenshot: [View Full Size]
     - Status: Pending Verification

3. **Verification Process**
   - Click on screenshot to zoom
   - Check:
     ✅ Amount matches (₹12,999)
     ✅ Transaction successful
     ✅ UTR/Transaction ID visible
     ✅ Timestamp is recent (today's date)

4. **Confirm Payment**
   - Button: "Verify & Confirm Payment"
   - Click → Order status changes to "Payment Confirmed"
   - Customer gets WhatsApp: "Payment verified! Your order is being processed."
   - Order moves to "Ready to Ship" queue

5. **If Payment Invalid**
   - Button: "Reject Payment"
   - Reason dropdown: 
     - Amount incorrect
     - Screenshot unclear
     - Payment failed
     - Duplicate
   - Customer gets notification: "Payment verification failed. Please contact support."
   - Order stays in pending, customer can re-upload

---

## 🔧 Features I'll Build:

### 1. Checkout Page Changes:
```tsx
// New payment option
- COD (existing)
- Pay Online with Razorpay (existing)
+ Pay via UPI/QR Code (NEW!)
  └─ When selected:
     └─ Shows QR code image
     └─ Shows amount
     └─ Shows instructions
     └─ Upload button
```

### 2. Payment Screenshot Upload:
```tsx
- File picker (images only)
- Preview before upload
- Upload to Supabase storage
- Store URL in order record
- Client-side validation (file size, format)
```

### 3. Admin Panel Updates:
```tsx
Orders Page:
- New badge: "Payment Pending" (yellow)
- Filter: Show only pending payments
- Quick view screenshot icon

Order Details Page:
- Payment screenshot section
- Big "Verify Payment" button (green)
- "Reject Payment" button (red)
- Screenshot viewer modal (zoom, download)
- Verification history log
```

### 4. Database Changes:
```sql
-- Add to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS 
  payment_screenshot_url TEXT,
  payment_verification_status TEXT DEFAULT 'pending',
  payment_verified_at TIMESTAMPTZ,
  payment_verified_by TEXT,
  payment_rejection_reason TEXT;
```

### 5. Notifications:
```
Customer:
- Order placed: "Payment verification pending"
- Payment verified: "Payment confirmed! Order processing."
- Payment rejected: "Payment verification failed. Please retry."

Admin:
- Email/SMS when new pending payment order
- Dashboard notification badge
```

---

## 📱 Customer Instructions (On Checkout):

```
╔══════════════════════════════════════╗
║   PAYMENT INSTRUCTIONS               ║
╠══════════════════════════════════════╣
║                                      ║
║  1. Scan QR code with any UPI app    ║
║     (Google Pay, PhonePe, Paytm)     ║
║                                      ║
║  2. Enter Amount: ₹12,999            ║
║                                      ║
║  3. Complete the payment             ║
║                                      ║
║  4. Take screenshot of success page  ║
║                                      ║
║  5. Upload screenshot below          ║
║                                      ║
║  6. We'll verify within 1 hour!      ║
║                                      ║
╚══════════════════════════════════════╝

[QR Code Image Here]

Amount to Pay: ₹12,999

[ Upload Payment Screenshot ]
      (Click to select image)

[✓] I have completed the payment

      [ Place Order ]
```

---

## 🎯 Verification Criteria (For Admin):

### ✅ Valid Payment Screenshot Should Have:
1. **Bank/UPI App Name** visible (Google Pay, PhonePe, etc.)
2. **Success Message** clear ("Payment Successful", "Done", etc.)
3. **Amount** clearly showing ₹12,999
4. **Transaction ID / UTR Number** visible
5. **Date & Time** visible (should be recent)
6. **Recipient** name visible (your name/business name)

### ❌ Invalid/Reject If:
1. Screenshot is blurry/unclear
2. Amount doesn't match
3. Shows "Payment Failed" or "Pending"
4. Old screenshot (date mismatch)
5. Screenshot from different payment (different amount)
6. Edited/photoshopped (suspicious)

---

## 💡 Pro Tips:

### For Customer:
- Clear screenshot lena
- Full screen capture karna
- Amount clearly visible hona chahiye
- Transaction successful hona chahiye

### For Admin:
- 1 hour ke andar verify karna
- Double check amount
- UTR number note kar lena (refund ke liye)
- Screenshot save kar lena records ke liye

---

## 🔐 Security Features:

1. **File Upload Security:**
   - Only image files allowed (jpg, png, jpeg)
   - Max file size: 5MB
   - Virus scan (if using Supabase storage)
   - Secure URLs with expiry

2. **Duplicate Detection:**
   - Check if same screenshot uploaded before
   - Check if same transaction ID used
   - Alert if suspicious activity

3. **Audit Trail:**
   - Log who verified payment
   - Log when verified
   - Log IP address
   - Cannot reverse verification (permanent record)

---

## 🚀 Timeline:

**15 Minutes:**
- Frontend: QR code display + upload
- Backend: Store screenshot URL
- Admin: Basic view screenshot

**30 Minutes:**
- Admin: Verify/Reject buttons
- Database: Add columns
- Notifications: WhatsApp messages

**45 Minutes:**
- Polish UI/UX
- Add validation
- Test complete flow
- Deploy!

---

## 📊 Expected Results:

**Week 1:**
- 10-20 orders
- 90% customers upload clear screenshots
- 10% need follow-up
- Average verification time: 15 mins

**After 1 Month:**
- You'll be expert at verifying
- 5 second verification time
- Can spot fake screenshots instantly
- Process will be smooth!

---

## 🎉 Ready to Build?

Tell me:
1. Where did you save the QR code? Path?
2. Want me to start building now?
3. Any specific changes needed?

Let's do this! 🚀
