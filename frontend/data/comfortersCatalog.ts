export interface ComforterProduct {
  id: string;
  name: string;
  collection: string;
  subtitle: string;
  category: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  gsm?: string;
  fillType: string;
  shellFabric: string;
  stitchPattern: string;
  warmthLevel: 'All-Season' | 'Winter Warmth' | 'Deep Winter';
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
  stockQuantity?: number;
}

export const COMFORTERS_CATALOG: ComforterProduct[] = [
  {
    id: 'prism-heavy-weight-winter-comforter',
    name: 'Prism Heavy-Weight Winter Comforter',
    collection: 'VEGA',
    subtitle: '450 GSM DOWN-ALTERNATIVE CLUSTER FILL',
    category: 'Winter Comforters',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    gsm: '450 GSM',
    fillType: 'Hypoallergenic Micro-Cluster Fiber',
    shellFabric: '100% Long-Staple Cotton 300 TC',
    stitchPattern: 'Baffle Box Stitch',
    warmthLevel: 'Deep Winter',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoE8LjfXXFkYXhNHSDA5eG5Zl5UufVOxxGDNrYXDm3hCHizb8nVKCMmE5IHjoYBtSpufflJRoT5re5fUKwzEoGTQqQV8mqkki-bHO7fn0_ax7NPl2Ci7MYOskGMN1oTpqj5_laH-91JTgte9jaTDfwkWKIBKTh1dNpi8RviFVpe5tNqUA23-tzb3gym5B4wevzQXmQvVpSOP0dTRq8R1e5P3mkd1f0vlV8TzvmGQ-G3Aj37KqEkNAX',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Oatmeal Taupe', hex: '#D2C1AC' },
      { name: 'Slate Grey', hex: '#778899' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 4899,
      King: 5999,
    },
    originalPrices: {
      Queen: 6499,
      King: 7999,
    },
    description:
      'Engineered for deep winter restorative sleep. 450 GSM micro-cluster filling encased in an ultra-breathable 300 TC cotton sateen shell with corner duvet anchor loops.',
    badge: 'Bestseller',
  },
  {
    id: 'cloud-loft-all-season-duvet',
    name: 'Cloud-Loft All-Season Microfiber Comforter',
    collection: 'PRISTINE',
    subtitle: '300 GSM LIGHTWEIGHT TEMPERATURE BALANCING',
    category: 'All-Season Comforters',
    rating: 4.8,
    reviewsCount: 98,
    inStock: true,
    gsm: '300 GSM',
    fillType: 'Ultra-Fine Down-Alternative',
    shellFabric: 'Silky Washed Microfiber Percale',
    stitchPattern: 'End-to-End Box Stitch',
    warmthLevel: 'All-Season',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzIfMBS5lc8iHrkzAevTVdmQF9MJHIC1sFaVp9l4lBx9OkLeQGPkc4i4rbMqKKFg2Qmi0NOeCP03dpNBrU0lAqxYqZK-YAnEMkYYH2hJJ7SnwOCSDwxY1NAcU0WS9nXVIlvDB5g7BV7RYyKPKz6g4FhXfbNyJBuiPxcFLzwL5DuQYR4MhoqX2G5SQzLb52mc9oOjvsq1dgCSqdQnfyaWHhHMIFRmBdBf9YQyNp9c7EGa6_P2ulLFJI',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Ivory Frost', hex: '#FDFBF7' },
      { name: 'Charcoal Mist', hex: '#4A4A4A' },
      { name: 'Desert Sand', hex: '#C2B280' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 3299,
      King: 4199,
    },
    originalPrices: {
      Queen: 4599,
      King: 5599,
    },
    description:
      'Versatile 300 GSM all-season comforter designed for air-conditioned bedrooms and year-round thermal equilibrium. No clumping or shifting with precision box quilting.',
    badge: 'Trending',
  },
  {
    id: 'elantra-reversible-two-tone-quilt',
    name: 'Elantra Reversible Two-Tone Comforter',
    collection: 'ELANTRA',
    subtitle: 'DUAL-SHADE REVERSIBLE BEDSPREAD QUILT',
    category: 'Reversible Comforters',
    rating: 5.0,
    reviewsCount: 175,
    inStock: true,
    gsm: '380 GSM',
    fillType: 'Hypoallergenic Virgin Microfiber',
    shellFabric: 'Peach-Finished Hydrophobic Fabric',
    stitchPattern: 'Diamond Quilted Grid',
    warmthLevel: 'Winter Warmth',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6on4BSe6TuOypgaQnNQU_fyK1zJVcGV9SjazM3QmO15QYfE3Wtr5E5i7yklDhTaqQErTT-R-cFP57ztgsMNMlOlOaUEaMpe1fMyfK3Af-3CtE5b56TBKM1wdj9c3CIX2x14cf7i5mjMxaXOAinLx5Yu4FHLw85OG0QpkgEMRgcmHvwu7VNlHAOdT4LTyw4EiNrLWslcYvi5HPkdP95vwSL1JQoP5TB4_xKBx6erMEc-afxYWILTG1',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Oatmeal & Mocha', hex: '#D7C4A5' },
      { name: 'Slate & Navy', hex: '#3B3F46' },
      { name: 'Sage & Olive', hex: '#8F9779' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 3999,
      King: 4999,
    },
    originalPrices: {
      Queen: 5499,
      King: 6799,
    },
    description:
      'Two elegant bedroom styles in one reversible comforter. Peach-finished velvety soft outer layer filled with 380 GSM plush microfiber for hotel-luxury slumber.',
    badge: 'Luxury Edit',
  },
  {
    id: 'omega-quilted-hotel-duvet',
    name: 'Omega Quilted 400 TC Hotel Duvet Insert',
    collection: 'OMEGA',
    subtitle: 'PREMIUM HOTEL DUVET WITH 8-POINT CORNER TIES',
    category: 'Winter Comforters',
    rating: 4.9,
    reviewsCount: 110,
    inStock: true,
    gsm: '400 GSM',
    fillType: 'Microfiber Goose-Down Alternative',
    shellFabric: '100% Egyptian Cotton Damask Sateen',
    stitchPattern: 'Framed Baffle Box',
    warmthLevel: 'Deep Winter',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLbSH2OgFEP6lwHRhfrUIore_HjPnbQ4woMZFkU4BnI3jX6PzRzN-RT3yiOTKEq78nhi-C4oijRb9a_O61CPpijd4Tfj7MAiHu5RR5LDraP33gCBbvO3_wEWdsyRIXhLM5Zl1MXtiYkjQkDhx6Gh3Exxk0JXCSRS7cqXQEZUuGKBpMYsCV88KoTFd-0S-RJFEfUOE4GKxJVvJsQV4wJNi2P1D3xY9TeqmaS26MI1lZRZFmarNGzCf1',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Hotel White', hex: '#FFFFFF' },
      { name: 'Pearl Champagne', hex: '#F0EAD6' },
      { name: 'Silver Smoke', hex: '#DCDCDC' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 5499,
      King: 6899,
    },
    originalPrices: {
      Queen: 7499,
      King: 8999,
    },
    description:
      'Crafted to 5-star presidential suite standards with 400 TC damask sateen shell, double-piped border seams, and high-loft down-alternative thermal core.',
    badge: 'Hotel Luxury',
  },
  {
    id: 'spotlight-emerald-plush-comforter',
    name: 'Spotlight Emerald Velvet Mink Comforter',
    collection: 'SPOTLIGHT',
    subtitle: 'LUXURIOUS VELVET TOUCH HEAVY COMFORTER',
    category: 'Winter Comforters',
    rating: 4.8,
    reviewsCount: 84,
    inStock: true,
    gsm: '420 GSM',
    fillType: 'Microfiber Down Alternative',
    shellFabric: 'Velvet Mink Microfiber',
    stitchPattern: 'Channel Quilt',
    warmthLevel: 'Winter Warmth',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD672z5qlG1qkBMU8tkjA6URYpJs4xV5zLaNKKVwTcs1zkpCGMFEaOh734DXy7Wj-RwEWHUIUu74oVvFVWNdNksPr9t94Ukq8UaAerPY9bTpdGQ2VgNNKXdYPBJSj0GJLIuiNk3PigrY4VqynE2uDbwx2eoeISVX5HsevLxNDHAQ4GH1ma7xlDNpckg4PxUl8_-K2JHEUZNOPQQ3n116N18Dr_rme6osxcEUcodtt2pq-dNyJHWx0Dm',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Emerald Pine', hex: '#1C4432' },
      { name: 'Midnight Navy', hex: '#1B263B' },
      { name: 'Deep Wine', hex: '#581825' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 4299,
      King: 5299,
    },
    originalPrices: {
      Queen: 5999,
      King: 6999,
    },
    description:
      'Jewel-toned emerald velvet comforter with luminous handfeel, 420 GSM warming core, and piped border detailing for striking bedroom centerpieces.',
  },
  {
    id: 'primary-pure-cotton-mulmul-quilt',
    name: 'Primary Organic Mulmul All-Weather Comforter',
    collection: 'PRIMARY',
    subtitle: '100% ORGANIC MULMUL COTTON SHELL',
    category: 'All-Season Comforters',
    rating: 4.9,
    reviewsCount: 92,
    inStock: true,
    gsm: '280 GSM',
    fillType: 'Sustainably Sourced Microfiber',
    shellFabric: '100% Organic Mulmul Muslin',
    stitchPattern: 'Traditional Hand-Stitch Kantha Style',
    warmthLevel: 'All-Season',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOK82VKGeNCAKTbg3myL0EPbHY8tjD7wOxbVZLjpo6V2gnOK54j5nHLrzjhMwBEUGmbzzcSdxpTkPWjuaYSavhpA29rKpsddTX081cIuGYyK_JZdQlV4LQHKHJmsJ2Py5G6QUMll82dZCmEdheTyz9m1HMDK5ege07Sz8NxLWmVC8cs6qL4Ce-RAYbtEZzcZM6i3HenY5xCZrKIHS4WnCP3aEuPFwvjkpcVuLQEWkwBTKJxzEbBf9A',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Smoke Blue', hex: '#7798AB' },
      { name: 'Sage Green', hex: '#8DAA9D' },
      { name: 'Blush Terracotta', hex: '#D9C5B2' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 2999,
      King: 3799,
    },
    originalPrices: {
      Queen: 4199,
      King: 5199,
    },
    description:
      'Artisanal lightweight comforter wrapped in breathable double-layer organic mulmul. Feathery light weight that keeps you cool during summers and warm during mild winters.',
    badge: 'Organic Cotton',
  },
  {
    id: 'copper-tan-quilted-winter-comforter',
    name: 'Prism Copper Tan Quilted Comforter',
    collection: 'OMEGA',
    subtitle: 'BRUSHED MICROFIBER HEAVY SLEEP QUILT',
    category: 'Winter Comforters',
    rating: 4.7,
    reviewsCount: 77,
    inStock: true,
    gsm: '400 GSM',
    fillType: 'Virgin Hollowfiber Clusters',
    shellFabric: 'Brushed Microfiber Peach-Skin',
    stitchPattern: 'Geometric Double Stitch',
    warmthLevel: 'Winter Warmth',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXz-NnSOKsbmL88hBSwXib8W3WH1qPK9GVFKBplDnbx_kmsjpLPsHkmx_2mm8RioSCpdgJjs0YSLTqxGzF4LljapuOVceGz0DoM7WwVdBSOgp5fhJlyDf1-NqEDEA_bCUe12qupdCmK7KU5S6cGytDVBPeiNkljbVzRu5eAvc6DQiPqEJWDp-hgdjhfZaRrTf_z6jhFo5Q4nEwvoVnzFMNmUu-vQJiK82NeKgTqaB3v2pnIUbrJc6N',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Copper Tan', hex: '#BA7A56' },
      { name: 'Terracotta Rust', hex: '#9E4733' },
      { name: 'Charcoal Black', hex: '#262626' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 4699,
      King: 5799,
    },
    originalPrices: {
      Queen: 6299,
      King: 7799,
    },
    description:
      'Modern geometric stitched winter comforter in warm earthy copper tones. 400 GSM dense thermal retention that protects against cold drafts without heavy bulk.',
  },
  {
    id: 'waffle-texture-flannel-duvet',
    name: 'Nordic Waffle Texture Flannel Comforter',
    collection: 'ELANTRA',
    subtitle: 'TEXTURED AIR-POCKET CELLULAR WEAVE',
    category: 'All-Season Comforters',
    rating: 4.8,
    reviewsCount: 65,
    inStock: true,
    gsm: '350 GSM',
    fillType: 'Microfiber Down-Alternative',
    shellFabric: 'Waffle Weave & Brushed Cotton',
    stitchPattern: 'Cellular Waffle Grid',
    warmthLevel: 'All-Season',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByqUO7tVtTFPK7RdPPIpyQOlF6g4PuQXCnrhjKIbSOvh1ccFYSdyzhWyzJd5C1Iov_pRT-wfP_sEEc2sVloaoYb-DPcbMcT0-z0sw3id9ZyQSytTCtZTooo-aLW3rK5LCMgLoUPeLqC5J6aPIl4UewzONMjZqDqXt-7KaxZX3AuFxVJQ5SpBJ3Mp3RhHzM8fsm_-JEemDiDXvoN5SbmllMhghy3pc3k4PiXLzdh-HgQEZxA9DZ2W4k',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Charcoal Grey', hex: '#3B3F46' },
      { name: 'Stone Beige', hex: '#C2C5C8' },
      { name: 'Cream Ivory', hex: '#FAF5EE' },
    ],
    sizes: ['Queen', 'King'],
    sizePrices: {
      Queen: 3799,
      King: 4799,
    },
    originalPrices: {
      Queen: 4999,
      King: 6199,
    },
    description:
      'Honeycomb waffle surface creates natural insulating pockets. Filled with 350 GSM fluffy down-alternative fiber for breathable, year-round comfort.',
  },
];
