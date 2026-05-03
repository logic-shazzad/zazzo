"use client";

import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { StoreBranding } from "@/lib/types";

export function FloatingContactWidget({ branding }: { branding: StoreBranding }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-3 z-50 sm:bottom-6 sm:left-6">
      <div className="flex items-end gap-3">
        {open ? (
          <div className="w-[220px] rounded-[20px] border border-white/80 bg-white/96 p-3.5 shadow-[0_24px_70px_rgba(31,41,51,0.16)] backdrop-blur sm:w-[260px] sm:rounded-[24px] sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#F5B800]">
              {branding.widgetTitle}
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <a
                href={`https://wa.me/${branding.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl bg-sand px-4 py-3 transition hover:bg-mist"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  {branding.whatsappLabel}
                </span>
                <span className="mt-1 block font-semibold">
                  {branding.whatsappNumber}
                </span>
              </a>
              <a
                href={`tel:${branding.phoneNumber}`}
                className="block rounded-2xl bg-sand px-4 py-3 transition hover:bg-mist"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  {branding.phoneLabel}
                </span>
                <span className="mt-1 block font-semibold">
                  {branding.phoneNumber}
                </span>
              </a>
              <a
                href={branding.facebookPageUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl bg-sand px-4 py-3 transition hover:bg-mist"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                  {branding.facebookLabel}
                </span>
                <span className="mt-1 block truncate font-semibold">
                  {branding.facebookHandle}
                </span>
              </a>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Open ZAZZO contact information"
          className="transition duration-300 hover:-translate-y-1"
        >
          <BrandIcon size={48} circle />
        </button>
      </div>
    </div>
  );
}
