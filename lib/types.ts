export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export type DeliveryStatus =
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type DeliveryZone = "inside_dhaka" | "outside_dhaka";

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
  availableSizes: string[];
};

export type HomepageCollectionCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type StoreSettings = {
  insideDhakaDeliveryCharge: number;
  outsideDhakaDeliveryCharge: number;
};

export type StoreBranding = {
  footerDescription: string;
  widgetTitle: string;
  whatsappLabel: string;
  whatsappNumber: string;
  phoneLabel: string;
  phoneNumber: string;
  facebookLabel: string;
  facebookHandle: string;
  facebookPageUrl: string;
  supportHours: string;
  socialFacebookLabel: string;
  socialFacebookUrl: string;
  socialInstagramLabel: string;
  socialInstagramUrl: string;
  socialWhatsappLabel: string;
};

export type ModeratorUser = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type CartItem = {
  productId: number;
  quantity: number;
  size?: string;
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
  size?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  deliveryZone: DeliveryZone;
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
  branding: StoreBranding;
  moderators: ModeratorUser[];
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
  deliveryZone: DeliveryZone;
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
  availableSizes: string[];
};
