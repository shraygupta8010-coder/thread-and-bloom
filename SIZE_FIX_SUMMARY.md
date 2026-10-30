# Size Fix Instructions - Thread & Bloom

## Problem
Abhi sab products mein King aur Queen dono sizes show ho rahe hain. But actual products ek hi size ki hain:
- King size folder ki products → Sirf King
- Queen size folder ki products → Sirf Queen

## Solution
Supabase SQL Editor mein ye query run karo: **`FIX_SIZE_AVAILABILITY.sql`**

---

## What Will Be Fixed:

### KING SIZE PRODUCTS (17) - Set to King Only:
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
13. TB-KBS-OMB - Ombre King
14. TB-KBS-OXF - Oxford King
15. TB-KBS-RSWD-NEW - Rose Wood King
16. TB-KBS-VLE-T1 - Volla Emboss Maroon
17. TB-KBS-VLE-T2 - Volla Emboss Taupe

**Change:** `sizes: ["King", "Queen"]` → `sizes: ["King"]`

---

### QUEEN SIZE PRODUCTS (8) - Set to Queen Only:
1. TB-QBS-KAL-T1 - Kalamkari Type 1
2. TB-QBS-KAL-T2 - Kalamkari Type 2
3. TB-QBS-KAL-T3 - Kalamkari Type 3
4. TB-QBS-MRK-T1 - Meraki Type 1
5. TB-QBS-MRK-T2 - Meraki Type 2
6. TB-QBS-VIB-T1 - Vibes Type 1
7. TB-QBS-VDV-T1 - Volla Divine Type 1
8. TB-QBS-VDV-T2 - Volla Divine Type 2

**Change:** `sizes: ["King", "Queen"]` → `sizes: ["Queen"]`

---

## How to Apply Fix:

### Step 1: Open File
Open: **`FIX_SIZE_AVAILABILITY.sql`**

### Step 2: Copy Everything
Press `Ctrl+A` → `Ctrl+C`

### Step 3: Supabase SQL Editor
1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Paste the query
4. Click **RUN**

### Step 4: Verify
Query ko run karne ke baad:
```sql
SELECT id, title, specs->'sizes' as sizes 
FROM products 
WHERE id LIKE 'TB-%T%' 
ORDER BY id;
```

---

## Expected Result:

### Before Fix:
```json
{
  "id": "TB-KBS-ANDZ-T1",
  "sizes": ["King", "Queen"],
  "sizePrices": {"King": 2199, "Queen": 2199}
}
```

### After Fix:
```json
{
  "id": "TB-KBS-ANDZ-T1",
  "sizes": ["King"],
  "sizePrices": {"King": 2199}
}
```

---

## Why This Fix:

1. **Correct Stock Management**: King size stock sirf King ke liye
2. **No Confusion**: Customer ko sahi size dikhega
3. **Proper Filtering**: Size filter properly work karega
4. **Accurate Inventory**: Real stock reflect hoga

---

## Files:
- **`FIX_SIZE_AVAILABILITY.sql`** ← Copy paste this in Supabase
- **`SIZE_FIX_SUMMARY.md`** ← This documentation

---

**Run the SQL query and you're done!** ✅
