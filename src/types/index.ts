// export interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   image: string;
//   rating: number;
//   reviews?: number;
//   category: string;
//   subcategory?: string;
//   inStock: boolean;
//   stockCount?: number;
//   description?: string;
//   features?: string[];
//   specifications?: Record<string, string|undefined>;
// }

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  subcategories?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  language: string;
  preferences?: {
    categories: string[];
    priceRange: [number, number];
  };
}

export interface CheckoutForm {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMode: 'cod' | 'card' | 'upi' | 'wallet';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CheckoutForm;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface UserActivity {
  searchQueries: string[];
  viewedProducts: Product[];
  clickedCategories: string[];
  lastActivity: Date;
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  original_price: number;     // ✅ update this
  stock_count: number;
  in_stock: boolean;          // ✅ update this
  image_url: string;          // ✅ update this
  gallery: string[];
  rating: number;
  reviews: number;
  features: string[];
  specifications: Record<string, string>;
  tags: string[];
  created_at: string;
  updated_at: string;
};
