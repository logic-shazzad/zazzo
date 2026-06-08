"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { Product } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

const initialForm = {
  name: "",
  category: "",
  description: "",
  price: "0",
  inventory: "0",
  rating: "4.5",
  images: "",
  accent: "from-slate-200 via-white to-white",
  featured: false,
  sku: "",
  availableSizes: ""
};

export function AdminProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [uploadRequiresCloud, setUploadRequiresCloud] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    setUploadRequiresCloud(hostname !== "localhost" && hostname !== "127.0.0.1");
  }, []);

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      inventory: String(product.inventory),
      rating: String(product.rating),
      images: product.images.join("\n"),
      accent: product.accent,
      featured: product.featured,
      sku: product.sku,
      availableSizes: product.availableSizes.join("\n")
    });
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const existingImages = form.images
      .split("\n")
      .map((image) => image.trim())
      .filter(Boolean);

    if (existingImages.length + files.length > 9) {
      setMessage("A product can have maximum 9 images.");
      event.target.value = "";
      return;
    }

    const payload = new FormData();
    files.forEach((file) => payload.append("files", file));

    setUploading(true);
    setMessage("Uploading images...");

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: payload
    });

    const data = (await response.json()) as { urls?: string[]; message?: string };
    const uploadedUrls = Array.isArray(data.urls) ? data.urls : [];

    if (!response.ok || uploadedUrls.length === 0) {
      setMessage(data.message ?? "Image upload failed.");
      setUploading(false);
      event.target.value = "";
      return;
    }

    setForm((current) => {
      const currentImages = current.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean);

      return {
        ...current,
        images: [...currentImages, ...uploadedUrls].join("\n")
      };
    });

    setUploading(false);
    setMessage(`${uploadedUrls.length} image uploaded successfully.`);
    event.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const payload = {
      ...form,
      price: Number(form.price),
      inventory: Number(form.inventory),
      rating: Number(form.rating),
      images: form.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean),
      availableSizes: form.availableSizes
        .split(/[\n,]+/)
        .map((size) => size.trim().toUpperCase())
        .filter(Boolean)
    };

    const response = await fetch(
      editingId ? `/api/products/${editingId}` : "/api/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = (await response.json()) as Product & { message?: string };

    if (!response.ok) {
      setMessage(data.message ?? "Unable to save product.");
      return;
    }

    setProducts((current) => {
      if (editingId) {
        return current.map((product) => (product.id === editingId ? data : product));
      }

      return [data, ...current];
    });

    setMessage(editingId ? "Product updated." : "Product created.");
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleDelete(id: number) {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setMessage(data.message ?? "Unable to delete product.");
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== id));
    setMessage("Product deleted.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
          {editingId ? "Edit Product" : "Add Product"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Manage product information and stock
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          {[
            ["name", "Product Name"],
            ["category", "Category"],
            ["sku", "SKU"],
            ["accent", "Accent Gradient"],
            ["price", "Price (TK)"],
            ["inventory", "Inventory"],
            ["rating", "Rating"]
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm font-medium text-slate-700">
              {label}
              <input
                required={key !== "accent"}
                value={
                  typeof form[key as keyof typeof form] === "boolean"
                    ? ""
                    : String(form[key as keyof typeof form])
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
              />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Product Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm"
            />
            <span className="text-xs text-slate-500">
              Upload image files directly from your desktop. You can keep mixing
              uploaded files and URL-based images.
            </span>
            {uploadRequiresCloud ? (
              <span className="text-xs text-amber-700">
                Deployed uploads require Cloudinary configuration. If upload is not
                configured yet, use image URLs for now.
              </span>
            ) : null}
            <textarea
              required
              rows={6}
              value={form.images}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  images: event.target.value
                }))
              }
              placeholder={"Add 3 to 9 image URLs, one per line"}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
            />
            <span className="text-xs text-slate-500">
              Add minimum 3 and maximum 9 image links. The first image will be used
              on product cards.
            </span>
            <span className="text-xs text-slate-500">
              Current count: {
                form.images.split("\n").map((image) => image.trim()).filter(Boolean).length
              }{" "}
              / 9 {uploading ? "(uploading...)" : ""}
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Available Sizes
            <textarea
              rows={4}
              value={form.availableSizes}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  availableSizes: event.target.value
                }))
              }
              placeholder={"Optional sizes, one per line or comma separated\nM\nL\nXL\nXXL"}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
            />
            <span className="text-xs text-slate-500">
              Leave empty for products without sizes. For shirts, shoes, or clothing,
              add sizes like M, L, XL, XXL or 39, 40, 41.
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Description
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  featured: event.target.checked
                }))
              }
            />
            Show as featured product
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              {editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
          {message ? <p className="text-sm text-pine">{message}</p> : null}
        </form>
      </section>

      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
              Product List
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Current catalog with edit and delete actions
            </h2>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Product</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-4">
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-slate-500">{product.category}</p>
                    <p className="text-slate-400">{product.images.length} images</p>
                    <p className="text-slate-400">
                      {product.availableSizes.length
                        ? `Sizes: ${product.availableSizes.join(", ")}`
                        : "No size selection"}
                    </p>
                  </td>
                  <td className="py-4 text-slate-600">{product.sku}</td>
                  <td className="py-4 font-semibold text-pine">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-4 text-slate-600">{product.inventory}</td>
                  <td className="py-4">
                    <StatusBadge
                      value={product.inventory > 10 ? "Active" : "Low stock"}
                      tone={product.inventory > 10 ? "success" : "warning"}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="text-sm font-medium text-pine"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-sm font-medium text-coral"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
