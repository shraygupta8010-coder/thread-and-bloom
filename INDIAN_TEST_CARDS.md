# 🇮🇳 Indian Test Cards for Razorpay

## ✅ **USE THESE CARDS (Working Now!)**

Your Razorpay account has **international cards disabled**. Use Indian test cards instead:

---

## 💳 **Indian Test Cards**

### Card 1: Indian Debit Card (SUCCESS) ✅
```
Card Number:  5267 3181 8797 5449
CVV:          123
Expiry:       12/28 (any future date)
Cardholder:   Test User
Network:      Mastercard
```

### Card 2: RuPay Card (SUCCESS) ✅
```
Card Number:  6521 5966 5820 6333
CVV:          123
Expiry:       12/28
Cardholder:   Test User
Network:      RuPay
```

### Card 3: Another Indian Card (SUCCESS) ✅
```
Card Number:  4539 1488 0343 6467
CVV:          123
Expiry:       12/28
Cardholder:   Test User
Network:      VISA (India)
```

---

## ❌ **Don't Use These (International Cards)**

These will fail with "International cards not supported":
```
4111 1111 1111 1111  (US VISA)
5555 5555 5555 4444  (International Mastercard)
```

---

## 🎯 **How to Test:**

1. Website pe jao: http://localhost:3000
2. Product cart mein dalo
3. Checkout karo
4. Payment method: **Card**
5. Razorpay modal opens
6. **Indian test card use karo:**
   ```
   5267 3181 8797 5449
   CVV: 123
   Expiry: 12/28
   ```
7. Click "Pay"
8. Success! ✅

---

## 🔐 **OTP for 3D Secure (if asked):**
```
OTP: 123456
```

---

## 📱 **Alternative: Test UPI (Easiest!)**

If you don't want to deal with cards, use **UPI**:

1. Select "UPI" in payment modal
2. Enter test UPI ID:
   ```
   success@razorpay
   ```
3. Auto-success! ✅

**Failed UPI (for testing):**
```
failure@razorpay
```

---

## 🏦 **Net Banking Option:**

1. Select "Net Banking"
2. Choose any bank (HDFC, ICICI, SBI, etc.)
3. Test page opens
4. Click **"Success"** button
5. Payment completes! ✅

---

## ⚙️ **To Enable International Cards (Optional):**

If you want to accept international cards:

1. Login: https://dashboard.razorpay.com
2. Go to: **Settings → Payment Methods**
3. Find: **Cards** section
4. Toggle: **"Accept International Cards"** → ON
5. Save changes
6. Now `4111 1111 1111 1111` will work

**Note:** You might need to provide additional documentation for international card acceptance.

---

## ✅ **Recommended Testing Flow:**

### Test 1: Indian Card
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/28
→ SUCCESS ✅
```

### Test 2: UPI
```
UPI: success@razorpay
→ SUCCESS ✅
```

### Test 3: Net Banking
```
Bank: HDFC Bank
→ Click Success button
→ SUCCESS ✅
```

### Test 4: COD (Cash on Delivery)
```
Select COD
→ No payment gateway
→ Direct order success ✅
```

---

## 🐛 **Troubleshooting:**

### Error: "International cards not supported"
**Solution:** Use Indian test cards above ☝️

### Error: "Card not supported"
**Solution:** Try different Indian test card or use UPI

### Error: "Payment failed"
**Solution:** 
- Check card number entered correctly
- Try UPI instead: `success@razorpay`
- Check if both servers running

---

## 🎉 **TL;DR - QUICK TEST:**

**Sabse easy:** UPI use karo!
```
1. Payment modal opens
2. Click "UPI"
3. Enter: success@razorpay
4. Done! ✅
```

**Card chahiye to:**
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/28
→ Works perfectly! ✅
```

---

**Ab jaake test karo with Indian cards!** 🇮🇳💳

Happy testing! 🚀
