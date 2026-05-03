import { promises as fs } from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import {
  CreateOrderInput,
  Customer,
  DashboardSummary,
  DeliveryStatus,
  HomepageCollectionCard,
  Order,
  PaymentStatus,
  Product,
  ProductInput,
  StoreSettings,
  StoreData
} from "@/lib/types";
import { seedData } from "@/lib/seed";
import { formatCurrency } from "@/lib/currency";

const mongoUri = process.env.MONGODB_URI?.trim();
const mongoDbName = process.env.MONGODB_DB?.trim() || "zazzo";
const mongoCollectionName = "app_store";
const dataDirectory = process.env.DATA_DIR?.trim()
  ? path.resolve(process.env.DATA_DIR)
  : process.env.VERCEL
    ? path.join("/tmp", "zazzo-data")
    : path.join(process.cwd(), "data");

const storeFile = path.join(dataDirectory, "store.json");
const storeDocumentId = "main";

let writeQueue = Promise.resolve();
let mongoClientPromise: Promise<MongoClient> | null = null;
type MongoStoreRecord = StoreData & { _id: string };

const defaultHomepageCollections: HomepageCollectionCard[] = [
  {
    id: "collection-1",
    eyebrow: "Collection",
    title: "Sneakers",
    description:
      "Everyday pairs selected for comfort, movement, and a sharper street-ready finish."
  },
  {
    id: "collection-2",
    eyebrow: "Collection",
    title: "Bags",
    description:
      "Functional carry pieces with clean structure, easy styling, and all-day practicality."
  },
  {
    id: "collection-3",
    eyebrow: "Collection",
    title: "Home Decor",
    description:
      "Refined home accents that add warmth, balance, and a premium modern touch."
  }
];

const defaultHeroDescription =
  "Discover trend-forward shirts, pants, sarees, and everyday fashion essentials with a storefront designed to feel modern, fast, and easy to shop.";

const defaultSettings: StoreSettings = {
  deliveryCharge: 120
};

function cloneStore(data: StoreData): StoreData {
  return JSON.parse(JSON.stringify(data)) as StoreData;
}

function normalizeProduct(product: Product & { image?: string; images?: string[] }): Product {
  const fallback = product.image ? [product.image, product.image, product.image] : [];
  const images = (product.images && product.images.length ? product.images : fallback)
    .map((image) => image.trim())
    .filter(Boolean);

  return {
    ...product,
    images
  };
}

function normalizeStore(data: StoreData & {
  products: Array<Product & { image?: string; images?: string[] }>;
  heroDescription?: string;
}): StoreData {
  return {
    ...data,
    products: data.products.map(normalizeProduct),
    heroDescription: data.heroDescription?.trim() || defaultHeroDescription,
    homepageCollections:
      data.homepageCollections && data.homepageCollections.length
        ? data.homepageCollections
        : defaultHomepageCollections,
    settings: data.settings ?? defaultSettings
  };
}

async function getMongoClient() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    mongoClientPromise = client.connect();
  }

  return mongoClientPromise;
}

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(mongoDbName).collection<MongoStoreRecord>(mongoCollectionName);
}

async function ensureStoreFile() {
  try {
    await fs.access(storeFile);
  } catch {
    await fs.mkdir(path.dirname(storeFile), { recursive: true });
    await fs.writeFile(storeFile, JSON.stringify(seedData, null, 2), "utf8");
  }
}

async function ensureMongoStore() {
  const collection = await getMongoCollection();
  const existing = await collection.findOne({ _id: storeDocumentId });

  if (existing) {
    return;
  }

  let initialStore = seedData;

  try {
    await ensureStoreFile();
    const raw = await fs.readFile(storeFile, "utf8");
    initialStore = JSON.parse(raw) as StoreData;
  } catch {
    initialStore = seedData;
  }

  await collection.insertOne({
    _id: storeDocumentId,
    ...normalizeStore(initialStore as StoreData & {
      products: Array<Product & { image?: string; images?: string[] }>;
      heroDescription?: string;
    })
  });
}

export async function readStore(): Promise<StoreData> {
  if (mongoUri) {
    await ensureMongoStore();
    const collection = await getMongoCollection();
    const document = await collection.findOne({
      _id: storeDocumentId
    });

    if (!document) {
      throw new Error("MongoDB store document not found.");
    }

    const { _id, ...store } = document;
    return normalizeStore(store as StoreData & {
      products: Array<Product & { image?: string; images?: string[] }>;
      heroDescription?: string;
    });
  }

  await ensureStoreFile();
  const raw = await fs.readFile(storeFile, "utf8");
  const parsed = JSON.parse(raw) as StoreData & {
    products: Array<Product & { image?: string; images?: string[] }>;
    heroDescription?: string;
  };

  return normalizeStore(parsed);
}

