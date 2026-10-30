import { ProductItem } from '@/lib/api';
import { ComforterProduct } from '@/data/comfortersCatalog';
import { BlanketProduct } from '@/data/blanketsCatalog';

export function adaptToComforter(item: ProductItem): ComforterProduct {
  const queenPrice = item.sizePrices?.Queen || item.price;
  const kingPrice = item.sizePrices?.King || Math.round(item.price * 1.2);
  const queenOriginal = Math.round(queenPrice * 1.25);
  const kingOriginal = Math.round(kingPrice * 1.25);

  return {
    id: item.id,
    name: item.name,
    collection: item.collection || 'VEGA',
    subtitle: item.subtitle || `${item.category.toUpperCase()} COLLECTION`,
    category: item.category.toLowerCase().includes('winter') ? 'Winter Comforters' : 'All-Season Comforters',
    rating: item.rating || 4.9,
    reviewsCount: item.reviewsCount || 45,
    inStock: item.stockQuantity > 0,
    gsm: '450 GSM',
    fillType: 'Hypoallergenic Micro-Cluster Fiber',
    shellFabric: '100% Long-Staple Cotton 300 TC',
    stitchPattern: 'Baffle Box Stitch',
    warmthLevel: 'Deep Winter',
    images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'],
    colors: item.colors && item.colors.length > 0 ? item.colors : [{ name: 'Crisp White', hex: '#FFFFFF' }],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: queenPrice,
      King: kingPrice,
    },
    originalPrices: {
      Queen: queenOriginal,
      King: kingOriginal,
    },
    description: item.description || 'Artisanal comforter engineered for breathable warmth.',
    badge: item.badge || (item.stockQuantity <= 10 ? 'Low Stock' : undefined),
    stockQuantity: item.stockQuantity,
    collectionTier: item.collectionTier || (item.badge?.includes('ELITE') ? 'ELITE' : item.badge?.includes('ROYAL') ? 'ROYAL' : item.badge?.includes('DIWALI') ? 'FESTIVE' : 'ATELIER'),
    series: item.series,
    brand: item.brand,
    pieces: item.pieces,
  };
}

export function adaptToBlanket(item: ProductItem): BlanketProduct {
  const queenPrice = item.sizePrices?.Queen || item.price;
  const kingPrice = item.sizePrices?.King || Math.round(item.price * 1.2);
  const queenOriginal = Math.round(queenPrice * 1.25);
  const kingOriginal = Math.round(kingPrice * 1.25);

  // Use actual sizes from item, filter to only Queen/King
  const actualSizes = (item.sizes || []).filter((s: string) => s === 'Queen' || s === 'King') as ('Queen' | 'King')[];

  return {
    id: item.id,
    name: item.name,
    collection: item.collection || 'PRISTINE',
    subtitle: item.subtitle || `${item.category.toUpperCase()} COLLECTION`,
    category: item.category,
    rating: item.rating || 4.9,
    reviewsCount: item.reviewsCount || 60,
    inStock: item.stockQuantity > 0,
    stockQuantity: item.stockQuantity,
    pieces: item.pieces,
    threadCount: '400 TC',
    fabricType: 'Egyptian Cotton & Microfleece',
    design: 'Textured Weave',
    images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80'],
    colors: item.colors && item.colors.length > 0 ? item.colors : [],
    sizes: actualSizes.length > 0 ? actualSizes : ['King'], // Fallback to King only if no sizes
    sizePrices: {
      Queen: queenPrice,
      King: kingPrice,
    },
    originalPrices: {
      Queen: queenOriginal,
      King: kingOriginal,
    },
    description: item.description || 'Rich texture and luxurious warmth for cold nights.',
    badge: item.badge || (item.stockQuantity <= 10 ? 'Low Stock' : undefined),
    collectionTier: item.collectionTier || (item.badge?.includes('ELITE') ? 'ELITE' : item.badge?.includes('ROYAL') ? 'ROYAL' : item.badge?.includes('DIWALI') ? 'FESTIVE' : 'ATELIER'),
    series: item.series,
    brand: item.brand,
  };
}
