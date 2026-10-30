// Thread & Bloom — Central data file
// Swap HERO_VIDEO_URL to update the hero video filename globally.
export const HERO_VIDEO_URL = '/videos/brand-video.mp4';

export interface CollectionCard {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  image: string;
}

export interface ProductCard {
  id: string;
  title: string;
  collection: string;
  image: string;
  variant: string;
  pieces?: number;
  stock?: number;
  price?: number;
  badge?: string;
}

export interface CartItemData {
  id: string;
  title: string;
  variant: string;
  image: string;
}

export const COLLECTIONS: CollectionCard[] = [
  {
    id: 'blankets',
    eyebrow: 'Artisan Atelier & Bedsheets',
    title: 'King & Queen Bedsheets',
    description: '100% Egyptian Cotton, Atelier Standard and Elite Signature 2pc, 3pc & 4pc suites.',
    cta: 'Explore Bedsheets & Blankets',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'comforters',
    eyebrow: 'Down-Alternative Slumber',
    title: 'Luxury Comforters & Dohars',
    description: 'Crimson AC Dohars, Raks Plain, and Sliqe Designer Comforters encased in 300 TC shells.',
    cta: 'Explore Comforters',
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'towels',
    eyebrow: 'Diwali Festive & Bed-in-a-Bag',
    title: 'Festive Suites & 5pc Sets',
    description: 'Volla Vantara, Crimson Ornate, Signature Fiesta, and Layer Shagun festive bedding.',
    cta: 'Explore Festive Sets',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  },
];

export const NEW_ARRIVALS_FEATURE: ProductCard = {
  id: 'TB-KBS-VOLLA-CLS',
  title: 'Volla Classic King Bedsheet Set',
  collection: 'Atelier Standard',
  variant: 'ATELIER / King / Ivory White',
  image:
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  pieces: 2,
  stock: 60,
  price: 2499,
  badge: 'CLASSIC ATELIER',
};

export const NEW_ARRIVALS_GRID: ProductCard[] = [
  {
    id: 'TB-FEST-SIG-FIE',
    title: 'Signature Fiesta 4-Piece Festive Set',
    collection: 'Diwali Special',
    variant: 'FESTIVE / King / Festive Saffron',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    pieces: 4,
    stock: 20,
    price: 6499,
    badge: 'DIWALI SPECIAL',
  },
  {
    id: 'TB-KBS-MHRJ',
    title: 'Maharaja King 3-Piece Suite',
    collection: 'Atelier Series',
    variant: 'ATELIER / King / Royal Gold',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    pieces: 3,
    stock: 25,
    price: 3999,
    badge: 'CLASSIC ATELIER',
  },
  {
    id: 'TB-KBS-CRM-ELT',
    title: 'Crimson Elite King 4-Piece Bedding',
    collection: 'Elite Premium',
    variant: 'ELITE / King / Royal Crimson',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    pieces: 4,
    stock: 18,
    price: 5699,
    badge: 'ELITE SIGNATURE',
  },
  {
    id: 'TB-COMF-SLQ-DSG',
    title: 'Sliqe Designer Comforter Double',
    collection: 'Royal Line',
    variant: 'ROYAL / Double / Designer Black',
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    pieces: 1,
    stock: 18,
    price: 5499,
    badge: 'STERLING EDITION',
  },
];

export const TOP_SELLING: ProductCard[] = [
  {
    id: 'TB-KBS-DHDH',
    title: 'Double Dhamaal King 4-Piece Set',
    collection: 'Atelier Series',
    variant: 'ATELIER / King / Crimson Red',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    pieces: 4,
    stock: 35,
    price: 3499,
    badge: 'CLASSIC ATELIER',
  },
  {
    id: 'TB-KBS-SPSH',
    title: 'Super Shine King 3-Piece Bedsheet',
    collection: 'Elite Premium',
    variant: 'ELITE / King / Pearl White',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    pieces: 3,
    stock: 28,
    price: 4299,
    badge: 'ELITE SIGNATURE',
  },
  {
    id: 'TB-BIAB-CRM-STD',
    title: 'Crimson Standard 5-Piece Bedding Suite',
    collection: 'Atelier Sets',
    variant: 'ATELIER / King / Classic Crimson',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    pieces: 5,
    stock: 28,
    price: 4499,
    badge: 'CLASSIC ATELIER',
  },
  {
    id: 'TB-BIAB-VNT',
    title: 'Volla Vantara 4-Piece Bed-in-a-Bag',
    collection: 'Atelier Sets',
    variant: 'ATELIER / King / Vanilla Cream',
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    pieces: 4,
    stock: 22,
    price: 5999,
    badge: 'CLASSIC ATELIER',
  },
  {
    id: 'TB-DOHAR-CRM-AC',
    title: 'Crimson AC Dohar Double 2-Piece',
    collection: 'Elite Dohar',
    variant: 'ELITE / Double / Crimson',
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    pieces: 2,
    stock: 30,
    price: 3299,
    badge: 'ELITE SIGNATURE',
  },
  {
    id: 'TB-FEST-SIG-SHR',
    title: 'Signature Shiraz King 2-Piece Bedsheet',
    collection: 'Festive Editions',
    variant: 'FESTIVE / King / Shiraz Wine',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    pieces: 2,
    stock: 21,
    price: 4299,
    badge: 'DIWALI SPECIAL',
  },
];

export const INITIAL_CART_ITEMS: CartItemData[] = [
  {
    id: 'cart-1',
    title: 'Ultra-Soft Fleece Velvet Blanket',
    variant: 'Camel Tan / Double Size',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBz0e690py1VcSuuQ8cFdIMM6W-Amra7rOMtMlkDUolBeV_c2w1epFHI4t399sBfJa7PX4Yc3UY7bB5alngrElknGoC6XWaq-SZ0Ihn_BFxeFOnQQVWJxa48c2-agNO0z80rEkBNYM0duRdBc7eZAxcPmblnMM7koGrM58kJ7Uby8hAw4r3ZEfssEI2cndat4cqKfHDSyhu9ByQU-YAPwoN0zqRB1BBopZo3pfK0gqurltVHr5Tsxio',
  },
  {
    id: 'cart-2',
    title: 'Luxury Cotton Towel Set (4-Piece)',
    variant: 'Warm Biscuit / 600 GSM',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8fAtlsx-IZGjPJg1DwQKwrnlWg6E98GTM7zGcRN9IZ7is62l5YNZd2lqe7f7uUCELtHs1A92X7DwQlXdeuleayDGJ_CBblCJ0JOxCol80S4x2qhEhgTH_t92zxlZ13h6ggTF7zd0Ui4528QyO8J5QARcF4RlJw4MT5xIvxqjkk13WN62uC9iAUmt5MU6naaAb7S5fXLXZe-MTl7PFEUtq5pPtEV-evC0uuxi5aMD527Kvk2U2zvLI',
  },
];