async function writeStore(data: StoreData) {
  if (mongoUri) {
    await ensureMongoStore();
    const collection = await getMongoCollection();
    await collection.replaceOne(
      { _id: storeDocumentId },
      { _id: storeDocumentId, ...data } as MongoStoreRecord,
      { upsert: true }
    );
    return;
  }

  await fs.writeFile(storeFile, JSON.stringify(data, null, 2), "utf8");
}

async function queueWrite<T>(operation: (store: StoreData) => T | Promise<T>) {
  const result = writeQueue.then(async () => {
    const store = await readStore();
    const next = cloneStore(store);
    const value = await operation(next);
    await writeStore(next);
    return value;
  });

  writeQueue = result.then(
    () => undefined,
    () => undefined
  );

  return result;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(products: Product[], name: string, currentId?: number) {
  const base = slugify(name);
  let candidate = base;
  let index = 1;

  while (
    products.some((product) => product.slug === candidate && product.id !== currentId)
  ) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  return candidate;
}

function nextProductId(products: Product[]) {
  return products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
}

function nextCustomerId(customers: Customer[]) {
  const max = customers.reduce((value, customer) => {
    const numeric = Number(customer.id.replace("CUS-", ""));
    return Number.isFinite(numeric) ? Math.max(value, numeric) : value;
  }, 1000);

  return `CUS-${String(max + 1).padStart(4, "0")}`;
}

function nextOrderId(orders: Order[]) {
  const max = orders.reduce((value, order) => {
    const numeric = Number(order.id.replace("NC-", ""));
    return Number.isFinite(numeric) ? Math.max(value, numeric) : value;
  }, 1023);

  return `NC-${max + 1}`;
}

function isSameDay(date: Date, reference: Date) {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function isSameMonth(date: Date, reference: Date) {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

export async function getStoreSnapshot() {
  const store = await readStore();

  const featuredProducts = store.products.filter((product) => product.featured);
  const categories = Array.from(new Set(store.products.map((product) => product.category)));
  const recentOrders = [...store.orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const totalRevenue = store.orders.reduce((sum, order) => sum + order.total, 0);

  return {
    ...store,
    featuredProducts,
    categories,
    recentOrders,
    totalRevenue
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const store = await readStore();
  const now = new Date();
  const totalSales = store.orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = store.orders.filter(
    (order) => order.deliveryStatus !== "Delivered" && order.deliveryStatus !== "Cancelled"
  ).length;
  const todayOrders = store.orders.filter((order) =>
    isSameDay(new Date(order.createdAt), now)
  );
  const monthOrders = store.orders.filter((order) =>
    isSameMonth(new Date(order.createdAt), now)
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);

  return {
    stats: [
      {
        label: "Total Orders",
        value: String(store.orders.length),
        note: `${formatCurrency(totalSales)} all-time revenue`
      },
      {
        label: "Today Orders",
        value: String(todayOrders.length),
        note: `${formatCurrency(todayRevenue)} placed today`
      },
      {
        label: "This Month",
        value: String(monthOrders.length),
        note: `${formatCurrency(monthRevenue)} monthly revenue`
      },
      {
        label: "Active Pipeline",
        value: String(activeOrders),
        note: `${store.customers.length} customers tracked`
      }
    ],
    lowStockProducts: store.products.filter((product) => product.inventory <= 10),
    recentOrders: [...store.orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6),
    topCustomers: [...store.customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
  };
}

export async function createProduct(input: ProductInput) {
  return queueWrite((store) => {
    const id = nextProductId(store.products);
    const product: Product = {
      id,
      slug: uniqueSlug(store.products, input.name),
      ...input
    };

    store.products.unshift(product);
    return product;
  });
}

export async function updateProduct(id: number, input: ProductInput) {
  return queueWrite((store) => {
    const index = store.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    const existing = store.products[index];
    const updated: Product = {
      ...existing,
      ...input,
      slug: uniqueSlug(store.products, input.name, id)
    };

    store.products[index] = updated;
    return updated;
  });
}

export async function deleteProduct(id: number) {
  return queueWrite((store) => {
    const product = store.products.find((item) => item.id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    const isReferenced = store.orders.some((order) =>
      order.items.some((item) => item.productId === id)
    );

    if (isReferenced) {
      throw new Error("This product is used in existing orders and cannot be deleted.");
    }

    store.products = store.products.filter((item) => item.id !== id);
    return { success: true };
  });
}

export async function updateOrderStatus(
  id: string,
  payload: {
    paymentStatus?: PaymentStatus;
    deliveryStatus?: DeliveryStatus;
  }
) {
  return queueWrite((store) => {
    const index = store.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }

    const existing = store.orders[index];
    store.orders[index] = {
      ...existing,
      paymentStatus: payload.paymentStatus ?? existing.paymentStatus,
      deliveryStatus: payload.deliveryStatus ?? existing.deliveryStatus
    };

    return store.orders[index];
  });
}

export async function updateHomepageCollections(
  cards: HomepageCollectionCard[],
  heroDescription?: string
) {
  return queueWrite((store) => {
    if (cards.length !== 3) {
      throw new Error("Please provide exactly 3 homepage collection cards.");
    }

    const normalized = cards.map((card, index) => {
      const eyebrow = card.eyebrow.trim();
      const title = card.title.trim();
      const description = card.description.trim();

      if (!eyebrow || !title || !description) {
        throw new Error("Each homepage collection card needs eyebrow, title, and description.");
      }

      return {
        id: card.id?.trim() || `collection-${index + 1}`,
        eyebrow,
        title,
        description
      };
    });

    store.homepageCollections = normalized;
    const normalizedHeroDescription =
      typeof heroDescription === "string"
        ? heroDescription.trim()
        : (store.heroDescription?.trim() || defaultHeroDescription);

    if (!normalizedHeroDescription) {
      throw new Error("Homepage hero description is required.");
    }

    store.heroDescription = normalizedHeroDescription;

    return {
      cards: normalized,
      heroDescription: normalizedHeroDescription
    };
  });
}

export async function updateStoreSettings(settings: StoreSettings) {
  return queueWrite((store) => {
    const deliveryCharge = Number(settings.deliveryCharge);

    if (!Number.isFinite(deliveryCharge) || deliveryCharge < 0) {
      throw new Error("Delivery charge must be a valid number.");
    }

    store.settings = {
      deliveryCharge
    };

    return store.settings;
  });
}

function shippingCost(deliveryCharge: number, subtotal: number) {
  if (subtotal <= 0) {
    return 0;
  }

  return Math.max(0, deliveryCharge);
}

export async function createOrder(input: CreateOrderInput) {
  return queueWrite((store) => {
    if (!input.items.length) {
      throw new Error("Cart is empty");
    }

    const items = input.items.map((cartItem) => {
      const product = store.products.find((item) => item.id === cartItem.productId);

      if (!product) {
        throw new Error("One or more products could not be found.");
      }

      if (product.inventory < cartItem.quantity) {
        throw new Error(`Insufficient stock for ${product.name}.`);
      }

      return {
        product,
        quantity: cartItem.quantity
      };
    });

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shipping = shippingCost(store.settings.deliveryCharge, subtotal);
    const total = subtotal + shipping;
    const normalizedEmail = input.email.trim().toLowerCase();
    const normalizedPhone = input.phone.trim();

    let customer = normalizedEmail
      ? store.customers.find((entry) => entry.email.toLowerCase() === normalizedEmail)
      : store.customers.find((entry) => entry.phone.trim() === normalizedPhone);

    if (customer) {
      customer.name = input.name;
      customer.phone = input.phone;
      customer.address = input.address;
      customer.email = input.email;
      customer.totalOrders += 1;
      customer.totalSpent += total;
    } else {
      customer = {
        id: nextCustomerId(store.customers),
        name: input.name,
        email: input.email,
        phone: input.phone,
        address: input.address,
        totalOrders: 1,
        totalSpent: total,
        createdAt: new Date().toISOString()
      };
      store.customers.unshift(customer);
    }

    const order: Order = {
      id: nextOrderId(store.orders),
      customerId: customer.id,
      customer: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      deliveryStatus: "Processing",
      createdAt: new Date().toISOString()
    };

    store.orders.unshift(order);

    store.products = store.products.map((product) => {
      const orderedItem = items.find((item) => item.product.id === product.id);
      if (!orderedItem) {
        return product;
      }

      return {
        ...product,
        inventory: product.inventory - orderedItem.quantity
      };
    });

    return order;
  });
}
