const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CustomerPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CartItemApiPayload {
  id: string;
  productId: string;
  name: string;
  size: string;
  colorName: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  hsn?: string;
  weight_kg?: number;
  dimensions_cm?: string;
  courier_partner?: string;
  awb_number?: string;
  tracking_url?: string;
  delivery_instructions?: string;
}

export interface CodOrderResponse {
  success: boolean;
  orderNumber?: string;
  message?: string;
  order?: any;
}

export interface RazorpayOrderResponse {
  success: boolean;
  orderNumber?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  isMockGateway?: boolean;
  message?: string;
}

export interface VerifyPaymentPayload {
  orderNumber: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
}

export interface AdminOrder {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  locality?: string;
  city: string;
  state: string;
  pincode?: string;
  pin_code?: string;
  items: CartItemApiPayload[];
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  shipping_fee: number;
  total_amount: number;
  payment_method: 'COD' | 'ONLINE';
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  order_status: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
}

/**
 * Creates a Cash On Delivery order via Express API
 */
export async function createCodOrder(
  items: CartItemApiPayload[],
  customer: CustomerPayload,
  couponCode?: string | null
): Promise<CodOrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders/cod`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customer, couponCode }),
  });
  return res.json();
}

/**
 * Creates a Razorpay order via Express API
 */
export async function createRazorpayOrder(
  items: CartItemApiPayload[],
  customer: CustomerPayload,
  couponCode?: string | null
): Promise<RazorpayOrderResponse> {
  const res = await fetch(`${API_BASE}/api/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customer, couponCode }),
  });
  return res.json();
}

/**
 * Verifies Razorpay payment signature
 */
export async function verifyRazorpayPayment(payload: VerifyPaymentPayload): Promise<{
  success: boolean;
  message?: string;
  orderNumber?: string;
  paymentId?: string;
}> {
  const res = await fetch(`${API_BASE}/api/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Fetches all orders for the admin dashboard (Protected)
 */
export async function fetchAdminOrders(adminKey: string): Promise<{
  success: boolean;
  orders: AdminOrder[];
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
  });
  return res.json();
}

/**
 * Updates order and/or payment status (Protected)
 */
export async function updateOrderStatus(
  adminKey: string,
  orderNumber: string,
  updates: { order_status?: string; payment_status?: string }
): Promise<{ success: boolean; order?: AdminOrder; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(updates),
  });
  return res.json();
}

/**
 * Reverse geocodes coordinates via OpenStreetMap Nominatim backend service
 */
export async function reverseGeocodeCoordinates(lat?: number, lon?: number): Promise<{
  success: boolean;
  data?: {
    displayName: string;
    address: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  message?: string;
}> {
  const query = lat !== undefined && lon !== undefined ? `?lat=${lat}&lon=${lon}` : '';
  const res = await fetch(`${API_BASE}/api/location/locate${query}`);
  return res.json();
}
export interface UserProfilePayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface UserProfileResponse {
  success: boolean;
  user?: UserProfilePayload;
  message?: string;
}

/**
 * Upserts a user profile to the Supabase `users` table via the backend.
 * Protected by authentication & self/admin authorization.
 */
export async function saveUserProfile(profile: UserProfilePayload, token?: string | null): Promise<UserProfileResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/users/save`, {
    method: 'POST',
    headers,
    body: JSON.stringify(profile),
  });
  return res.json();
}

/**
 * Fetches a stored user profile by email from Supabase.
 * Protected: requires Authorization header matching requested patron or admin.
 */
export async function getUserProfile(email: string, token?: string | null): Promise<UserProfileResponse> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}`, { headers });
  return res.json();
}

/**
 * Fetches the currently authenticated patron profile using their session Bearer token
 */
export async function getCurrentUserProfile(token: string): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export interface SearchPlaceItem {
  displayName: string;
  shortName: string;
  lat: number;
  lon: number;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

/**
 * Searches for societies, landmarks, streets, and areas in India
 */
export async function searchLocations(query: string): Promise<{
  success: boolean;
  results: SearchPlaceItem[];
  message?: string;
}> {
  if (!query || query.trim().length < 2) return { success: true, results: [] };
  const res = await fetch(`${API_BASE}/api/location/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

/**
 * Fetches district and state details for any 6-digit Indian PIN code
 */
export async function fetchPincodeDetails(pincode: string): Promise<{
  success: boolean;
  data?: {
    pincode: string;
    district: string;
    state: string;
    division?: string;
    postOffices: string[];
  };
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/location/pincode/${pincode}`);
  return res.json();
}
export interface DeliveryManifest {
  orderNumber: string;
  orderDate: string;
  channel: string;
  shipper: {
    companyName: string;
    facility: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string;
    phone: string;
    email: string;
  };
  consignee: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    deliveryInstructions?: string;
  };
  logistics: {
    courierPartner: string;
    awbNumber: string;
    trackingUrl: string;
    packageType: string;
    packageCount: number;
    deadWeightKg: number;
    volumetricWeightKg: number;
    dimensionsCm: string;
    pickupScheduled: string;
  };
  financials: {
    paymentMethod: 'COD' | 'ONLINE';
    paymentStatus: string;
    codAmountToCollect: number;
    currency: string;
    subtotal: number;
    discountAmount: number;
    couponCode?: string | null;
    shippingFee: number;
    totalAmount: number;
  };
  taxInvoice: {
    invoiceNumber: string;
    hsnCode: string;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalGst: number;
  };
  items: Array<{
    srNo: number;
    sku: string;
    hsn: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

/**
 * Fetches the standardized 3PL delivery partner manifest and tax invoice
 */
export async function fetchOrderManifest(
  adminKey: string,
  orderNumber: string
): Promise<{ success: boolean; manifest?: DeliveryManifest; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}/manifest`, {
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

/**
 * Dispatches an order with a selected 3PL courier partner and generates/assigns an AWB tracking number
 */
export async function dispatchOrderWithCourier(
  adminKey: string,
  orderNumber: string,
  payload: { courier_partner?: string; awb_number?: string; tracking_url?: string }
): Promise<{ success: boolean; message?: string; dispatch?: any }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderNumber}/dispatch`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Seeds or resets the 5 sample orders with rich 3PL delivery logistics metadata
 */
export async function seedSampleOrdersApi(adminKey: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/seed`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
  });
  return res.json();
}

