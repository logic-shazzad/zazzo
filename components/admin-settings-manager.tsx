"use client";

import { FormEvent, useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { StoreSettings } from "@/lib/types";

export function AdminSettingsManager({
  initialSettings
}: {
  initialSettings: StoreSettings;
}) {
  const [insideDhakaDeliveryCharge, setInsideDhakaDeliveryCharge] = useState(
    String(initialSettings.insideDhakaDeliveryCharge)
  );
  const [outsideDhakaDeliveryCharge, setOutsideDhakaDeliveryCharge] = useState(
    String(initialSettings.outsideDhakaDeliveryCharge)
  );
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        insideDhakaDeliveryCharge: Number(insideDhakaDeliveryCharge),
        outsideDhakaDeliveryCharge: Number(outsideDhakaDeliveryCharge)
      })
    });

    const data = (await response.json()) as {
      settings?: StoreSettings;
      message?: string;
    };

    if (!response.ok || !data.settings) {
      setMessage(data.message ?? "Unable to update settings.");
      setSaving(false);
      return;
    }

    setInsideDhakaDeliveryCharge(String(data.settings.insideDhakaDeliveryCharge));
    setOutsideDhakaDeliveryCharge(String(data.settings.outsideDhakaDeliveryCharge));
    setSaving(false);
    setMessage("Delivery charge updated successfully.");
  }

  return (
    <div className="panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
        Store Settings
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">
        Control Dhaka delivery charge from the admin panel
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        Customers can choose whether they are inside Dhaka City Corporation or
        outside it during checkout. Inside charge:{" "}
        {formatCurrency(Number(insideDhakaDeliveryCharge) || 0)}. Outside charge:{" "}
        {formatCurrency(Number(outsideDhakaDeliveryCharge) || 0)}.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Inside Dhaka City Corporation Delivery Charge (TK)
          <input
            type="number"
            min="0"
            value={insideDhakaDeliveryCharge}
            onChange={(event) => setInsideDhakaDeliveryCharge(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Outside Dhaka City Corporation Delivery Charge (TK)
          <input
            type="number"
            min="0"
            value={outsideDhakaDeliveryCharge}
            onChange={(event) => setOutsideDhakaDeliveryCharge(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
          />
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Update Settings"}
          </button>
          {message ? <p className="text-sm text-pine">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
