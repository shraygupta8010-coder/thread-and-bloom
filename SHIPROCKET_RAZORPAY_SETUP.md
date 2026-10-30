# Shiprocket + Razorpay Complete Setup Guide
## Thread & Bloom - Shipping Integration

---

## PHASE 1: Create Shiprocket Account (15 mins)

### STEP 1: Sign Up on Shiprocket

**Go to:** https://app.shiprocket.in/seller/register

**Fill Form:**
```
╔════════════════════════════════════════╗
║  SHIPROCKET REGISTRATION               ║
╠════════════════════════════════════════╣
║                                        ║
║  Full Name: Shray Gupta               ║
║                                        ║
║  Email: threadandbloomsupport@gmail.com║
║                                        ║
║  Mobile: 9213145056                    ║
║                                        ║
║  Password: [Create strong password]    ║
║                                        ║
║  Company Name: Thread & Bloom          ║
║                                        ║
║  [ ] I agree to T&C                    ║
║                                        ║
║       [Sign Up & Start Shipping]       ║
║                                        ║
╚════════════════════════════════════════╝
```

**After Signup:**
- Verify Email (check inbox)
- Verify Mobile (OTP)
- Login to Dashboard

---

### STEP 2: Choose Shiprocket LITE Plan (FREE)

**After Login:**
```
1. Dashboard will show plan options
2. Select: "Shiprocket LITE" (Free Plan)
3. Features:
   ✅ Unlimited shipments
   ✅ All courier partners
   ✅ Rate calculator
   ✅ Tracking
   ✅ COD available
   ✅ API access
   ✅ No monthly fee
   
   Rate: Standard rates (no volume discount)
   
4. Click: "Continue with LITE"
```

---

### STEP 3: Complete KYC (Very Important!)

**Documents Needed:**

1. **PAN Card** (Mandatory)
   ```
   - Upload clear photo
   - Name should match registration
   ```

2. **Aadhar Card** (Mandatory)
   ```
   - Upload front + back
   - Address will be pickup address
   ```

3. **Bank Account Details** (For COD)
   ```
   Account Holder: Shray Gupta
   Account Number: [Your account]
   IFSC Code: [Your bank IFSC]
   Bank Name: [Your bank]
   Branch: [Your branch]
   Account Type: Savings/Current
   ```

4. **Cancelled Cheque or Bank Statement**
   ```
   - Upload photo showing:
     - Account number
     - IFSC code
     - Your name
   ```

5. **GSTIN** (Optional - Skip if not registered)
   ```
   If you have: Enter 15-digit GSTIN
   If not: Click "I don't have GSTIN" (allowed!)
   ```

6. **Pickup Address**
   ```
   Business Name: Thread & Bloom
   Contact Person: Shray Gupta
   Phone: 9213145056
   Address: Flat 419, Dhruva Apartments
   Landmark: No. 4, Sadbhavana Road
   Area: Trilok Puri
   City: Delhi
   State: Delhi
   PIN: 110092
   ```

**Submit KYC:**
- Click "Submit for Verification"
- Approval Time: 24-48 hours
- You'll get email confirmation

---

### STEP 4: Add Wallet Balance (Optional but Recommended)

**Minimum Recharge: ₹1,000**

```
1. Go to: Wallet → Add Balance
2. Amount: ₹1,000 (start small)
3. Payment: UPI/Card/Net Banking
4. This balance will be used for shipping
```

**Why Recharge:**
- Prepaid wallet = instant shipping
- No waiting for payment clearance
- Faster order processing

**Pro Tip:** Start with ₹1,000, see how many orders it covers, then recharge as needed.

---

## PHASE 2: Connect Shiprocket to Razorpay (10 mins)

### STEP 5: Enable Shiprocket in Razorpay Payment Page

**Go Back to Razorpay:**
1. Open your Payment Page settings
2. Scroll to: "Plugins and Add-ons"
3. Find: "Create orders on Shiprocket" (NEW badge)
4. Click: **"Enable"**

**Authorization Screen Will Appear:**

```
╔════════════════════════════════════════╗
║  Connect Shiprocket to Razorpay        ║
╠════════════════════════════════════════╣
║                                        ║
║  Shiprocket Email:                     ║
║  threadandbloomsupport@gmail.com       ║
║                                        ║
║  Shiprocket Password:                  ║
║  [Your Shiprocket password]            ║
║                                        ║
║  [ ] I authorize Razorpay to create    ║
║      orders on Shiprocket              ║
║                                        ║
║       [Connect]        [Cancel]        ║
║                                        ║
╚════════════════════════════════════════╝
```

**Fill:**
- Email: Same as Shiprocket account
- Password: Your Shiprocket password
- Check the authorization box
- Click: **"Connect"**

**Success Message:**
```
✅ Shiprocket connected successfully!
   Orders will now automatically sync.
```

---

### STEP 6: Configure Shiprocket Channel in Razorpay

**After Connecting:**
```
Razorpay will ask:
"Add Razorpay Payment Pages as channel in Shiprocket?"

Click: "Yes, Add Channel"
```

