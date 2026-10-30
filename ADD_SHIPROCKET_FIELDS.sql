-- Add Shiprocket tracking fields to orders table
-- Run this in Supabase SQL Editor

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

-- Add comment
COMMENT ON COLUMN orders.shiprocket_order_id IS 'Shiprocket internal order ID';
COMMENT ON COLUMN orders.shiprocket_shipment_id IS 'Shiprocket shipment ID for tracking';
COMMENT ON COLUMN orders.awb_code IS 'Air Waybill number - tracking number';
COMMENT ON COLUMN orders.tracking_status IS 'Current shipment status from Shiprocket';
