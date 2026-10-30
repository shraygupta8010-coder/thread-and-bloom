-- =====================================================
-- THREAD & BLOOM - NEW PRODUCTS INSERT QUERIES
-- Database: Supabase PostgreSQL
-- Total New Products: 25 (14 King Size + 11 Queen Size)
-- =====================================================

-- Instructions:
-- 1. Copy these queries to Supabase SQL Editor
-- 2. Run all at once OR run individually
-- 3. Update prices later using UPDATE queries provided below
-- 4. All images are already in public/products folder

-- =====================================================
-- KING SIZE PRODUCTS (14 products)
-- =====================================================

-- 1. Andaaz Type 1
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-ANDZ-T1', 'Andaaz Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2199, 2899, 50, 0, true, 4.8, 0,
  ARRAY['/products/king size/Andaaz/Andaaz bedsheet 1.jpeg', '/products/king size/Andaaz/Andaaz bedsheet 1  dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2199}'::jsonb,
  'Andaaz Type 1 King Size 2-piece premium bedsheet set with elegant design', 'New Arrival',
  'TB-KBS-ANDZ-T1', '6302', 2.5, '40x30x12'
);

-- 2. Andaaz Type 2
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-ANDZ-T2', 'Andaaz Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2199, 2899, 50, 0, true, 4.8, 0,
  ARRAY['/products/king size/Andaaz/Andaaz bedsheet 2.jpeg', '/products/king size/Andaaz/Andaaz bedsheet 2 dimesion.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2199}'::jsonb,
  'Andaaz Type 2 King Size 2-piece premium bedsheet set with elegant design',
  'TB-KBS-ANDZ-T2', '6302', 2.5, '40x30x12'
);

-- 3. Discharge Type 1
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-DSCH-T1', 'Discharge Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2399, 3199, 45, 0, true, 4.8, 0,
  ARRAY['/products/king size/Discharge/Discharge type 1.jpeg', '/products/king size/Discharge/Discharge type 1 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2399}'::jsonb,
  'Discharge Type 1 King Size premium bedsheet with unique discharge print',
  'TB-KBS-DSCH-T1', '6302', 2.5, '40x30x12'
);

-- 4. Discharge Type 2
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-DSCH-T2', 'Discharge Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2399, 3199, 45, 0, true, 4.8, 0,
  ARRAY['/products/king size/Discharge/Discharge type 2.jpeg', '/products/king size/Discharge/Discharge type 2 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2399}'::jsonb,
  'Discharge Type 2 King Size premium bedsheet with unique discharge print',
  'TB-KBS-DSCH-T2', '6302', 2.5, '40x30x12'
);

-- 5. Double Dhamaal Type 1 (Reversible)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-DHDH-T1', 'Double Dhamaal Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 4,
  '4-Piece Reversible King Bedsheet Set', 'Bedding Sets', 3499, 4499, 40, 0, true, 4.9, 0,
  ARRAY['/products/king size/double dhamaal king size reversable/type 1/main image.jpeg', '/products/king size/double dhamaal king size reversable/type 1/dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 3499}'::jsonb,
  'Double Dhamaal Type 1 - Premium 4-piece reversible king bedsheet set with dual design options', 'REVERSIBLE',
  'TB-KBS-DHDH-T1', '6302', 3.0, '45x35x15'
);

-- 6. Double Dhamaal Type 2 (Reversible)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-DHDH-T2', 'Double Dhamaal Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 4,
  '4-Piece Reversible King Bedsheet Set', 'Bedding Sets', 3499, 4499, 40, 0, true, 4.9, 0,
  ARRAY['/products/king size/double dhamaal king size reversable/type 2/type 2.jpeg', '/products/king size/double dhamaal king size reversable/type 2/type 2 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 3499}'::jsonb,
  'Double Dhamaal Type 2 - Premium 4-piece reversible king bedsheet set with dual design options', 'REVERSIBLE',
  'TB-KBS-DHDH-T2', '6302', 3.0, '45x35x15'
);

-- 7. Double Duty Type 1 (Reversible)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-DBDT-T1', 'Double Duty Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 4,
  '4-Piece Reversible King Bedsheet Set', 'Bedding Sets', 3699, 4799, 38, 0, true, 4.9, 0,
  ARRAY['/products/king size/Double duty king size reversable/type 1/type 1.jpeg', '/products/king size/Double duty king size reversable/type 1/type 1 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 3699}'::jsonb,
  'Double Duty Type 1 - Versatile 4-piece reversible king bedsheet with premium finish', 'REVERSIBLE',
  'TB-KBS-DBDT-T1', '6302', 3.0, '45x35x15'
);

