# Thread & Bloom Admin Portal Guide

## 🔐 Access

**Admin Portal URL**: http://localhost:3000/admin/login

**Password**: `ThreadAndBloom@2026`

The admin portal is password-protected and hidden from public navigation.

---

## 📊 Dashboard

**URL**: `/admin/dashboard`

### Features:
- **Total Orders**: Count of all orders placed
- **Pending Orders**: Orders in PLACED or CONFIRMED status
- **Total Revenue**: Sum of all order amounts (₹)
- **Low Stock Products**: Products with stock ≤ 10 units
- **Today's Stats**: Orders and revenue for current day
- **Recent Orders List**: Latest 5 orders with quick view
- **Quick Actions**: Navigate to Orders or Inventory management

---

## 📦 Order Management

**URL**: `/admin/orders`

### Features:
1. **View All Orders**
   - See complete order history
   - Order number, customer name, amount, status, date
   
2. **Search Orders**
   - Search by order number or customer name
   
3. **Filter by Status**
   - All Orders
   - Placed
   - Confirmed
   - Shipped
   - Delivered
   - Cancelled

4. **Order Details** (Click any order)
   - Full customer information
   - Shipping address
   - Order items with images
   - Pricing breakdown
   - Payment information
   - **Update Order Status**
   - **Add Tracking Number**
   - **Print Bill** (formatted invoice)

### Order Status Workflow:
```
PLACED → CONFIRMED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                         ↓
                    CANCELLED / RETURNED
```

---

## 📦 Inventory Management

**URL**: `/admin/inventory`

### Features:
1. **View All Products**
   - Product grid with images
   - Current stock levels
   - Stock status badges (In Stock / Low Stock / Out of Stock)

2. **Update Stock**
   - **Quick +1/-1 buttons** for fast adjustments
   - **Custom input** for specific quantities
   - Updates reflect immediately

3. **Stock Status Indicators**:
   - 🟢 **In Stock**: > 10 units
   - 🟡 **Low Stock**: 1-10 units  
   - 🔴 **Out of Stock**: 0 units

---

## 🔧 API Endpoints

All admin APIs require the `x-admin-key` header with value `ThreadAndBloom@2026`

### Authentication
```
POST /api/admin/login
Body: { "password": "ThreadAndBloom@2026" }
Response: { "success": true, "token": "..." }
```

### Dashboard Stats
```
GET /api/admin/stats
Headers: { "x-admin-key": "ThreadAndBloom@2026" }
```

### Orders
```
GET /api/admin/orders
GET /api/admin/orders/:orderNumber
PUT /api/admin/orders/:orderNumber/status
Body: { "order_status": "SHIPPED", "tracking_number": "ABC123" }
```

### Inventory
```
PATCH /api/admin/products/:id/stock
Body: { "quantity": 5 }
```

---

## 📋 Current Status

### Database Summary:
- **Total Orders**: 9
- **Total Revenue**: ₹96,748
- **Pending Orders**: 6
- **Products**: 25 (17 King, 8 Queen)

### Test Data:
You already have real orders from testing:
- Customer: shray gupta
- Email: shraygupta8010@gmail.com
- Multiple orders placed with UPI payment

---

## 🚀 How to Use

### 1. Login
1. Go to http://localhost:3000/admin/login
2. Enter password: `ThreadAndBloom@2026`
3. Click "Sign In"

### 2. View Dashboard
- See overview of orders and inventory
- Check today's performance
- Review recent orders

### 3. Manage Orders
1. Click "View All Orders" or use sidebar navigation
2. Search or filter orders as needed
3. Click any order to see full details
4. Update status and add tracking number
5. Print bill for customer records

### 4. Update Inventory
1. Navigate to "Inventory"
2. Find the product you want to update
3. Use +/- buttons for quick adjustments
4. Or enter exact quantity and click "Update"
5. Changes save automatically

---

## 🔒 Security Notes

1. **Password Protection**: Admin portal requires password login
2. **Token Storage**: Admin token stored in localStorage
3. **API Authentication**: All admin APIs require `x-admin-key` header
4. **Hidden Access**: No links to admin portal in public navigation
5. **Rate Limiting**: 80 requests per 15 minutes per IP

---

## 📱 Future Enhancements

### Planned Features:
1. **Photo Upload for Inventory**
   - Add/replace product images
   - Bulk upload capability

2. **Delivery Integration**
   - Delhivery API integration
   - Shiprocket API integration  
   - Automatic tracking updates
   - Real-time delivery status

3. **Analytics**
   - Sales charts and graphs
   - Product performance metrics
   - Customer insights
   - Revenue trends

4. **Order Management**
   - Bulk order processing
   - Export orders to CSV
   - Print shipping labels
   - Send order updates via WhatsApp

5. **Notifications**
   - WhatsApp alerts for new orders
   - Low stock warnings
   - Daily sales summary

---

## 🛠️ Technical Details

### Frontend Stack:
- Next.js 16.4.0
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend Stack:
- Express.js
- TypeScript
- Supabase (PostgreSQL)
- Node.js

### Authentication:
- Simple password-based (development)
- Token stored in localStorage
- Header-based API authentication

### Caching:
- **Disabled** for development (0ms TTL)
- Products always fetch fresh data
- No stale data issues

---

## 💡 Tips

1. **Search is Fast**: Use search to quickly find orders
2. **Status Filters**: Use status filters to focus on pending orders
3. **Print Bills**: Print bills directly from order details
4. **Stock Updates**: Use +/- buttons for speed, custom input for precision
5. **Refresh Data**: Navigate between pages to see latest data

---

## 🐛 Troubleshooting

### Can't Login?
- Check password: `ThreadAndBloom@2026`
- Ensure backend is running on port 5000
- Check browser console for errors

### Orders Not Showing?
- Verify backend server is running
- Check database connection in backend logs
- Try refreshing the page

### Stock Updates Not Working?
- Ensure you're logged in
- Check network tab for API errors
- Verify product ID is correct

---

## 📞 Support

For any issues or feature requests, contact the development team.

**Happy Managing! 🎉**
