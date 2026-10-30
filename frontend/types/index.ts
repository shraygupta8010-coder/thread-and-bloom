export interface Product {
  id: string;
  name: string;
  category: 'Bedsheets' | 'Comforters' | 'Towels' | 'Blankets';
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  specs: {
    material: string;
    threadCount?: string;
    gsm?: string;
    fillType?: string;
    pocketDepth?: string;
    washCare: string;
  };
  badge?: 'Best Seller' | 'Limited Deal' | 'New' | '40% OFF';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  flat: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  tag: 'Home' | 'Work';
  isDefault: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  addresses: Address[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  orderDate: Date;
  estimatedDelivery: Date;
}
