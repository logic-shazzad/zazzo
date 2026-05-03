import { getStoreSnapshot } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const snapshot = await getStoreSnapshot();

  return (
    <div className="panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
        Customer Data
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">
        Customer contacts, address book, and spending history
      </h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Address</th>
              <th className="pb-3">Orders</th>
              <th className="pb-3">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {snapshot.customers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-4">
                  <p className="font-medium text-ink">{customer.name}</p>
                  <p className="text-slate-500">{customer.email || "No email provided"}</p>
                </td>
                <td className="py-4 text-slate-600">{customer.phone}</td>
                <td className="py-4 text-slate-600">{customer.address}</td>
                <td className="py-4 text-slate-600">{customer.totalOrders}</td>
                <td className="py-4 font-semibold text-pine">
                  {formatCurrency(customer.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
