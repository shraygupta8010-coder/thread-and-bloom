-- =====================================================
-- UPDATE PRODUCT NAMES - Replace "Type 1/2/3" with Luxury Names
-- PASTE IN SUPABASE SQL EDITOR
-- =====================================================

-- KING SIZE PRODUCTS
-- Andaaz Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Andaaz Royal"') WHERE id = 'TB-KBS-ANDZ-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Andaaz Imperial"') WHERE id = 'TB-KBS-ANDZ-T2';

-- Double Duty Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Double Duty Elegance"') WHERE id = 'TB-KBS-DBDT-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Double Duty Prestige"') WHERE id = 'TB-KBS-DBDT-T2';

-- Double Dhamaal Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Double Dhamaal Luxe"') WHERE id = 'TB-KBS-DHDH-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Double Dhamaal Elite"') WHERE id = 'TB-KBS-DHDH-T2';

-- Discharge Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Discharge Classic"') WHERE id = 'TB-KBS-DSCH-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Discharge Premium"') WHERE id = 'TB-KBS-DSCH-T2';

-- Maharaja Collection (3 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Maharaja Sovereign"') WHERE id = 'TB-KBS-MHRJ-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Maharaja Majestic"') WHERE id = 'TB-KBS-MHRJ-T2';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Maharaja Regal"') WHERE id = 'TB-KBS-MHRJ-T3';

-- Volla Emboss Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Volla Emboss Maroon Luxe"') WHERE id = 'TB-KBS-VLE-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Volla Emboss Taupe Elite"') WHERE id = 'TB-KBS-VLE-T2';

-- QUEEN SIZE PRODUCTS
-- Kalamkari Collection (3 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Kalamkari Heritage"') WHERE id = 'TB-QBS-KAL-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Kalamkari Artisan"') WHERE id = 'TB-QBS-KAL-T2';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Kalamkari Signature"') WHERE id = 'TB-QBS-KAL-T3';

-- Meraki Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Meraki Essence"') WHERE id = 'TB-QBS-MRK-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Meraki Opulence"') WHERE id = 'TB-QBS-MRK-T2';

-- Volla Divine Collection (2 variants)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Volla Divine Serenity"') WHERE id = 'TB-QBS-VDV-T1';
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Volla Divine Grace"') WHERE id = 'TB-QBS-VDV-T2';

-- Vibes Collection (1 variant)
UPDATE products SET specs = jsonb_set(specs, '{name}', '"Vibes Tranquility"') WHERE id = 'TB-QBS-VIB-T1';

-- =====================================================
-- VERIFY UPDATED NAMES
-- =====================================================
SELECT id, specs->'name' as product_name, specs->'collection' as collection
FROM products 
WHERE id LIKE '%-T1' OR id LIKE '%-T2' OR id LIKE '%-T3'
ORDER BY id;

-- =====================================================
-- RESULT: All products will have luxury names instead of "Type 1/2/3"
-- Example: "Andaaz Type 1" → "Andaaz Royal"
-- =====================================================
