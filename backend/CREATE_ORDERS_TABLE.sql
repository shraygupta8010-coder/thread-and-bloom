-- Create orders table if it doesn't exist
-- This table stores all customer orders

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  
  -- Customer information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping address
  shipping_address JSONB NOT NULL,
  -- Expected format: { "line1": "...", "line2": "...", "city": "...", "state": "...", "pincode": "...", "country": "India" }
  
  -- Order items
  items JSONB NOT NULL,
  -- Expected format: [{ "productId": "...", "title": "...", "size": "...", "quantity": 1, "price": 0, "imageUrl": "..." }]
  
  -- Pricing
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_charges NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  
  -- Payment
  payment_method TEXT NOT NULL DEFAULT 'COD',
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  
  -- Order status
  order_status TEXT NOT NULL DEFAULT 'PLACED',
  -- Status values: PLACED, CONFIRMED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED
  
  -- Delivery tracking
  tracking_number TEXT,
  delivery_partner TEXT,
  estimated_delivery DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add some sample orders for testing the admin portal
INSERT INTO orders (
  order_number,
  customer_name,
  customer_email,
  customer_phone,
  shipping_address,
  items,
  subtotal,
  shipping_charges,
  tax_amount,
  total_amount,
  payment_method,
  payment_status,
  order_status,
  tracking_number,
  created_at
) VALUES
(
  'TB' || TO_CHAR(NOW(), 'YYYYMMDD') || '001',
  'Rajesh Kumar',
  'rajesh.kumar@example.com',
  '+919876543210',
  '{"line1": "123 MG Road", "line2": "Sector 15", "city": "Gurugram", "state": "Haryana", "pincode": "122001", "country": "India"}'::jsonb,
  '[{"productId": "1", "title": "Maharaja Majestic - King Size", "size": "King", "quantity": 1, "price": 12999, "imageUrl": "/products/King size/Collection 1/1.jpg"}]'::jsonb,
  12999.00,
  0.00,
  2339.82,
  15338.82,
  'PREPAID',
  'COMPLETED',
  'CONFIRMED',
  'TB' || TO_CHAR(NOW(), 'YYYYMMDD') || '001TRACK',
  NOW() - INTERVAL '2 days'
),
(
  'TB' || TO_CHAR(NOW(), 'YYYYMMDD') || '002',
  'Priya Sharma',
  'priya.sharma@example.com',
  '+919876543211',
  '{"line1": "456 Park Street", "line2": "Apartment 5B", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001", "country": "India"}'::jsonb,
  '[{"productId": "18", "title": "Royal Serenity - Queen Size", "size": "Queen", "quantity": 1, "price": 10999, "imageUrl": "/products/Queen size/Collection 1/1.jpg"}]'::jsonb,
  10999.00,
  0.00,
  1979.82,
  12978.82,
  'COD',
  'PENDING',
  'PLACED',
  NULL,
  NOW() - INTERVAL '1 day'
),
(
  'TB' || TO_CHAR(NOW(), 'YYYYMMDD') || '003',
  'Amit Patel',
  'amit.patel@example.com',
  '+919876543212',
  '{"line1": "789 Brigade Road", "line2": "", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "country": "India"}'::jsonb,
  '[{"productId": "5", "title": "Sultan\'s Opulence - King Size", "size": "King", "quantity": 2, "price": 12999, "imageUrl": "/products/King size/Collection 5/5.jpg"}]'::jsonb,
  25998.00,
  0.00,
  4679.64,
  30677.64,
  'PREPAID',
  'COMPLETED',
  'SHIPPED',
  'TB' || TO_CHAR(NOW(), 'YYYYMMDD') || '003TRACK',
  NOW() - INTERVAL '12 hours'
);

-- Verify the data
SELECT 
  order_number,
  customer_name,
  total_amount,
  payment_status,
  order_status,
  created_at
FROM orders
ORDER BY created_at DESC;
