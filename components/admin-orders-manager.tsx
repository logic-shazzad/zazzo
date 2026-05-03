"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/currency";
import { DeliveryStatus, Order, PaymentStatus } from "@/lib/types";

const paymentStatuses: PaymentStatus[] = ["Pending", "Paid", "Failed", "Refunded"];
const deliveryStatuses: DeliveryStatus[] = [
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

export function AdminOrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(
    id: string,
    payload: { paymentStatus?: PaymentStatus; deliveryStatus?: DeliveryStatus }
  ) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as Order & { message?: string };
    if (!response.ok) {
      setMessage(data.message ?? "Unable to update order.");
      return;
    }

    setOrders((current) => current.map((order) => (order.id === id ? data : order)));
    setMessage(`Order ${id} updated.`);
  }

  async function removeOrder(id: string) {
    const shouldDelete = window.confirm(
      `Delete order ${id}? This will also restore product stock and update customer totals.`
    );

    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/orders/${id}`, {
      method: "DELETE"
    });

    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setMessage(data.message ?? "Unable to delete order.");
      return;
    }

    setOrders((current) => current.filter((order) => order.id !== id));
    setMessage(`Order ${id} deleted.`);
  }

  return (
    <div className="grid gap-6">
      <div className="panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
          Order Operations
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Update payment state and delivery progress from one place
        </h2>
        {message ? <p className="mt-4 text-sm text-pine">{message}</p> : null}
      </div>

      <div className="panel p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Order</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Delivery</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-4 align-top">
                    <p className="font-semibold text-ink">{order.id}</p>
                    <p className="text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 align-top">
                    <p className="font-medium text-ink">{order.customer}</p>
                    <p className="text-slate-500">{order.email || "No email provided"}</p>
                    <p className="text-slate-500">{order.phone}</p>
                    <p className="text-slate-500">{order.address}</p>
                  </td>
                  <td className="py-4 align-top">
                    {order.items.map((item) => (
                      <p key={`${order.id}-${item.productId}`} className="text-slate-600">
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="py-4 align-top">
                    <StatusBadge
                      value={order.paymentStatus}
                      tone={order.paymentStatus === "Paid" ? "success" : "warning"}
                    />
                    <select
                      value={order.paymentStatus}
                      onChange={(event) =>
                        updateStatus(order.id, {
                          paymentStatus: event.target.value as PaymentStatus
                        })
                      }
                      className="mt-3 block rounded-xl border border-slate-200 px-3 py-2"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 align-top">
                    <StatusBadge value={order.deliveryStatus} />
                    <select
                      value={order.deliveryStatus}
                      onChange={(event) =>
                        updateStatus(order.id, {
                          deliveryStatus: event.target.value as DeliveryStatus
                        })
                      }
                      className="mt-3 block rounded-xl border border-slate-200 px-3 py-2"
                    >
                      {deliveryStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 align-top font-semibold text-pine">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-4 align-top">
                    <button
                      type="button"
                      onClick={() => removeOrder(order.id)}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
