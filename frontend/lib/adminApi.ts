const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  items: any[];
  subtotal: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_number?: string;
  shiprocket_order_id?: number;
  shiprocket_shipment_id?: number;
  awb_code?: string;
  tracking_status?: string;
  courier_name?: string;
  estimated_delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingInfo {
  orderNumber: string;
  shiprocketOrderId?: number;
  shiprocketShipmentId?: number;
  awbCode?: string;
  trackingStatus: string;
  courierName?: string;
  estimatedDeliveryDate?: string;
  trackingUrl?: string;
}

/**
 * Admin login
 */
export async function adminLogin(password: string): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.json();
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(adminKey: string): Promise<{
  success: boolean;
  stats?: DashboardStats;
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/stats`, {
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

/**
 * Get all orders
 */
export async function getAllOrders(adminKey: string): Promise<{
  success: boolean;
  orders?: Order[];
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/orders`, {
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

/**
 * Get single order
 */
export async function getOrderById(adminKey: string, orderNumber: string): Promise<{
  success: boolean;
  order?: Order;
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}`, {
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  adminKey: string,
  orderNumber: string,
  data: { order_status: string; tracking_number?: string }
): Promise<{
  success: boolean;
  order?: Order;
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Update product stock
 */
export async function updateProductStock(
  adminKey: string,
  productId: string,
  stockQuantity: number
): Promise<{
  success: boolean;
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/products/${productId}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ stockQuantity }),
  });
  return res.json();
}

/**
 * Get order tracking details from Shiprocket
 */
export async function getOrderTracking(
  adminKey: string,
  orderNumber: string
): Promise<{
  success: boolean;
  tracking?: TrackingInfo;
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}/tracking`, {
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

/**
 * Manually ship an order via Shiprocket
 */
export async function manualShipOrder(
  adminKey: string,
  orderNumber: string
): Promise<{
  success: boolean;
  tracking?: {
    shiprocketOrderId: number;
    shiprocketShipmentId: number;
    awbCode?: string;
  };
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}/ship`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

