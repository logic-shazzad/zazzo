import { StoreData } from "@/lib/types";

export const seedData: StoreData = {
  products: [
    {
      id: 1,
      name: "AeroFit Runner",
      slug: "aerofit-runner",
      category: "Sneakers",
      description:
        "Lightweight daily sneakers with breathable mesh, cloud-soft support, and a striking urban profile.",
      price: 89,
      inventory: 23,
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80"
      ],
      accent: "from-orange-300 via-orange-200 to-white",
      featured: true,
      sku: "SNK-001"
    },
    {
      id: 2,
      name: "Canvas Utility Pack",
      slug: "canvas-utility-pack",
      category: "Bags",
      description:
        "Structured daypack with waterproof finish, laptop sleeve, and travel-ready interior pockets.",
      price: 74,
      inventory: 11,
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
      ],
      accent: "from-emerald-200 via-teal-100 to-white",
      featured: true,
      sku: "BAG-101"
    },
    {
      id: 3,
      name: "Luma Studio Lamp",
      slug: "luma-studio-lamp",
      category: "Home Decor",
      description:
        "Minimal desk lamp with warm ambient glow, touch controls, and a sculpted matte finish.",
      price: 119,
      inventory: 8,
      rating: 4.9,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80"
      ],
      accent: "from-sky-200 via-cyan-100 to-white",
      featured: false,
      sku: "HOM-901"
    },
    {
      id: 4,
      name: "Terra Ceramic Set",
      slug: "terra-ceramic-set",
      category: "Dining",
      description:
        "Hand-finished tableware set designed for cozy hosting, with earthy tones and durable glaze.",
      price: 96,
      inventory: 17,
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
      ],
      accent: "from-amber-200 via-stone-100 to-white",
      featured: true,
      sku: "DIN-220"
    },
    {
      id: 5,
      name: "Nord Fold Chair",
      slug: "nord-fold-chair",
      category: "Furniture",
      description:
        "Compact accent chair with oak frame, woven seat, and a premium lounge look for modern interiors.",
      price: 159,
      inventory: 6,
      rating: 4.5,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
      ],
      accent: "from-stone-200 via-neutral-100 to-white",
      featured: false,
      sku: "FUR-440"
    },
    {
      id: 6,
      name: "Pulse Smart Bottle",
      slug: "pulse-smart-bottle",
      category: "Lifestyle",
      description:
        "Insulated hydration bottle with temperature display, leakproof cap, and clean brushed finish.",
      price: 49,
      inventory: 31,
      rating: 4.4,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80"
      ],
      accent: "from-lime-200 via-emerald-100 to-white",
      featured: true,
      sku: "LIF-330"
    }
  ],
  homepageCollections: [
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
  ],
  heroDescription:
    "Discover trend-forward shirts, pants, sarees, and everyday fashion essentials with a storefront designed to feel modern, fast, and easy to shop.",
  settings: {
    deliveryCharge: 120
  },
  customers: [
    {
      id: "CUS-1001",
      name: "Nafisa Rahman",
      email: "nafisa@example.com",
      phone: "+8801700000001",
      address: "Dhanmondi, Dhaka",
      totalOrders: 2,
      totalSpent: 326,
      createdAt: "2026-04-18T09:30:00.000Z"
    },
    {
      id: "CUS-1002",
      name: "Arif Hasan",
      email: "arif@example.com",
      phone: "+8801700000002",
      address: "Chattogram, Bangladesh",
      totalOrders: 1,
      totalSpent: 89,
      createdAt: "2026-04-20T11:15:00.000Z"
    },
    {
      id: "CUS-1003",
      name: "Mim Sultana",
      email: "mim@example.com",
      phone: "+8801700000003",
      address: "Uttara, Dhaka",
      totalOrders: 3,
      totalSpent: 452,
      createdAt: "2026-04-22T14:00:00.000Z"
    }
  ],
  orders: [
    {
      id: "NC-1024",
      customerId: "CUS-1001",
      customer: "Nafisa Rahman",
      email: "nafisa@example.com",
      phone: "+8801700000001",
      address: "Dhanmondi, Dhaka",
      items: [
        {
          productId: 1,
          name: "AeroFit Runner",
          price: 89,
          quantity: 1
        },
        {
          productId: 2,
          name: "Canvas Utility Pack",
          price: 74,
          quantity: 1
        }
      ],
      subtotal: 163,
      shipping: 0,
      total: 163,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Paid",
      deliveryStatus: "Shipped",
      createdAt: "2026-04-20T13:10:00.000Z"
    },
    {
      id: "NC-1025",
      customerId: "CUS-1002",
      customer: "Arif Hasan",
      email: "arif@example.com",
      phone: "+8801700000002",
      address: "Chattogram, Bangladesh",
      items: [
        {
          productId: 1,
          name: "AeroFit Runner",
          price: 89,
          quantity: 1
        }
      ],
      subtotal: 89,
      shipping: 0,
      total: 89,
      paymentMethod: "bKash",
      paymentStatus: "Pending",
      deliveryStatus: "Processing",
      createdAt: "2026-04-21T10:30:00.000Z"
    },
    {
      id: "NC-1026",
      customerId: "CUS-1003",
      customer: "Mim Sultana",
      email: "mim@example.com",
      phone: "+8801700000003",
      address: "Uttara, Dhaka",
      items: [
        {
          productId: 4,
          name: "Terra Ceramic Set",
          price: 96,
          quantity: 1
        },
        {
          productId: 3,
          name: "Luma Studio Lamp",
          price: 119,
          quantity: 1
        }
      ],
      subtotal: 215,
      shipping: 0,
      total: 215,
      paymentMethod: "Card",
      paymentStatus: "Paid",
      deliveryStatus: "Packed",
      createdAt: "2026-04-22T12:45:00.000Z"
    }
  ]
};