-- 8. Double Duty Type 2 (Reversible)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-DBDT-T2', 'Double Duty Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 4,
  '4-Piece Reversible King Bedsheet Set', 'Bedding Sets', 3699, 4799, 38, 0, true, 4.9, 0,
  ARRAY['/products/king size/Double duty king size reversable/type 2/type 2.jpeg', '/products/king size/Double duty king size reversable/type 2/type 2 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 3699}'::jsonb,
  'Double Duty Type 2 - Versatile 4-piece reversible king bedsheet with premium finish', 'REVERSIBLE',
  'TB-KBS-DBDT-T2', '6302', 3.0, '45x35x15'
);

-- 9. Florida Light Grey & White
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-FLR-LGW', 'Florida Light Grey & White', 'ELITE', 'ELITE', 'Elite Premium', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2799, 3699, 35, 0, true, 4.8, 0,
  ARRAY['/products/king size/Florida/light grey and white.jpeg', '/products/king size/Florida/light grey and white diension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2799}'::jsonb,
  'Florida Light Grey & White - Sophisticated 2-piece king bedsheet with minimalist elegance', 'ELITE SIGNATURE',
  'TB-KBS-FLR-LGW', '6302', 2.8, '42x32x13'
);

-- 10. Maharaja Type 1 (ROYAL COLLECTION)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-MHRJ-T1', 'Maharaja Type 1', 'ROYAL', 'ROYAL', 'Royal Line', 3,
  '3-Piece King Bedsheet Set', 'Bedsheets', 4299, 5599, 30, 0, true, 4.9, 0,
  ARRAY['/products/king size/Maharaja/maharaj type 1.jpeg', '/products/king size/Maharaja/Maharaj type 1 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 4299}'::jsonb,
  'Maharaja Type 1 - Royal collection 3-piece king bedsheet with regal patterns and premium quality', 'ROYAL LINE',
  'TB-KBS-MHRJ-T1', '6302', 3.2, '45x35x15'
);

-- 11. Maharaja Type 2 (ROYAL COLLECTION)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-MHRJ-T2', 'Maharaja Type 2', 'ROYAL', 'ROYAL', 'Royal Line', 3,
  '3-Piece King Bedsheet Set', 'Bedsheets', 4299, 5599, 30, 0, true, 4.9, 0,
  ARRAY['/products/king size/Maharaja/Maharaja type 2.jpeg', '/products/king size/Maharaja/Maharaja type 2 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 4299}'::jsonb,
  'Maharaja Type 2 - Royal collection 3-piece king bedsheet with majestic design and luxurious fabric', 'ROYAL LINE',
  'TB-KBS-MHRJ-T2', '6302', 3.2, '45x35x15'
);

-- 12. Maharaja Type 3 (ROYAL COLLECTION)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-MHRJ-T3', 'Maharaja Type 3', 'ROYAL', 'ROYAL', 'Royal Line', 3,
  '3-Piece King Bedsheet Set', 'Bedsheets', 4299, 5599, 30, 0, true, 4.9, 0,
  ARRAY['/products/king size/Maharaja/maharaja type 3.jpeg', '/products/king size/Maharaja/Maharaja type 3 dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 4299}'::jsonb,
  'Maharaja Type 3 - Royal collection 3-piece king bedsheet with opulent patterns and supreme comfort', 'ROYAL LINE',
  'TB-KBS-MHRJ-T3', '6302', 3.2, '45x35x15'
);

-- 13. Ombre King
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-OMB', 'Ombre King', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 1999, 2699, 42, 0, true, 4.8, 0,
  ARRAY['/products/king size/ombre king size/muted plum.jpeg', '/products/king size/ombre king size/muted plum dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 1999}'::jsonb,
  'Ombre King - Gradient design 2-piece bedsheet with smooth color transitions', 'New Arrival',
  'TB-KBS-OMB', '6302', 2.5, '40x30x12'
);

-- 14. Oxford King
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-OXF', 'Oxford King', 'ELITE', 'ELITE', 'Elite Premium', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2899, 3799, 35, 0, true, 4.8, 0,
  ARRAY['/products/king size/Oxford/oxford bedsheet.jpeg', '/products/king size/Oxford/Oxford bedsheet dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2899}'::jsonb,
  'Oxford King - Classic elite 2-piece bedsheet with refined patterns and superior quality', 'ELITE SIGNATURE',
  'TB-KBS-OXF', '6302', 2.8, '42x32x13'
);

