export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export type DeliveryStatus =
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  inventory: number;
  rating: number;
  images: string[];
  accent: string;
  featured: boolean;
  sku: string;
};

export type HomepageCollectionCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type StoreSettings = {
  deliveryCharge: number;
};

export type CartItem = {
  productId: number;
  quantity: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
};

export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customerId: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
};

export type StoreData = {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  heroDescription: string;
  homepageCollections: HomepageCollectionCard[];
  settings: StoreSettings;
};

export type DashboardStat = {
  label: string;
  value: string;
  note: string;
};

export type DashboardSummary = {
  stats: DashboardStat[];
  lowStockProducts: Product[];
  recentOrders: Order[];
  topCustomers: Customer[];
};

export type CreateOrderInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
};

export type ProductInput = {
  name: string;
  category: string;
  description: string;
  price: number;
  inventory: number;
  rating: number;
  images: string[];
  accent: string;
  featured: boolean;
  sku: string;
};
