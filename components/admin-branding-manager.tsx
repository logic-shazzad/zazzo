"use client";

import { FormEvent, useState } from "react";
import { StoreBranding } from "@/lib/types";

export function AdminBrandingManager({
  initialBranding
}: {
  initialBranding: StoreBranding;
}) {
  const [form, setForm] = useState(initialBranding);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/branding", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = (await response.json()) as {
      branding?: StoreBranding;
      message?: string;
    };

    if (!response.ok || !data.branding) {
      setMessage(data.message ?? "Unable to update branding.");
      setSaving(false);
      return;
    }

    setForm(data.branding);
    setSaving(false);
    setMessage("Branding and contact information updated successfully.");
  }

  const textFields: Array<{ key: keyof StoreBranding; label: string }> = [
    { key: "widgetTitle", label: "Floating Widget Title" },
    { key: "whatsappLabel", label: "WhatsApp Label" },
    { key: "whatsappNumber", label: "WhatsApp Number" },
    { key: "phoneLabel", label: "Phone Label" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "facebookLabel", label: "Facebook Label" },
    { key: "facebookHandle", label: "Facebook Handle" },
    { key: "facebookPageUrl", label: "Facebook Page URL" },
    { key: "supportHours", label: "Support Hours" },
    { key: "socialFacebookLabel", label: "Footer Facebook Label" },
    { key: "socialFacebookUrl", label: "Footer Facebook URL" },
    { key: "socialInstagramLabel", label: "Footer Instagram Label" },
    { key: "socialInstagramUrl", label: "Footer Instagram URL" },
    { key: "socialWhatsappLabel", label: "Footer WhatsApp Label" }
  ];

  return (
    <div className="panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
        Branding & Contact
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">
        Manage footer content, social links, and floating contact details
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        Update the public-facing contact information and brand text from one
        organized section without touching code.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8">
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
            <h3 className="text-lg font-semibold text-ink">Floating Contact Widget</h3>
            <div className="mt-4 grid gap-4">
              {textFields.slice(0, 8).map((field) => (
                <label key={field.key} className="grid gap-2 text-sm font-medium text-slate-700">
                  {field.label}
                  <input
                    value={form[field.key]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
            <h3 className="text-lg font-semibold text-ink">Footer & Social Links</h3>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Footer Description
                <textarea
                  rows={5}
                  value={form.footerDescription}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      footerDescription: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                />
              </label>
              {textFields.slice(8).map((field) => (
                <label key={field.key} className="grid gap-2 text-sm font-medium text-slate-700">
                  {field.label}
                  <input
                    value={form[field.key]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Update Branding"}
          </button>
          {message ? <p className="text-sm text-pine">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