-- 15. Rose Wood King
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-RSWD-NEW', 'Rose Wood King', 'ELITE', 'ELITE', 'Elite Premium', 2,
  '2-Piece King Bedsheet Set', 'Bedsheets', 2899, 3799, 38, 0, true, 4.8, 0,
  ARRAY['/products/king size/Rose Wood/Rose Wood bedsheet.jpeg', '/products/king size/Rose Wood/Rose Wood bedsheet dimension.jpeg']::text[],
  ARRAY['King']::text[], '{"King": 2899}'::jsonb,
  'Rose Wood King - Elegant 2-piece bedsheet with warm tones and luxurious fabric', 'ELITE SIGNATURE',
  'TB-KBS-RSWD-NEW', '6302', 2.8, '42x32x13'
);

-- 16. Volla Emboss Type 1 (Maroon)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-VLE-T1', 'Volla Emboss Maroon', 'ELITE', 'ELITE', 'Elite Premium', 3,
  '3-Piece Embossed King Bedsheet Set', 'Bedsheets', 3299, 4299, 32, 0, true, 4.9, 0,
  ARRAY['/products/king size/volla emboss king (king size)/maroon (classic plain bedsheet).jpeg', '/products/king size/volla emboss king (king size)/maroon dimension (classic plain bedsheet).jpeg']::text[],
  ARRAY['King']::text[], '{"King": 3299}'::jsonb,
  'Volla Emboss Maroon - Premium 3-piece embossed king bedsheet with textured elegance', 'ELITE SIGNATURE',
  'TB-KBS-VLE-T1', '6302', 3.0, '45x35x15'
);

-- 17. Volla Emboss Type 2 (Taupe)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-KBS-VLE-T2', 'Volla Emboss Taupe', 'ELITE', 'ELITE', 'Elite Premium', 3,
  '3-Piece Embossed King Bedsheet Set', 'Bedsheets', 3299, 4299, 32, 0, true, 4.9, 0,
  ARRAY['/products/king size/volla emboss king (king size)/taupe(classic plain bedsheet).jpeg', '/products/king size/volla emboss king (king size)/taupe dimension (classic plain bedsheet).jpeg']::text[],
  ARRAY['King']::text[], '{"King": 3299}'::jsonb,
  'Volla Emboss Taupe - Premium 3-piece embossed king bedsheet with sophisticated texture', 'ELITE SIGNATURE',
  'TB-KBS-VLE-T2', '6302', 3.0, '45x35x15'
);

-- =====================================================
-- QUEEN SIZE PRODUCTS (11 products)
-- =====================================================

-- 18. Kalamkari Type 1 (Quilted Pillow Covers)
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-KAL-T1', 'Kalamkari Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 1899, 2499, 40, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/kalamkari/kalamkari type 1.jpeg', '/products/Queen size/kalamkari/kalamkari type 1 dimension (quilted pillow covers ).jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 1899}'::jsonb,
  'Kalamkari Type 1 - Traditional hand-block print design queen bedsheet with artistic patterns', 'CLASSIC ATELIER',
  'TB-QBS-KAL-T1', '6302', 2.0, '38x28x10'
);

-- 19. Kalamkari Type 2
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-KAL-T2', 'Kalamkari Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 1899, 2499, 40, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/kalamkari/kalamkari type 2.jpeg', '/products/Queen size/kalamkari/kalamkari type 2 dimension (quilted bedsheet pillow cover ).jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 1899}'::jsonb,
  'Kalamkari Type 2 - Traditional hand-block print design queen bedsheet with vibrant motifs', 'CLASSIC ATELIER',
  'TB-QBS-KAL-T2', '6302', 2.0, '38x28x10'
);

-- 20. Kalamkari Type 3
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-KAL-T3', 'Kalamkari Type 3', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 1899, 2499, 40, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/kalamkari/kalamkari type 3.jpeg', '/products/Queen size/kalamkari/kalamkari type 3  dimension (quilted bedsheet pillow cover ).jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 1899}'::jsonb,
  'Kalamkari Type 3 - Traditional hand-block print design queen bedsheet with intricate artwork', 'CLASSIC ATELIER',
  'TB-QBS-KAL-T3', '6302', 2.0, '38x28x10'
);

-- 21. Meraki Type 1
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-MRK-T1', 'Meraki Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 2199, 2899, 45, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/meraki/meraki type 1.jpeg', '/products/Queen size/meraki/meraki type 1 dimension.jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 2199}'::jsonb,
  'Meraki Type 1 - Artisan-crafted queen bedsheet with creative soul and modern aesthetics', 'New Arrival',
  'TB-QBS-MRK-T1', '6302', 2.0, '38x28x10'
);

