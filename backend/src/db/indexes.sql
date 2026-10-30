-- =========================================================================
-- THREAD & BLOOM LUXURY LIVING: DATABASE PERFORMANCE & SEARCH INDEXES
-- Supabase Project: https://supabase.com/dashboard/project/gharubakdmrduabsodyc/sql/new
-- =========================================================================

-- Enable PostgreSQL Trigram Extension for fast ILIKE & fuzzy text searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =========================================================================
-- 1. PRODUCTS TABLE INDEXES (Catalog Browsing, Storefront Filters, Admin Search)
-- =========================================================================

-- A. Primary Category & Sorting Composite Index
-- Powers: Storefront /comforters and /blankets sorting by latest arrival
CREATE INDEX IF NOT EXISTS idx_products_category_created
  ON public.products (category, created_at DESC);

-- B. In-Stock Filter Composite Index
-- Powers: "In Stock Only" toggle on storefront and inventory analytics
CREATE INDEX IF NOT EXISTS idx_products_instock_category
  ON public.products (in_stock, category);

-- C. Full-Text & Fuzzy Trigram Index on Title
-- Powers: Instant search as patron types product title in search bars (100x faster than table scan)
CREATE INDEX IF NOT EXISTS idx_products_title_trgm
  ON public.products USING gin (title gin_trgm_ops);

-- D. Trigram Index on Subtitle
-- Powers: Matching fabric/weave keywords (e.g. "Mulberry Silk", "Egyptian Cotton")
CREATE INDEX IF NOT EXISTS idx_products_subtitle_trgm
  ON public.products USING gin (subtitle gin_trgm_ops);

-- E. GIN Index on specs JSONB column
-- Powers: Fast path queries inside the rich JSONB document (color, size, badge, rating)
CREATE INDEX IF NOT EXISTS idx_products_specs_gin
  ON public.products USING gin (specs);

-- F. Functional Expression Index on SKU inside JSONB
-- Powers: Instant O(1) admin search & barcode scan by SKU (e.g., 'TB-DUVT-BESPOKE-SLK')
CREATE INDEX IF NOT EXISTS idx_products_sku_expr
  ON public.products ((specs->>'sku'));

-- G. Functional Expression Index on Collection inside JSONB
-- Powers: Filtering by collection (e.g., 'ATELIER BESPOKE', 'SLUMBER', 'VEGA')
CREATE INDEX IF NOT EXISTS idx_products_collection_expr
  ON public.products ((specs->>'collection'));

-- =========================================================================
-- 2. ORDERS TABLE INDEXES (Logistics, 3PL Manifests, Patron History)
-- =========================================================================

-- A. Unique Index on Order Number
-- Powers: Instant lookup for tracking, status updates, and manifest generation
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number
  ON public.orders (order_number);

-- B. Composite Index on Order Status & Creation Date
-- Powers: Admin Orders tab filtering by status (PLACED, SHIPPED, DELIVERED)
CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON public.orders (order_status, created_at DESC);

-- C. Composite Index on Payment Status & Method
-- Powers: Cash on Delivery collection queue and Razorpay reconciliation
CREATE INDEX IF NOT EXISTS idx_orders_payment_status_method
  ON public.orders (payment_status, payment_method);

-- D. Patron Identification Indexes (Email & Phone)
-- Powers: Correlating patron lifetime order history in the Admin Patron Directory
CREATE INDEX IF NOT EXISTS idx_orders_customer_email
  ON public.orders (customer_email);

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone
  ON public.orders (customer_phone);

-- E. Trigram Index on Customer Name
-- Powers: Fast partial matching when admin searches orders by customer name
CREATE INDEX IF NOT EXISTS idx_orders_customer_name_trgm
  ON public.orders USING gin (customer_name gin_trgm_ops);

-- F. Index on City & Pin Code for 3PL Regional Logistics
-- Powers: Grouping deliveries for Delhivery / Blue Dart pickup runs
CREATE INDEX IF NOT EXISTS idx_orders_destination_logistics
  ON public.orders (city, pin_code);

-- G. GIN Index on items JSONB column
-- Powers: Searching orders containing specific product SKUs or items
CREATE INDEX IF NOT EXISTS idx_orders_items_gin
  ON public.orders USING gin (items);

-- =========================================================================
-- 3. USERS / PATRONS TABLE INDEXES (Client Directory & Profiles)
-- =========================================================================

-- A. Unique Index on Email
-- Powers: Patron profile lookup, checkout auto-fill, and conflict resolution
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
  ON public.users (email);

-- B. Index on Phone Number
-- Powers: WhatsApp lookup and login by mobile number
CREATE INDEX IF NOT EXISTS idx_users_phone
  ON public.users (phone);

-- C. Trigram Index on Patron Full Name
-- Powers: Instant search in Admin Tab 4 (Patron Directory)
CREATE INDEX IF NOT EXISTS idx_users_name_trgm
  ON public.users USING gin ((first_name || ' ' || COALESCE(last_name, '')) gin_trgm_ops);

-- D. Index on Creation Date
-- Powers: Sorting patron list by newest registration
CREATE INDEX IF NOT EXISTS idx_users_created_at
  ON public.users (created_at DESC);

-- =========================================================================
-- 4. RE-ANALYZE TABLES FOR POSTGRES QUERY PLANNER OPTIMIZATION
-- =========================================================================
ANALYZE public.products;
ANALYZE public.orders;
ANALYZE public.users;
