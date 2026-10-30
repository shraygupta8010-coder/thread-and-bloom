import { CATALOG_PRODUCTS, CatalogProduct } from '@/data/catalog';

export interface BlanketProduct {
  id: string;
  name: string;
  collection: string;
  subtitle: string;
  category: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity?: number;
  threadCount?: string;
  gsm?: string;
  fabricType: string;
  design: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: ('Queen' | 'King')[];
  sizePrices: {
    Queen: number;
    King: number;
  };
  originalPrices: {
    Queen: number;
    King: number;
  };
  description: string;
  badge?: string;
  collectionTier?: 'ATELIER' | 'ELITE' | 'ROYAL' | 'FESTIVE';
  series?: string;
  brand?: string;
  pieces?: number;
}

export const BLANKETS_CATALOG: BlanketProduct[] = CATALOG_PRODUCTS.map((p: CatalogProduct) => {
  const queenPrice = p.sizePrices?.Queen || p.price;
  const kingPrice = p.sizePrices?.King || Math.round(p.price * 1.2);
  const queenOriginal = p.originalPrice ? Math.round(p.originalPrice * 0.9) : Math.round(queenPrice * 1.25);
  const kingOriginal = p.originalPrice || Math.round(kingPrice * 1.25);

  // Use product's actual sizes - NO DEFAULT FALLBACK
  const sizesFormatted: ('Queen' | 'King')[] =
    Array.isArray(p.sizes) && p.sizes.length > 0
      ? (p.sizes.filter((s) => s === 'Queen' || s === 'King') as ('Queen' | 'King')[])
      : [];

  // If no valid sizes, skip this product or use what's in the data
  const effectiveSizes = sizesFormatted.length > 0 ? sizesFormatted : (p.sizes as ('Queen' | 'King')[]) || [];

  return {
    id: p.id,
    name: p.name,
    collection: p.collection || 'ATELIER',
    subtitle: p.subtitle || `${p.pieces ? `${p.pieces}pc Set • ` : ''}${p.category}`,
    category: p.category,
    rating: p.rating || 4.8,
    reviewsCount: p.reviewsCount || 47,
    inStock: p.stockQuantity > 0,
    stockQuantity: p.stockQuantity,
    pieces: p.pieces,
    threadCount: '400 TC',
    fabricType: p.category.includes('Comforter')
      ? 'Micro-Cluster Fiber 450 GSM'
      : '100% Long-Staple Egyptian Cotton',
    design: p.category.includes('Bedding') ? 'Festive Suite' : 'Textured Weave',
    images:
      p.images && p.images.length > 0
        ? p.images
        : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
    colors: p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Ivory White', hex: '#FFFFF0' }],
    sizes: effectiveSizes,
    sizePrices: {
      Queen: queenPrice,
      King: kingPrice,
    },
    originalPrices: {
      Queen: queenOriginal,
      King: kingOriginal,
    },
    description: p.description,
    badge: p.badge,
    collectionTier: p.collectionTier,
    series: p.series,
    brand: p.brand,
  };
});
