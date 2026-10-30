export interface CartItem {
  id: string;
  productId: string;
  name: string;
  collection: string;
  subtitle: string;
  size: string;
  colorName: string;
  colorHex?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
}
