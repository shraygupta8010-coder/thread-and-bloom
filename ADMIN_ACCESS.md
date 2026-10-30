# 🔐 Thread & Bloom Admin Portal Access

## Quick Access

**Admin Portal URL**: http://localhost:3000/admin/login

**Admin Password**: `admin123`

---

## Step-by-Step Login

1. **Start Both Servers** (if not running):
   ```bash
   # Terminal 1: Start Backend
   cd d:\bedsheet\backend
   npm run dev
   # ✅ Backend running on http://localhost:5000

   # Terminal 2: Start Frontend
   cd d:\bedsheet
   npm run dev
   # ✅ Frontend running on http://localhost:3000
   ```

2. **Open Admin Portal**:
   - Go to: http://localhost:3000/admin/login
   - Enter password: `admin123`
   - Click "Access Admin Portal"

3. **You're In!** 🎉
   - Dashboard: http://localhost:3000/admin/dashboard
   - Orders: http://localhost:3000/admin/orders
   - Inventory: http://localhost:3000/admin/inventory

---

## What You Can Do

### 📊 Dashboard
- View total orders and revenue
- See pending orders count
- Monitor low stock products
- Check today's performance
- Quick access to recent orders

### 📦 Order Management
- View all customer orders
- Search by order number, name, or phone
- Filter by status (Placed, Confirmed, Shipped, Delivered, etc.)
- Update order status
- Add tracking numbers
- Print customer bills

### 📦 Inventory Control
- View all 25 products
- See current stock levels
- Quick +1/-1 buttons for stock adjustments
- Custom quantity input for specific updates
- Stock status indicators (In Stock/Low Stock/Out of Stock)

---

## Current Database Status

### Orders
- **Total Orders**: 9
- **Total Revenue**: ₹96,748
- **Pending Orders**: 6

### Products
- **Total Products**: 25
  - King Size: 17 products
  - Queen Size: 8 products
- **Low Stock**: 0 products

---

## Security

- ✅ Password-protected admin portal
- ✅ Hidden from public navigation
- ✅ Token-based authentication
- ✅ API rate limiting (80 requests per 15 min)
- ✅ Secure header authentication

---

## Troubleshooting

### Can't Login?
1. Check backend is running on port 5000
2. Verify password is exactly: `admin123` (no spaces, case-sensitive)
3. Check browser console (F12) for errors
4. Clear localStorage and try again

### Orders Not Loading?
1. Ensure backend server is running
2. Check network tab in browser dev tools
3. Verify Supabase connection in backend logs

### Stock Updates Not Working?
1. Ensure you're logged in
2. Check that product ID is correct
3. Verify backend API is responding

---

## Change Password

To change the admin password:

1. Open: `d:\bedsheet\backend\.env`
2. Find: `ADMIN_SECRET_KEY=admin123`
3. Change to your desired password
4. Restart backend server
5. Use new password to login

**Example**:
```env
ADMIN_SECRET_KEY=MySecurePassword123!
```

---

## API Endpoints

All admin APIs use the password as `x-admin-key` header.

### Login
```bash
POST http://localhost:5000/api/admin/login
Body: { "password": "admin123" }
```

### Dashboard Stats
```bash
GET http://localhost:5000/api/admin/stats
Header: x-admin-key: admin123
```

### Get All Orders
```bash
GET http://localhost:5000/api/admin/orders
Header: x-admin-key: admin123
```

### Get Order Details
```bash
GET http://localhost:5000/api/admin/orders/:orderNumber
Header: x-admin-key: admin123
```

### Update Order Status
```bash
PUT http://localhost:5000/api/admin/orders/:orderNumber/status
Header: x-admin-key: admin123
Body: { 
  "order_status": "SHIPPED",
  "tracking_number": "ABC123XYZ"
}
```

### Update Product Stock
```bash
PATCH http://localhost:5000/api/admin/products/:productId/stock
Header: x-admin-key: admin123
Body: { "stockQuantity": 50 }
```

---

## Quick Test

Test admin login from command line:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "admin123",
  "message": "Login successful"
}
```

---

## Support

If you face any issues:
1. Check both servers are running (ports 3000 and 5000)
2. Clear browser cache and localStorage
3. Restart both servers
4. Check backend logs for errors
5. Verify `.env` file has correct password

---

**🎉 Happy Managing!**

Your admin portal is fully functional and ready to use.

Password: `admin123`
URL: http://localhost:3000/admin/login
