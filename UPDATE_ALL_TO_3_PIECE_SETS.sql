-- =====================================================
-- UPDATE ALL PRODUCTS TO 3-PIECE SETS
-- (1 Bedsheet + 2 Pillow Covers)
-- =====================================================

-- Update all products to 3-Piece Set except Vibes Type 1 (which is single piece)
UPDATE products
SET 
  subtitle = CASE 
    WHEN id LIKE 'TB-KBS-%' THEN '3-Piece King Bedsheet Set (1 Bedsheet + 2 Pillow Covers)'
    WHEN id LIKE 'TB-QBS-%' AND id != 'TB-QBS-VIB-T1' THEN '3-Piece Queen Bedsheet Set (1 Bedsheet + 2 Pillow Covers)'
    ELSE subtitle
  END,
  specs = jsonb_set(
    jsonb_set(
      specs,
      '{pieces}',
      CASE 
        WHEN id = 'TB-QBS-VIB-T1' THEN '1'::jsonb
        ELSE '3'::jsonb
      END
    ),
    '{description}',
    CASE 
      WHEN id LIKE 'TB-KBS-ANDZ-%' THEN '"Andaaz King Size 3-piece premium bedsheet set (1 bedsheet + 2 pillow covers) with elegant design and superior comfort"'::jsonb
      WHEN id LIKE 'TB-KBS-DSCH-%' THEN '"Discharge King Size 3-piece premium bedsheet set (1 bedsheet + 2 pillow covers) with unique discharge print and soft texture"'::jsonb
      WHEN id LIKE 'TB-KBS-DHDH-%' THEN '"Double Dhamaal - Premium 3-piece reversible king bedsheet set (1 bedsheet + 2 pillow covers) with dual design options for versatile styling"'::jsonb
      WHEN id LIKE 'TB-KBS-DBDT-%' THEN '"Double Duty - Versatile 3-piece reversible king bedsheet set (1 bedsheet + 2 pillow covers) with premium finish and reversible design"'::jsonb
      WHEN id = 'TB-KBS-FLR-LGW' THEN '"Florida Light Grey & White - Sophisticated 3-piece king bedsheet set (1 bedsheet + 2 pillow covers) with minimalist elegance"'::jsonb
      WHEN id LIKE 'TB-KBS-MHRJ-%' THEN '"Maharaja - Royal collection 3-piece king bedsheet set (1 bedsheet + 2 pillow covers) with regal patterns and premium quality fabric"'::jsonb
      WHEN id = 'TB-KBS-OMB' THEN '"Ombre King - Gradient design 3-piece bedsheet set (1 bedsheet + 2 pillow covers) with smooth color transitions"'::jsonb
      WHEN id = 'TB-KBS-OXF' THEN '"Oxford King - Classic elite 3-piece bedsheet set (1 bedsheet + 2 pillow covers) with refined patterns and superior quality"'::jsonb
      WHEN id = 'TB-KBS-RSWD-NEW' THEN '"Rose Wood King - Elegant 3-piece bedsheet set (1 bedsheet + 2 pillow covers) with warm tones and luxurious fabric"'::jsonb
      WHEN id LIKE 'TB-KBS-VLE-%' THEN '"Volla Emboss - Premium 3-piece embossed king bedsheet set (1 bedsheet + 2 pillow covers) with textured elegance"'::jsonb
      WHEN id LIKE 'TB-QBS-KAL-%' THEN '"Kalamkari - Traditional hand-block print 3-piece queen bedsheet set (1 bedsheet + 2 pillow covers) with artistic patterns"'::jsonb
      WHEN id LIKE 'TB-QBS-MRK-%' THEN '"Meraki - Artisan-crafted 3-piece queen bedsheet set (1 bedsheet + 2 pillow covers) with creative soul and modern aesthetics"'::jsonb
      WHEN id = 'TB-QBS-VIB-T1' THEN '"Vibes Type 1 - Contemporary single-piece queen bedsheet with fresh modern design"'::jsonb
      WHEN id LIKE 'TB-QBS-VDV-%' THEN '"Volla Divine - Heavenly soft 3-piece queen bedsheet set (1 bedsheet + 2 pillow covers) with divine comfort and elegance"'::jsonb
      ELSE specs->'description'
    END
  )
WHERE id LIKE 'TB-%';

-- Verification Query
SELECT 
  id,
  title,
  subtitle,
  specs->>'pieces' as pieces,
  substring(specs->>'description', 1, 80) || '...' as description_preview
FROM products 
WHERE id LIKE 'TB-%'
ORDER BY id;