-- 22. Meraki Type 2
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-MRK-T2', 'Meraki Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 2199, 2899, 45, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/meraki/meraki type 2.jpeg', '/products/Queen size/meraki/meraki type 2 dimension.jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 2199}'::jsonb,
  'Meraki Type 2 - Artisan-crafted queen bedsheet with unique design and premium comfort', 'New Arrival',
  'TB-QBS-MRK-T2', '6302', 2.0, '38x28x10'
);

-- 23. Vibes Type 1
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-VIB-T1', 'Vibes Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 1,
  'Single-Piece Queen Bedsheet', 'Bedsheets', 1299, 1699, 50, 0, true, 4.7, 0,
  ARRAY['/products/Queen size/vibes/vibes  type 1.jpeg', '/products/Queen size/vibes/vibes type 1 dimension.jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 1299}'::jsonb,
  'Vibes Type 1 - Contemporary single-piece queen bedsheet with fresh modern design', 'Bestseller',
  'TB-QBS-VIB-T1', '6302', 1.8, '35x25x8'
);

-- 24. Volla Divine Type 1
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-VDV-T1', 'Volla Divine Type 1', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 2399, 3199, 42, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/volla ( divine )/volla divine type 1.jpeg', '/products/Queen size/volla ( divine )/volla diviine type 1 dimension.jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 2399}'::jsonb,
  'Volla Divine Type 1 - Heavenly soft 2-piece queen bedsheet with divine comfort and elegance', 'CLASSIC ATELIER',
  'TB-QBS-VDV-T1', '6302', 2.0, '38x28x10'
);

-- 25. Volla Divine Type 2
INSERT INTO products (
  id, name, collection, collection_tier, series, pieces, subtitle, category,
  price, original_price, stock_quantity, units_sold, in_stock, rating, reviews_count,
  images, sizes, size_prices, description, badge, sku, hsn, weight_kg, dimensions_cm
) VALUES (
  'TB-QBS-VDV-T2', 'Volla Divine Type 2', 'ATELIER', 'ATELIER', 'Atelier Standard', 2,
  '2-Piece Queen Bedsheet Set', 'Bedsheets', 2399, 3199, 42, 0, true, 4.8, 0,
  ARRAY['/products/Queen size/volla ( divine )/volla divine type 2.jpeg', '/products/Queen size/volla ( divine )/volla divine type 2 dimension.jpeg']::text[],
  ARRAY['Queen']::text[], '{"Queen": 2399}'::jsonb,
  'Volla Divine Type 2 - Serene 2-piece queen bedsheet with luxurious feel and beautiful patterns', 'CLASSIC ATELIER',
  'TB-QBS-VDV-T2', '6302', 2.0, '38x28x10'
);

-- =====================================================
-- SUMMARY
-- =====================================================
-- Total Products Added: 25
-- King Size: 17 products
-- Queen Size: 8 products
-- Collections:
--   - ATELIER: 13 products
--   - ELITE: 9 products
--   - ROYAL: 3 products (Maharaja collection)
-- Special Features:
--   - Reversible Sets: 4 products (Double Dhamaal + Double Duty)
--   - Embossed: 2 products (Volla Emboss)
--   - Traditional: 3 products (Kalamkari)
--   - Royal Collection: 3 products (Maharaja)
-- =====================================================

-- =====================================================
-- PRICE UPDATE QUERIES (Use these to update prices later)
-- =====================================================

-- Example: Update price for a specific product
-- UPDATE products SET price = 2599, original_price = 3399 WHERE id = 'TB-KBS-ANDZ-T1';

-- Example: Update prices for entire collection
-- UPDATE products SET price = price * 1.1, original_price = original_price * 1.1 
-- WHERE collection = 'ROYAL';

-- Example: Bulk update for King Size products
-- UPDATE products SET price = 2499, original_price = 3299 
-- WHERE id IN ('TB-KBS-ANDZ-T1', 'TB-KBS-ANDZ-T2');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all new products
SELECT id, name, collection, price, stock_quantity, array_length(images, 1) as image_count
FROM products 
WHERE id LIKE 'TB-KBS-%T%' OR id LIKE 'TB-QBS-%T%'
ORDER BY collection, name;

-- Count products by collection
SELECT collection, COUNT(*) as total_products, AVG(price) as avg_price
FROM products
GROUP BY collection
ORDER BY total_products DESC;

-- Check image paths
SELECT id, name, images[1] as main_image, images[2] as dimension_image
FROM products
WHERE id LIKE 'TB-KBS-%T%' OR id LIKE 'TB-QBS-%T%'
LIMIT 10;
