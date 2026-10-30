# Final Cleanup - Remove Sample Data

## Problem
Database mein 65 products hain but tumhe sirf apne D drive wale 25 products chahiye.

## Solution
Run this SQL file in Supabase: **`DELETE_OLD_PRODUCTS_AND_FIX_SIZES.sql`**

---

## What Will Be Deleted (40 Old Sample Products):

### Sample/Test Products to Remove:
1. TB-BIAB-CRM-FLV - Crimson Flvis Set
2. TB-FEST-SIG-FIE - Signature Fiesta
3. TB-FEST-TRD-VAS - MyTrident Vasant
4. TB-FEST-LAY-SHG - Layer Shagun
5. TB-FEST-LAY-PMP - Layer Parampara
6. TB-FEST-TRD-ELV - MyTrident Earth Lover
7. TB-KBS-RSWD-STD - Rosewood Standard King
8. TB-FEST-SIG-SHR - Signature Shiraz
9. TB-KBS-EST-QBC - Estetico Quilted Bedcover King
10. TB-KBS-VOLLA-CLS - Volla Classic King
11. TB-KBS-OMBRE - Ombre King Bedsheet (old)
12. TB-KBS-DHDH - Double Dhamaal King (old)
13. TB-KBS-CRM-STD - Crimson Standard King
14. TB-KBS-FLR - Florida King (old)
15. TB-KBS-ANDZ - Andaaz King (old)
16. TB-KBS-MHRJ - Maharaja King (old)
17. TB-KBS-HRTH - Heritage Reliable King
18. TB-KBS-SPSH - Super Shine King
19. TB-KBS-LTST - Lotus Sterling King
20. TB-KBS-CRM-CS - Crimson Check & Stripe King
21. TB-KBS-CRM-ELT - Crimson Elite King
22. TB-KBS-CRM-ADM - Crimson Admire King
23. TB-KBS-SIG-CLUB - Signature Club Collection King
24. TB-QBS-KAL-PC - Kalamkari Quilted Pillow Cover (old)
25. TB-QBS-VIB - Vibes Queen Bedsheet (old)
26. TB-QBS-MRK - Meraki Queen (old)
27. TB-QBS-VDV - Volla Divine Queen (old)
28. TB-DOHAR-CRM-AC - Crimson AC Dohar Double
29. TB-COMF-RAKS-PLN - Raks Plain Comforter
30. TB-COMF-SLQ-DSG - Sliqe Designer Comforter
31. TB-BIAB-VNT - Volla Vantara
32. TB-BIAB-CRM-STD - Crimson Standard Set
33. TB-BIAB-CRM-ORN - Crimson Ornate Set
34. royal-jaipur-velvet-quilted-blanket-2mqs
35. bespoke-monogrammed-silk-duvet
36. nocturne-mulberry-silk-pillowcase
37. zero-twist-turkish-bath-set
38. aura-charcoal-fleece-blanket
39. prism-heavy-weight-winter-comforter
40. quado-lucent-white

---

## What Will REMAIN (25 Your Real Products):

### KING SIZE (17 Products) ✅
1. TB-KBS-ANDZ-T1 - Andaaz Type 1
2. TB-KBS-ANDZ-T2 - Andaaz Type 2
3. TB-KBS-DSCH-T1 - Discharge Type 1
4. TB-KBS-DSCH-T2 - Discharge Type 2
5. TB-KBS-DHDH-T1 - Double Dhamaal Type 1
6. TB-KBS-DHDH-T2 - Double Dhamaal Type 2
7. TB-KBS-DBDT-T1 - Double Duty Type 1
8. TB-KBS-DBDT-T2 - Double Duty Type 2
9. TB-KBS-FLR-LGW - Florida Light Grey & White
10. TB-KBS-MHRJ-T1 - Maharaja Type 1 ⭐
11. TB-KBS-MHRJ-T2 - Maharaja Type 2 ⭐
12. TB-KBS-MHRJ-T3 - Maharaja Type 3 ⭐
13. TB-KBS-OMB - Ombre King (new)
14. TB-KBS-OXF - Oxford King (new)
15. TB-KBS-RSWD-NEW - Rose Wood King (new)
16. TB-KBS-VLE-T1 - Volla Emboss Maroon
17. TB-KBS-VLE-T2 - Volla Emboss Taupe

### QUEEN SIZE (8 Products) ✅
18. TB-QBS-KAL-T1 - Kalamkari Type 1
19. TB-QBS-KAL-T2 - Kalamkari Type 2
20. TB-QBS-KAL-T3 - Kalamkari Type 3
21. TB-QBS-MRK-T1 - Meraki Type 1 (new)
22. TB-QBS-MRK-T2 - Meraki Type 2 (new)
23. TB-QBS-VIB-T1 - Vibes Type 1 (new)
24. TB-QBS-VDV-T1 - Volla Divine Type 1 (new)
25. TB-QBS-VDV-T2 - Volla Divine Type 2 (new)

---

## How to Apply:

### Step 1: Open Supabase
Go to: **Supabase Dashboard → SQL Editor**

### Step 2: Copy SQL
Open: **`DELETE_OLD_PRODUCTS_AND_FIX_SIZES.sql`**
Copy everything (Ctrl+A, Ctrl+C)

### Step 3: Paste & Run
Paste in SQL Editor and click **RUN**

### Step 4: Verify
Query result will show:
```
total_products: 25
```

---

## Before vs After:

### BEFORE:
- Total Products: **65**
- Old sample data: 40 products
- Your real products: 25 products
- Mixed up data

### AFTER:
- Total Products: **25** ✅
- Only D drive products
- Clean database
- All with real images

---

## Benefits:

1. ✅ **Clean Database** - No sample/test data
2. ✅ **Only Your Products** - Sirf D drive wale
3. ✅ **Real Images** - Har product ki actual photos
4. ✅ **Proper Sizes** - King = King, Queen = Queen
5. ✅ **Better Performance** - Less data, faster load

---

## After Running SQL:

Website will show:
- **17 King Size** bedsheets with real images
- **8 Queen Size** bedsheets with real images
- **Total 25** products from your D drive

**No more sample data! Clean & professional!** ✨

---

**File:** `DELETE_OLD_PRODUCTS_AND_FIX_SIZES.sql`
**Action:** Copy → Paste in Supabase SQL Editor → Run
**Result:** Clean database with only your 25 products
