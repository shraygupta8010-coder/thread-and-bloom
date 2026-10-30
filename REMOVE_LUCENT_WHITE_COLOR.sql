-- =====================================================
-- REMOVE "Lucent White" COLOR FROM ALL PRODUCTS
-- =====================================================

-- Update all products to remove Lucent White from colors array
UPDATE products
SET 
  swatches = (
    SELECT jsonb_agg(color)
    FROM jsonb_array_elements(swatches) AS color
    WHERE color->>'name' != 'Lucent White'
  ),
  specs = jsonb_set(
    specs,
    '{colors}',
    COALESCE(
      (
        SELECT jsonb_agg(color)
        FROM jsonb_array_elements(specs->'colors') AS color
        WHERE color->>'name' != 'Lucent White'
      ),
      '[]'::jsonb
    )
  )
WHERE 
  swatches::text LIKE '%Lucent White%' 
  OR specs->'colors'::text LIKE '%Lucent White%';

-- Verification: Check if any products still have Lucent White
SELECT 
  id,
  title,
  swatches,
  specs->'colors' as colors_in_specs
FROM products 
WHERE 
  swatches::text LIKE '%Lucent White%' 
  OR specs->'colors'::text LIKE '%Lucent White%';

-- If above query returns 0 rows, then removal was successful!
