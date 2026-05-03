import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/currency";
import { getDashboardSummary } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.stats.map((stat) => (
          <article key={stat.label} className="panel p-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">{stat.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
            Recent Orders
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Payment and delivery monitoring
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Delivery</th>
                  <th className="pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 font-semibold text-ink">{order.id}</td>
                    <td className="py-4">
                      <p className="font-medium text-ink">{order.customer}</p>
                      <p className="text-slate-500">{order.email || "No email provided"}</p>
                      <p className="text-slate-500">{order.address}</p>
                    </td>
                    <td className="py-4">
                      <StatusBadge
                        value={order.paymentStatus}
                        tone={order.paymentStatus === "Paid" ? "success" : "warning"}
                      />
                    </td>
                    <td className="py-4">
                      <StatusBadge value={order.deliveryStatus} />
                    </td>
                    <td className="py-4 font-semibold text-pine">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
              Low Stock
            </p>
            <div className="mt-4 space-y-4">
              {summary.lowStockProducts.map((product) => (
                <div key={product.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{product.inventory} left</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
              Top Customers
            </p>
            <div className="mt-4 space-y-4">
              {summary.topCustomers.map((customer) => (
                <div key={customer.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-ink">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {customer.totalOrders} orders, {formatCurrency(customer.totalSpent)} spent
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
