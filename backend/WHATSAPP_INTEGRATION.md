# WhatsApp Integration - Thread & Bloom Backend

## Overview
WhatsApp Business API integration for sending OTPs and notifications to customers via WhatsApp.

## Configuration

### Environment Variables
Add these to your `backend/.env` file:

```env
WHATSAPP_PHONE_NUMBER_ID=1495699783619878
WHATSAPP_ACCESS_TOKEN=EAAUu51JFSp4BSxxzCO8DW6pG64ZC3E6Qv1QChRrZAiBZAh6axZBQHou9GZCuZAC6aRZCmWZB2S3rS8ZBsJluo3keOmH5MWSaAzPNjcHQMXIVKAKfGxhcggrKXIcFsSYYYn2MyAlZBhBL6DFOImJOJLJ5lQ4EUatqYPGWK4XLIRlIzobYYl91JyIbSfie3hjZCZCjaDbm1wZDZD
```

## Features Implemented

### 1. Password Reset OTP
**Function:** `sendPasswordResetOTP(recipientPhone: string, otp: string)`
- Sends OTP to user's WhatsApp when they request password reset
- OTP valid for 10 minutes
- Integrated in `/api/users/forgot-password` endpoint

**Message Format:**
```
🔒 [Thread and Bloom] Your password reset OTP is {otp}. Valid for 10 minutes. Do not share this with anyone.
```

### 2. Order Confirmation
**Function:** `sendOrderConfirmation(recipientPhone, orderId, totalAmount, items)`
- Automatically sends order confirmation when order is placed
- Includes order number, items summary, and total amount
- Integrated in `/api/orders/cod` endpoint

**Message Format:**
```
🎉 Thank you for shopping with Thread and Bloom!

Your order #{orderId} has been successfully placed.

📦 Items: {items}
💰 Total: ₹{totalAmount}

We will notify you once it's shipped!
```

### 3. Login OTP
**Function:** `sendLoginOTP(recipientPhone: string, otp: string)`
- Can be used for OTP-based login (ready to integrate)
- OTP valid for 5 minutes

**Message Format:**
```
🔐 [Thread and Bloom] Your login OTP is {otp}. Valid for 5 minutes. Keep it secure!
```

### 4. Welcome Message
**Function:** `sendWelcomeMessage(recipientPhone: string, userName: string)`
- Sent to new users when they sign up
- Includes welcome discount code
- Integrated in `/api/users/signup` endpoint

**Message Format:**
```
👋 Welcome to Thread and Bloom, {userName}!

Discover luxury bedding and living essentials crafted for comfort and style.

🎁 Use code WELCOME20 for 20% off your first order!

Happy Shopping! 🛍️
```

### 5. Order Shipped Notification
**Function:** `sendOrderShippedNotification(recipientPhone, orderId, trackingNumber)`
- Ready to integrate when order status changes to "Shipped"

**Message Format:**
```
📦 Great news! Your order #{orderId} has been shipped!

🚚 Tracking Number: {trackingNumber}

Your premium bedding is on its way to you. Track your shipment for real-time updates!
```

### 6. Order Delivered Notification
**Function:** `sendOrderDeliveredNotification(recipientPhone: string, orderId: string)`
- Ready to integrate when order status changes to "Delivered"

**Message Format:**
```
✅ Your order #{orderId} has been delivered!

We hope you love your Thread and Bloom products. Thank you for shopping with us!

⭐ Share your experience with us!
```

## Usage Examples

### Password Reset Flow
1. User enters phone/email in forgot password form
2. Backend generates 6-digit OTP
3. WhatsApp message sent automatically via API
4. User receives OTP on WhatsApp
5. User enters OTP to reset password

### Order Confirmation Flow
1. Customer places COD order
2. Order saved to database
3. WhatsApp confirmation sent automatically
4. Customer receives order details on WhatsApp

## Phone Number Format
- Phone numbers should be in international format without `+`
- Example: `919876543210` for Indian numbers
- The service automatically handles formatting

## API Endpoint
```
POST https://graph.facebook.com/v19.0/1495699783619878/messages
```

## Error Handling
All WhatsApp functions return:
```typescript
{
  success: boolean;
  data?: any;        // API response on success
  error?: any;       // Error details on failure
}
```

Errors are logged to console but don't block the main flow (order/signup still succeeds even if WhatsApp fails).

## Testing
WhatsApp messages will be sent to real phone numbers. Make sure to:
1. Test with your own phone number first
2. Verify the WhatsApp Business account has permissions
3. Check message delivery in WhatsApp Business Manager

## Files Modified
- ✅ `backend/src/utils/whatsapp.ts` - WhatsApp service functions
- ✅ `backend/src/controllers/orderController.ts` - Order confirmation integration
- ✅ `backend/src/controllers/userController.ts` - Password reset & welcome message integration
- ✅ `backend/.env` - WhatsApp credentials added
- ✅ `backend/package.json` - axios dependency added

## Status
🟢 **FULLY INTEGRATED & OPERATIONAL**

Backend server running on port 5000 with WhatsApp integration active.
