-- =====================================================
-- CLEAN DATABASE - PASTE IN SUPABASE SQL EDITOR
-- 1. Delete all old sample products (keep only D drive products)
-- 2. Your real products have IDs ending with -T1, -T2, -T3, -LGW
-- =====================================================

-- STEP 1: DELETE ALL OLD SAMPLE PRODUCTS
-- Keep only your actual D drive products
DELETE FROM products 
WHERE id IN (
  'TB-BIAB-CRM-FLV',
  'TB-FEST-SIG-FIE',
  'TB-FEST-TRD-VAS',
  'TB-FEST-LAY-SHG',
  'TB-FEST-LAY-PMP',
  'TB-FEST-TRD-ELV',
  'TB-KBS-RSWD-STD',
  'TB-FEST-SIG-SHR',
  'TB-KBS-EST-QBC',
  'TB-KBS-VOLLA-CLS',
  'TB-KBS-OMBRE',
  'TB-KBS-DHDH',
  'TB-KBS-CRM-STD',
  'TB-KBS-FLR',
  'TB-KBS-ANDZ',
  'TB-KBS-MHRJ',
  'TB-KBS-HRTH',
  'TB-KBS-SPSH',
  'TB-KBS-LTST',
  'TB-KBS-CRM-CS',
  'TB-KBS-CRM-ELT',
  'TB-KBS-CRM-ADM',
  'TB-KBS-SIG-CLUB',
  'TB-QBS-KAL-PC',
  'TB-QBS-VIB',
  'TB-QBS-MRK',
  'TB-QBS-VDV',
  'TB-DOHAR-CRM-AC',
  'TB-COMF-RAKS-PLN',
  'TB-COMF-SLQ-DSG',
  'TB-BIAB-VNT',
  'TB-BIAB-CRM-STD',
  'TB-BIAB-CRM-ORN',
  'royal-jaipur-velvet-quilted-blanket-2mqs',
  'bespoke-monogrammed-silk-duvet',
  'nocturne-mulberry-silk-pillowcase',
  'zero-twist-turkish-bath-set',
  'aura-charcoal-fleece-blanket',
  'prism-heavy-weight-winter-comforter',
  'quado-lucent-white'
);

-- STEP 2: VERIFY - Should show only 25 products (your D drive products)
SELECT COUNT(*) as total_products FROM products;

-- STEP 3: LIST REMAINING PRODUCTS
SELECT id, title, specs->'collection' as collection 
FROM products 
ORDER BY id;

-- =====================================================
-- RESULT: Database will have ONLY 25 products:
-- ✅ 17 King Size (TB-KBS-*T1, *T2, *T3, *LGW, etc)
-- ✅ 8 Queen Size (TB-QBS-*T1, *T2, *T3)
-- =====================================================
/*  */