export interface ProductItem {
  id: string;
  name: string;
  collection: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  unitsSold: number;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];
  sizePrices: Record<string, number>;
  description: string;
  badge?: string;
  sku: string;
  hsn: string;
  weight_kg: number;
  dimensions_cm: string;
  collectionTier?: 'ATELIER' | 'ELITE' | 'ROYAL' | 'FESTIVE';
  series?: string;
  pieces?: number;
  brand?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalStockUnits: number;
  totalUnitsSold: number;
  totalValuation: number;
  totalSalesRevenue: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockProducts: ProductItem[];
  outOfStockProducts: ProductItem[];
  categories: Record<string, { count: number; stock: number; sold: number }>;
}

/**
 * Public: Fetch catalog products with optional category, search, and brand filters
 */
export async function fetchProducts(
  category?: string,
  search?: string,
  brand?: string
): Promise<{ success: boolean; products: ProductItem[]; count?: number }> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (search) params.set('search', search);
  if (brand) params.set('brand', brand);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/api/products${query}`);
  return res.json();
}

/**
 * Public: Fetch a single product by ID or SKU
 */
export async function fetchProductById(
  id: string
): Promise<{ success: boolean; product?: ProductItem; message?: string }> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  return res.json();
}

/**
 * Admin: Create a new product and publish to storefront
 */
export async function createProductApi(
  adminKey: string,
  payload: Partial<ProductItem>
): Promise<{ success: boolean; product?: ProductItem; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Admin: Update an existing product
 */
export async function updateProductApi(
  adminKey: string,
  id: string,
  payload: Partial<ProductItem>
): Promise<{ success: boolean; product?: ProductItem; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Admin: Quick adjust stock quantity
 */
export async function quickUpdateStockApi(
  adminKey: string,
  id: string,
  payload: { stockQuantity?: number; delta?: number }
): Promise<{ success: boolean; stockQuantity?: number; inStock?: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Admin: Delete a product
 */
export async function deleteProductApi(
  adminKey: string,
  id: string
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-key': adminKey,
    },
  });
  return res.json();
}

/**
 * Admin: Fetch inventory statistics and valuation
 */
export async function fetchInventoryStats(
  adminKey: string
): Promise<{ success: boolean; stats?: InventoryStats; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/inventory/stats`, {
    headers: {
      'x-admin-key': adminKey,
    },
  });
  return res.json();
}

export interface AdminPatron {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  registeredAt?: string;
  source: string;
  orders: Array<{
    orderNumber: string;
    amount: number;
    status: string;
    date: string;
    items: Array<{ name: string; size: string; quantity: number }>;
  }>;
}

/**
 * Admin: Fetch full patron directory from Supabase users & orders tables
 */
export async function fetchAdminPatrons(
  adminKey: string
): Promise<{ success: boolean; patrons: AdminPatron[]; count?: number; message?: string }> {
  const res = await fetch(`${API_BASE}/api/admin/patrons`, {
    headers: {
      'x-admin-key': adminKey,
    },
  });
  return res.json();
}


// ── Auth API ─────────────────────────────────────────────────────────────────

export interface SignupPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  password: string;
}

export interface GoogleAuthPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  avatarUrl?: string;
  credential?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfilePayload;
  profile?: UserProfilePayload;
  isNewUser?: boolean;
}


export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  /** wa.me deep-link with OTP pre-filled — open this to prompt WhatsApp send */
  whatsappUrl?: string;
  /** OTP code echoed back for dev convenience / auto-fill */
  code?: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  code: string;
  newPassword: string;
}

/** Register a new user account with password */
export async function signupApi(data: SignupPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

/** Login with email or phone number + password */
export async function loginApi(
  identifier: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  return res.json();
}

/** Authenticate or register with Google / Gmail */
export async function googleAuthApi(data: GoogleAuthPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/users/google-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

/** Request OTP sent to user's WhatsApp. Returns a whatsappUrl deep-link. */
export async function forgotPasswordApi(
  identifier: string
): Promise<ForgotPasswordResponse> {
  const res = await fetch(`${API_BASE}/api/users/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  return res.json();
}

/** Verify OTP code and set a new password */
export async function resetPasswordApi(
  payload: ResetPasswordPayload
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/users/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  file?: {
    filename: string;
    url: string;
    supabaseUrl?: string | null;
    detectedFormat: string;
    size: number;
  };
}

/**
 * Securely uploads an image with OWASP magic-byte verification and malware screening
 */
export async function uploadImageApi(
  file: File,
  auth: { token?: string | null; adminKey?: string | null }
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const headers: Record<string, string> = {};
  if (auth.adminKey) {
    headers['x-admin-key'] = auth.adminKey;
  }
  if (auth.token) {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return res.json();
}

