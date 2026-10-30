# Product Images Inventory - Thread & Bloom

## Overview
All product images have been successfully imported from `D:\database of the bedsheet\` to `d:\bedsheet\public\products\`

## Total Images: **50 Images**

## Image Naming Convention
Each product variant has 2 images:
1. **Main Image** - Full bedsheet display (e.g., `maharaj type 1.jpeg`)
2. **Dimension Image** - Folding/detail view (e.g., `Maharaj type 1 dimension.jpeg`)

---

## 📁 KING SIZE COLLECTIONS (10 Collections)

### 1. Andaaz
- Location: `/products/king size/Andaaz/`
- Images: 4
  - Andaaz bedsheet 1.jpeg
  - Andaaz bedsheet 1 dimension.jpeg
  - Andaaz bedsheet 2.jpeg
  - Andaaz bedsheet 2 dimesion.jpeg

### 2. Discharge
- Location: `/products/king size/Discharge/`
- Images: 4
  - Discharge type 1.jpeg
  - Discharge type 1 dimension.jpeg
  - Discharge type 2.jpeg
  - Discharge type 2 dimension.jpeg

### 3. Double Dhamaal King Size Reversable
- Location: `/products/king size/double dhamaal king size reversable/`
- Subfolders: type 1, type 2
- Images: 4
  - Type 1: 2 images
  - Type 2: 2 images

### 4. Double Duty King Size Reversable
- Location: `/products/king size/Double duty king size reversable/`
- Subfolders: type 1, type 2
- Images: 4
  - Type 1: 2 images
  - Type 2: 2 images

### 5. Florida
- Location: `/products/king size/Florida/`
- Images: 2
  - light grey and white.jpeg
  - light grey and white diension.jpeg

### 6. Maharaja
- Location: `/products/king size/Maharaja/`
- Images: 6
  - maharaj type 1.jpeg + dimension
  - Maharaja type 2.jpeg + dimension
  - maharaja type 3.jpeg + dimension

### 7. Ombre King Size
- Location: `/products/king size/ombre king size/`
- Images: Variable

### 8. Oxford
- Location: `/products/king size/Oxford/`
- Images: Variable

### 9. Rose Wood
- Location: `/products/king size/Rose Wood/`
- Images: Variable

### 10. Volla Emboss King (King Size)
- Location: `/products/king size/volla emboss king (king size)/`
- Images: Variable

---

## 📁 QUEEN SIZE COLLECTIONS (4 Collections)

### 1. Kalamkari
- Location: `/products/Queen size/kalamkari/`
- Images: Variable

### 2. Meraki
- Location: `/products/Queen size/meraki/`
- Images: 4
  - meraki type 1.jpeg
  - meraki type 1 dimension.jpeg
  - meraki type 2.jpeg
  - meraki type 2 dimension.jpeg

### 3. Vibes
- Location: `/products/Queen size/vibes/`
- Images: 2
  - vibes type 1.jpeg
  - vibes type 1 dimension.jpeg

### 4. Volla (Divine)
- Location: `/products/Queen size/volla ( divine )/`
- Images: Variable

---

## Usage in Frontend

### Next.js Public Path
Images are accessible at:
```
/products/king size/Andaaz/Andaaz bedsheet 1.jpeg
/products/Queen size/meraki/meraki type 1.jpeg
```

### Example Component Usage
```tsx
<Image
  src="/products/king size/Maharaja/maharaj type 1.jpeg"
  alt="Maharaja King Size Bedsheet"
  width={800}
  height={600}
/>
```

### Product Data Integration
Update `backend/src/data/products.json` or frontend product data with actual image paths:

```json
{
  "id": "maharaja-type-1",
  "name": "Maharaja King Size",
  "images": [
    "/products/king size/Maharaja/maharaj type 1.jpeg",
    "/products/king size/Maharaja/Maharaj type 1 dimension.jpeg"
  ],
  "size": "King",
  "collection": "Maharaja"
}
```

---

## Next Steps

1. ✅ Images successfully imported to `public/products/`
2. 🔄 Update backend product database with correct image paths
3. 🔄 Update frontend product catalog to display real images
4. 🔄 Add image optimization (Next.js Image component)
5. 🔄 Create image gallery component for dimension views

---

## File Structure
```
public/
  products/
    ├── king size/
    │   ├── Andaaz/
    │   ├── Discharge/
    │   ├── double dhamaal king size reversable/
    │   ├── Double duty king size reversable/
    │   ├── Florida/
    │   ├── Maharaja/
    │   ├── ombre king size/
    │   ├── Oxford/
    │   ├── Rose Wood/
    │   └── volla emboss king (king size)/
    └── Queen size/
        ├── kalamkari/
        ├── meraki/
        ├── vibes/
        └── volla ( divine )/
```

## Status
🟢 **ALL IMAGES SUCCESSFULLY IMPORTED**

Total Collections: 14 (10 King + 4 Queen)
Total Images: 50+ high-quality product photos
Ready for: Frontend integration
