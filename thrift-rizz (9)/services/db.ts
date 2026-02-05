import { Product, Order } from '../types';

// Mock User interface since we are not using firebase/auth anymore
export interface User {
  uid: string;
  email: string | null;
}

const PRODUCTS_KEY = 'thrift_products';
const ORDERS_KEY = 'thrift_orders';
const AUTH_KEY = 'thrift_auth';

// --- MOCK DATA HELPERS ---

const getLocal = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error parsing local storage", e);
    return [];
  }
};

const setLocal = (key: string, data: any[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error setting local storage", e);
  }
};

// Seed initial data if empty
if (getLocal(PRODUCTS_KEY).length === 0) {
    const initialProducts: Product[] = [
        {
            id: 'p1',
            name: 'Vintage Nike Windbreaker',
            price: 4500,
            description: 'Original 90s Nike windbreaker in excellent condition. Teal and purple colorway.',
            category: 'Jackets',
            size: 'L',
            images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop'],
            stock: 1,
            createdAt: Date.now()
        },
        {
            id: 'p2',
            name: 'Levis 501 Original',
            price: 3200,
            description: 'Classic Levis 501 jeans. Light wash, straight fit.',
            category: 'Bottoms',
            size: '32/32',
            images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop'],
            stock: 1,
            createdAt: Date.now() - 100000
        },
         {
            id: 'p3',
            name: 'Ralph Lauren Polo Bear Sweater',
            price: 5500,
            description: 'Iconic Polo Bear knit sweater. Navy blue. rare find.',
            category: 'Shirts',
            size: 'M',
            images: ['https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop'],
            stock: 1,
            createdAt: Date.now() - 200000
        }
    ];
    setLocal(PRODUCTS_KEY, initialProducts);
}

// --- PRODUCTS ---

export const getProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return getLocal<Product>(PRODUCTS_KEY).sort((a, b) => b.createdAt - a.createdAt);
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const products = getLocal<Product>(PRODUCTS_KEY);
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      stock: 1
    };
    products.unshift(newProduct);
    setLocal(PRODUCTS_KEY, products);
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};

// --- ORDERS ---

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  try {
    const orders = getLocal<Order>(ORDERS_KEY);
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'pending',
      createdAt: Date.now()
    };
    orders.unshift(newOrder);
    setLocal(ORDERS_KEY, orders);
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return getLocal<Order>(ORDERS_KEY).sort((a, b) => b.createdAt - a.createdAt);
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const orders = getLocal<Order>(ORDERS_KEY);
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    setLocal(ORDERS_KEY, orders);
  }
};

// --- AUTH UTILS (MOCK) ---

let authListeners: ((user: User | null) => void)[] = [];
let currentUser: User | null = null;

try {
  const storedAuth = localStorage.getItem(AUTH_KEY);
  if (storedAuth) {
    currentUser = JSON.parse(storedAuth);
  }
} catch (e) {
  console.error(e);
}

const notifyListeners = () => {
  authListeners.forEach(l => l(currentUser));
};

export const loginAdmin = async (email: string, pass: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simple validation for demo
  if (email && pass) { 
      currentUser = { uid: 'admin-mock-id', email };
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      notifyListeners();
      return currentUser;
  }
  throw new Error("Invalid credentials");
};

export const logoutAdmin = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  currentUser = null;
  localStorage.removeItem(AUTH_KEY);
  notifyListeners();
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  authListeners.push(callback);
  callback(currentUser); // Immediate callback with current state
  return () => {
    authListeners = authListeners.filter(l => l !== callback);
  };
};
