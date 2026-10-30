-- =====================================================
-- FIX PRODUCT SIZES - PASTE IN SUPABASE SQL EDITOR
-- King size products ko sirf King, Queen ko sirf Queen
-- =====================================================

-- KING SIZE PRODUCTS - Remove Queen size option, set King only
UPDATE products SET 
  price_king = price_queen,
  specs = jsonb_set(
    jsonb_set(specs, '{sizes}', '["King"]'::jsonb),
    '{sizePrices}', 
    jsonb_build_object('King', (specs->>'price')::numeric)
  )
WHERE id IN (
  'TB-KBS-ANDZ-T1',
  'TB-KBS-ANDZ-T2',
  'TB-KBS-DSCH-T1',
  'TB-KBS-DSCH-T2',
  'TB-KBS-DHDH-T1',
  'TB-KBS-DHDH-T2',
  'TB-KBS-DBDT-T1',
  'TB-KBS-DBDT-T2',
  'TB-KBS-FLR-LGW',
  'TB-KBS-MHRJ-T1',
  'TB-KBS-MHRJ-T2',
  'TB-KBS-MHRJ-T3',
  'TB-KBS-OMB',
  'TB-KBS-OXF',
  'TB-KBS-RSWD-NEW',
  'TB-KBS-VLE-T1',
  'TB-KBS-VLE-T2'
);

-- QUEEN SIZE PRODUCTS - Remove King size option, set Queen only
UPDATE products SET 
  price_king = price_queen,
  specs = jsonb_set(
    jsonb_set(specs, '{sizes}', '["Queen"]'::jsonb),
    '{sizePrices}', 
    jsonb_build_object('Queen', (specs->>'price')::numeric)
  )
WHERE id IN (
  'TB-QBS-KAL-T1',
  'TB-QBS-KAL-T2',
  'TB-QBS-KAL-T3',
  'TB-QBS-MRK-T1',
  'TB-QBS-MRK-T2',
  'TB-QBS-VIB-T1',
  'TB-QBS-VDV-T1',
  'TB-QBS-VDV-T2'
);

-- =====================================================
-- VERIFY: Check sizes after update
-- =====================================================
-- SELECT id, title, specs->'sizes' as sizes, specs->'sizePrices' as size_prices 
-- FROM products 
-- WHERE id LIKE 'TB-%T%' 
-- ORDER BY id;

-- =====================================================
-- SUMMARY
-- =====================================================
-- King Size (17 products): Only "King" size available
-- Queen Size (8 products): Only "Queen" size available
-- =====================================================
