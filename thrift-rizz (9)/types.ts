export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  size: string;
  images: string[];
  stock?: number; // Added for inventory management
  createdAt: number;
}

export interface CartItem extends Product {
  cartId: string; // unique id for cart entry
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  zip?: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentMethod: 'COD' | 'Easypaisa_Jazzcash';
  createdAt: number;
}

export type ViewState = 'home' | 'product' | 'checkout' | 'success';