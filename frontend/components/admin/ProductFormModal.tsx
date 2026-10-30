'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductItem, createProductApi, updateProductApi, uploadImageApi } from '@/lib/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminKey: string;
  initialProduct?: ProductItem | null;
  onSaved: (savedProduct: ProductItem, isNew: boolean) => void;
}

const CATEGORIES = ['Comforters', 'Blankets', 'Bedsheets', 'Towels', 'Duvets', 'Bedding Sets'];

export default function ProductFormModal({
  isOpen,
  onClose,
  adminKey,
  initialProduct,
  onSaved,
}: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [collection, setCollection] = useState('EXCLUSIVE');
  const [category, setCategory] = useState('Comforters');
  const [price, setPrice] = useState(5999);
  const [originalPrice, setOriginalPrice] = useState(7499);
  const [stockQuantity, setStockQuantity] = useState(30);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('New Arrival');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState('');
  const [sizesText, setSizesText] = useState('Queen, King');
  const [queenPrice, setQueenPrice] = useState(4899);
  const [kingPrice, setKingPrice] = useState(5999);
  const [colorsText, setColorsText] = useState('Crisp White: #FFFFFF, Slate Grey: #778899');
  const [weightKg, setWeightKg] = useState(2.2);
  const [dimensionsCm, setDimensionsCm] = useState('40x30x12');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setSubtitle(initialProduct.subtitle || '');
      setCollection(initialProduct.collection || 'EXCLUSIVE');
      setCategory(initialProduct.category || 'Comforters');
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice || Math.round(initialProduct.price * 1.25));
      setStockQuantity(initialProduct.stockQuantity);
      setDescription(initialProduct.description || '');
      setBadge(initialProduct.badge || '');
      setSku(initialProduct.sku || '');
      setImageUrl(initialProduct.images?.[0] || '');
      setAdditionalImages(initialProduct.images?.slice(1).join(', ') || '');
      setSizesText(initialProduct.sizes?.join(', ') || 'Queen, King');
      setQueenPrice(initialProduct.sizePrices?.Queen || initialProduct.price);
      setKingPrice(initialProduct.sizePrices?.King || Math.round(initialProduct.price * 1.2));
      setColorsText(
        initialProduct.colors?.map((c) => `${c.name}: ${c.hex}`).join(', ') ||
          'Crisp White: #FFFFFF, Slate Grey: #778899'
      );
      setWeightKg(initialProduct.weight_kg || 2.2);
      setDimensionsCm(initialProduct.dimensions_cm || '40x30x12');
    } else {
      setName('');
      setSubtitle('Artisanal Luxury Microfiber');
      setCollection('EXCLUSIVE');
      setCategory('Comforters');
      setPrice(5999);
      setOriginalPrice(7499);
      setStockQuantity(30);
      setDescription(
        'Woven from premium long-staple fibers with plush thermal loft. Crafted for Indian climate versatility.'
      );
      setBadge('New Arrival');
      setSku(`TB-COMF-${Math.floor(1000 + Math.random() * 9000)}`);
      setImageUrl(
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
      );
      setAdditionalImages(
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDoE8LjfXXFkYXhNHSDA5eG5Zl5UufVOxxGDNrYXDm3hCHizb8nVKCMmE5IHjoYBtSpufflJRoT5re5fUKwzEoGTQqQV8mqkki-bHO7fn0_ax7NPl2Ci7MYOskGMN1oTpqj5_laH-91JTgte9jaTDfwkWKIBKTh1dNpi8RviFVpe5tNqUA23-tzb3gym5B4wevzQXmQvVpSOP0dTRq8R1e5P3mkd1f0vlV8TzvmGQ-G3Aj37KqEkNAX'
      );
      setSizesText('Queen, King');
      setQueenPrice(4899);
      setKingPrice(5999);
      setColorsText('Crisp White: #FFFFFF, Slate Grey: #778899');
      setWeightKg(2.4);
      setDimensionsCm('42x32x15');
    }
    setError(null);
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);
    try {
      const result = await uploadImageApi(file, { adminKey: adminKey || undefined });
      if (result.success && result.file?.url) {
        setImageUrl(result.file.url);
      } else {
        setUploadError(result.error || result.message || 'Upload failed. Please try again.');
      }
    } catch {
      setUploadError('Network error while uploading. Check backend is running.');
    } finally {
      setIsUploading(false);
      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a valid product title/name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Parse image list
    const images: string[] = [imageUrl.trim()].filter(Boolean);
    if (additionalImages.trim()) {
      additionalImages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((img) => {
          if (!images.includes(img)) images.push(img);
        });
    }

    // Parse sizes
    const sizes = sizesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Build sizePrices map
    const sizePrices: Record<string, number> = {};
    sizes.forEach((sz) => {
      if (sz.toLowerCase().includes('queen')) sizePrices[sz] = Number(queenPrice);
      else if (sz.toLowerCase().includes('king')) sizePrices[sz] = Number(kingPrice);
      else sizePrices[sz] = Number(price);
    });

    // Parse colors
    const colors = colorsText
      .split(',')
      .map((c) => {
        const parts = c.split(':');
        return {
          name: parts[0]?.trim() || 'Ivory',
          hex: parts[1]?.trim() || '#FFFFFF',
        };
      })
      .filter((c) => Boolean(c.name));

    const payload: Partial<ProductItem> = {
      name: name.trim(),
      subtitle: subtitle.trim(),
      collection: collection.trim(),
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      stockQuantity: Number(stockQuantity),
      description: description.trim(),
      badge: badge.trim(),
      sku: sku.trim().toUpperCase() || `TB-${category.substring(0, 3).toUpperCase()}-NEW`,
      hsn: '6302',
      weight_kg: Number(weightKg),
      dimensions_cm: dimensionsCm.trim(),
      images,
      sizes,
      sizePrices,
      colors,
    };

    try {
      if (initialProduct?.id) {
        // Update existing
        const res = await updateProductApi(adminKey, initialProduct.id, payload);
        if (res.success && res.product) {
          onSaved(res.product, false);
          onClose();
        } else {
          setError(res.message || 'Failed to update product catalog.');
        }
      } else {
        // Create new
        const res = await createProductApi(adminKey, payload);
        if (res.success && res.product) {
          onSaved(res.product, true);
          onClose();
        } else {
          setError(res.message || 'Failed to publish new product to storefront.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Network error while contacting admin catalog API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface-container border border-outline-variant/80 w-full max-w-3xl my-8 p-6 sm:p-8 shadow-2xl relative text-on-surface max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface transition-colors p-1"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="mb-6 pb-4 border-b border-outline-variant/50">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-1">
            Storefront Catalog CMS &amp; Stock Manager
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-on-surface">
            {initialProduct ? `Edit Product: ${initialProduct.name}` : 'Add New Product to Storefront'}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Products saved here will instantly become available for shoppers to browse, customize, and purchase across the website.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Row 1: Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Imperial Silk Comforter"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Subtitle / Spec Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 450 GSM Micro-Cluster Fiber"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
              />
            </div>
          </div>

          {/* Row 2: Category, Collection, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2.5 text-on-surface outline-none focus:border-on-surface"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Collection
              </label>
              <input
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="e.g. VEGA, PRISTINE, ATELIER"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Highlight Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, New Arrival"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
              />
            </div>
          </div>

          {/* Row 3: Pricing & Stock Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-low p-4 border border-outline-variant/60">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Original / MRP Price (₹)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Stock Quantity (Units) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono font-bold text-[#E6C594]"
              />
            </div>
          </div>

          {/* Row 4: Sizes and Size Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizesText}
                onChange={(e) => setSizesText(e.target.value)}
                placeholder="Queen, King"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Queen Size Price (₹)
              </label>
              <input
                type="number"
                value={queenPrice}
                onChange={(e) => setQueenPrice(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                King Size Price (₹)
              </label>
              <input
                type="number"
                value={kingPrice}
                onChange={(e) => setKingPrice(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
          </div>

          {/* Row 5: Colors */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
              Colors (Format: Name: #HEX, Name: #HEX)
            </label>
            <input
              type="text"
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="Crisp White: #FFFFFF, Slate Grey: #778899"
              className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
            />
          </div>

          {/* Row 6: Primary Image — File Upload OR URL */}
          <div className="space-y-3">
            <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant">
              Primary Image *
            </label>

            {/* Upload error banner */}
            {uploadError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-500 text-[11px] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{uploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              <div className="sm:col-span-3 space-y-3">
                {/* Hidden real file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {/* Drag-and-drop / click zone */}
                <button
                  type="button"
                  disabled={isUploading || isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-outline-variant hover:border-[#E6C594]/60 bg-surface-container-lowest py-4 flex flex-col items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined text-[#E6C594] text-2xl animate-spin">progress_activity</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Scanning & uploading…</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-[#E6C594] text-2xl transition-colors">cloud_upload</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Upload Image — JPG / PNG / WebP · Max 5 MB
                      </span>
                      <span className="text-[9px] text-outline-variant">OWASP magic-byte verified &amp; malware scanned</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-outline-variant/40" />
                  <span className="text-[9px] uppercase tracking-widest text-outline-variant">or paste URL</span>
                  <div className="flex-1 h-px bg-outline-variant/40" />
                </div>

                {/* Primary URL input */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                    Primary Image URL (HTTPS)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => { setImageUrl(e.target.value); setUploadError(null); }}
                    placeholder="https://…"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
                  />
                </div>

                {/* Additional image URLs */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                    Additional Image URLs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={additionalImages}
                    onChange={(e) => setAdditionalImages(e.target.value)}
                    placeholder="https://…, https://…"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface"
                  />
                </div>
              </div>

              {/* Preview thumbnail */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-semibold text-on-surface-variant mb-1">Preview</span>
                <div className="w-24 h-24 border border-outline-variant/60 bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-outline-variant text-3xl">image</span>
                  )}
                </div>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => { setImageUrl(''); setUploadError(null); }}
                    className="mt-1.5 text-[9px] uppercase tracking-wider text-outline-variant hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Row 7: Logistics Metadata (SKU, Weight, Dimensions) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="TB-COMF-450G"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Dead Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
                Box Dimensions (LxWxH cm)
              </label>
              <input
                type="text"
                value={dimensionsCm}
                onChange={(e) => setDimensionsCm(e.target.value)}
                placeholder="42x32x15"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-on-surface outline-none focus:border-on-surface font-mono"
              />
            </div>
          </div>

          {/* Row 8: Description */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[10px] text-on-surface-variant mb-1">
              Craftsmanship &amp; Material Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the fabric count, weaving technique, warmth factor, and wash care..."
              className="w-full bg-surface-container-lowest border border-outline-variant p-3.5 text-on-surface outline-none focus:border-on-surface resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-outline-variant/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors font-semibold uppercase tracking-wider text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#E6C594] text-[#12100E] font-bold uppercase tracking-wider text-xs hover:bg-[#d4b07d] transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              <span>{initialProduct ? 'Update & Sync Product' : 'Publish to Storefront'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