**What This Does:**
- Creates "Razorpay" channel in Shiprocket
- All Razorpay orders will tag under this channel
- Easy tracking and reporting

---

### STEP 7: Setup Shiprocket Dashboard (In Shiprocket)

**Login to Shiprocket Dashboard**

1. **Add Razorpay as Channel:**
   ```
   Go to: Settings → Channels
   You'll see: "Razorpay Payment Pages" (auto-added)
   Status: Active ✅
   ```

2. **Configure Order Settings:**
   ```
   Go to: Settings → Order Settings
   
   ✅ Auto-assign courier: ON
   ✅ Auto-pickup: ON (daily pickup at 6 PM)
   ✅ Customer notifications: ON
   ✅ Weight: 2.5 kg (default for bedsheets)
   ✅ Dimensions: 40cm × 30cm × 10cm
   ✅ Fragile: NO
   ✅ Value declaration: Automatic from order
   ```

3. **Setup Return Address (Same as Pickup):**
   ```
   Go to: Settings → Addresses
   
   Add Return Address:
   Name: Thread & Bloom
   Phone: 9213145056
   Address: Flat 419, Dhruva Apartments
   City: Delhi, 110092
   ```

4. **Enable Courier Partners:**
   ```
   Go to: Settings → Courier Partners
   
   Enable (Recommended for Delhi):
   ✅ Delhivery (best for Delhi)
   ✅ Bluedart (fastest)
   ✅ DTDC (economical)
   ✅ Ecom Express (good for COD)
   ✅ Xpressbees (backup)
   ```

---

## PHASE 3: Test the Integration (5 mins)

### STEP 8: Create Test Order

**In Razorpay Payment Page:**
```
1. Open your payment page
2. Enter test details:
   Amount: ₹100
   Email: test@test.com
   Phone: 9999999999
3. Make test payment (₹100 will be charged)
4. Payment successful!
```

**Check in Shiprocket:**
```
1. Login to Shiprocket Dashboard
2. Go to: Orders → All Orders
3. You should see the order appear automatically! ✨
4. Status: "New Order"
5. Channel: "Razorpay Payment Pages"
```

**If Order Appears:** ✅ Integration Working!
**If Not:** ⚠️ Check connection, retry

---

## PHASE 4: Ship Your First Order

### STEP 9: Process Order in Shiprocket

**When Real Order Comes:**

1. **Order Auto-Creates in Shiprocket** ✨
   ```
   - Order Number: From Razorpay
   - Customer Details: Auto-filled
   - Amount: Auto-filled
   - Address: Auto-filled
   - Channel: Razorpay
   ```

2. **Review Order Details:**
   ```
   Go to: Orders → New Orders
   Click on order
   
   Verify:
   ✅ Customer name correct
   ✅ Phone correct
   ✅ Address complete (no missing PIN)
   ✅ Amount correct
   ✅ Items correct
   ```

3. **Add Product Details (First Time Only):**
   ```
   Click: Edit Order
   
   Add Product:
   Name: King Size Bedsheet
   SKU: KB-001
   HSN: 6302
   Category: Bedsheets
   Weight: 2.5 kg
   Dimensions: 40×30×10 cm
   Price: [Order amount]
   Quantity: 1
   
   Click: Save
   ```

4. **Process Shipment:**
   ```
   Click: "Ready to Ship"
   
   Select Courier:
   - Shiprocket shows best rates
   - Recommended courier highlighted
   - Choose based on:
     ✅ Price
     ✅ Delivery time
     ✅ Serviceability
   
   Click: "Generate AWB & Ship"
   ```

5. **AWB Generated!** 🎉
   ```
   AWB Number: 1234567890 (tracking number)
   Courier: Delhivery
   Expected Delivery: 5-7 days
   ```

6. **Schedule Pickup:**
   ```
   Pickup scheduled automatically for today 6 PM
   Or click "Schedule Pickup" manually
   
   Pickup Address: Your saved address
   Pickup Time: Select slot
   
   Courier boy will come to pickup!
   ```

7. **Print Shipping Label:**
   ```
   Click: "Print Label"
   Download PDF
   Print on A4 paper
   Stick on package
   Done!
   ```

---

## PHASE 5: Tracking & Updates

### STEP 10: Customer Tracking

**Automatic Tracking:**
```
✅ Customer gets SMS with tracking link
✅ WhatsApp updates (if enabled)
✅ Email updates
✅ Real-time status on website
```

**Tracking Statuses:**
```
1. Order Placed
2. Pickup Scheduled
3. Picked Up
4. In Transit
5. Out for Delivery
6. Delivered ✅

(or)

6. RTO - Return to Origin (if failed)
```

### STEP 11: Monitor in Admin Panel

**Your Admin Panel Will Show:**
```
Order #TB-123456
Status: Shipped
Courier: Delhivery
AWB: 1234567890
Tracking: [Live Link]
Expected: 2 days
```

---

## 🎯 AUTOMATION SETUP (I'll Code This)

### What I'll Build in Your Website:

