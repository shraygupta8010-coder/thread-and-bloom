import { ProductItem } from '@/lib/api';

// ─── Tier & Series Types ────────────────────────────────────────────────────
export type CollectionTier = 'ATELIER' | 'ELITE' | 'ROYAL' | 'FESTIVE';

export type SeriesName =
  | 'Atelier Standard'
  | 'Elite Premium'
  | 'Royal Line'
  | 'Festive Editions';

// ─── Extended Interface ─────────────────────────────────────────────────────
export interface CatalogProduct extends ProductItem {
  collectionTier: CollectionTier;
  series: string;
  pieces: number;
  brand?: string;
}

// ─── Catalog ────────────────────────────────────────────────────────────────
// Static catalog removed - All products now loaded from Supabase database
// Only 25 real products from D:\database of the bedsheet\ are in the database
export const CATALOG_PRODUCTS: CatalogProduct[] = [];