```typescript
// Automatic Flow:

1. Customer places order on website
   ↓
2. Order saved in Supabase database
   ↓
3. Payment made via Razorpay
   ↓
4. Webhook received (payment success)
   ↓
5. Order auto-creates in Shiprocket ✨
   ↓
6. Shiprocket assigns best courier
   ↓
7. AWB generated automatically
   ↓
8. Tracking link sent to customer (WhatsApp + Email)
   ↓
9. Admin panel shows tracking
   ↓
10. Pickup scheduled
   ↓
11. Courier picks up
   ↓
12. Delivery happens
   ↓
13. COD remitted to bank (3-4 days)
   ↓
DONE! Zero manual work! 🎉
```

---

## 💰 Cost Breakdown

### Shiprocket LITE Plan:
```
Monthly Fee: ₹0 (FREE!)
Per Shipment: Standard rates

Example for Bedsheets (2.5 kg):
- Delhi to Delhi: ₹45-50
- Delhi to Mumbai: ₹65-70
- Delhi to Bangalore: ₹75-80
- Delhi to Northeast: ₹95-100

COD Charges: +₹15 per order
Pickup: Free
Weight Reconciliation: Auto-handled
Insurance: ₹5 (optional)

Average: ₹70 per order (all India)
```

### Sample Monthly Cost:
```
10 orders × ₹70 = ₹700
50 orders × ₹70 = ₹3,500
100 orders × ₹70 = ₹7,000

(Rates reduce with volume - negotiate after 50+ orders)
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Order Not Auto-Creating
```
Solution:
1. Check Shiprocket-Razorpay connection
2. Re-authorize if needed
3. Check "Razorpay" channel is active
4. Contact Razorpay support
```

### Issue 2: Pickup Not Scheduled
```
Solution:
1. Check pickup address saved
2. Check wallet balance (>₹500)
3. Schedule manually if auto-pickup fails
4. Call Shiprocket support: 1800-120-1800
```

### Issue 3: Wrong Weight Charged
```
Solution:
1. Set default weight in settings (2.5 kg)
2. Dispute wrong weight charges
3. Shiprocket will refund difference
```

### Issue 4: RTO (Return to Origin)
```
Solution:
1. Call customer before RTO
2. Update address if wrong
3. Re-attempt delivery
4. NDR management in Shiprocket
```

---

## 📱 Shiprocket Mobile App

**Download:** "Shiprocket - Shipping App"

**Features:**
- ✅ View orders on mobile
- ✅ Schedule pickups
- ✅ Track shipments
- ✅ Print labels from phone
- ✅ Customer support chat
- ✅ Real-time notifications

**Highly Recommended!** Install karke rakho.

---

## 🎯 FINAL CHECKLIST

### Before Going Live:

```
□ Shiprocket account created
□ KYC approved (24-48 hrs wait)
□ LITE plan selected (FREE)
□ Wallet recharged (₹1,000 minimum)
□ Razorpay-Shiprocket connected
□ Test order successful
□ Pickup address verified
□ Return address added
□ Courier partners enabled
□ Default weight set (2.5 kg)
□ Mobile app installed
□ Shipping labels printed (test)
```

---

## 🚀 NEXT STEPS (After KYC Approval):

1. **Enable Integration** (in Razorpay screenshot)
2. **Wait for KYC approval** (24-48 hrs)
3. **Test with ₹100 order**
4. **Ship your first real order!**
5. **I'll add automation code** (Shiprocket API)
6. **Start scaling!**

---

## 💡 PRO TIPS

### Tip 1: Package Well
```
- Use good quality boxes
- Bubble wrap for protection
- Clear address label
- Invoice inside package
- Branded packaging (when scaling)
```

### Tip 2: Schedule Pickups
```
- Daily pickup at fixed time (6 PM)
- Batch multiple orders
- Keep packages ready
- Courier prefers bulk pickups
```

### Tip 3: Reduce RTO
```
- Verify phone numbers
- Call customer before dispatch
- Send tracking link immediately
- Enable Shiprocket NDR management
- Update address if customer calls
```

### Tip 4: COD Management
```
- Enable auto-remittance
- Check remittance reports weekly
- Reconcile with orders
- Report discrepancies immediately
```

### Tip 5: Volume Discounts
```
- After 50 orders, email Shiprocket
- Request custom rates
- Negotiate 10-20% discount
- Lock yearly contract for best rates
```

---

## 📞 Support Contacts

### Shiprocket:
- Phone: 1800-120-1800 (24×7)
- Email: care@shiprocket.in
- Chat: In-app support
- Help Docs: https://support.shiprocket.in

### Razorpay:
- Phone: 022-6114-6666
- Email: support@razorpay.com
- Chat: Dashboard chat
- Help: https://razorpay.com/support

---

## ✅ YOU'RE ALL SET!

**Shiprocket + Razorpay integration will save you HOURS of manual work!**

Every order automatically:
1. Creates in Shiprocket ✨
2. Generates AWB
3. Schedules pickup
4. Sends tracking
5. Updates status
6. Remits COD

**ZERO MANUAL WORK!** Just pack and hand over to courier! 🎉

---

**Questions? Let me know! 🚀**
