"use client";

import { useEffect, useRef, useState } from "react";
import { StoreBranding } from "@/lib/types";

function ContactIcon({ type }: { type: "chat" | "close" | "arrow" | "phone" | "social" }) {
  const paths = {
    chat: "M4 5h16v11H8l-4 4V5Zm4 5h8M8 13h5",
    close: "M6 6l12 12M18 6 6 18",
    arrow: "M7 17 17 7M9 7h8v8",
    phone: "M7 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3c0 1-1 2-2 2C11 19.5 4.5 13 4.5 6c0-1 .5-2 2.5-2Z",
    social: "M5 5h14v14H5V5Zm4 5v5m3-5v5m3-5v5"
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

export function FloatingContactWidget({ branding }: { branding: StoreBranding }) {
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={widgetRef} className="fixed bottom-5 right-4 z-40 sm:bottom-7 sm:right-7">
      <div className="relative flex flex-col items-end">
        {open ? (
          <div className="mb-3.5 w-70 rounded-3xl border border-amber-200/70 bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur-md sm:w-75 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <p className="text-[11px] font-bold tracking-widest text-amber-500 uppercase">
                {branding.widgetTitle || "Get in Touch"}
              </p>
              <button type="button" onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100" aria-label="Close contact options">
                <ContactIcon type="close" />
              </button>
            </div>
            <div className="mt-3.5 space-y-2">
              <a
                href={`https://wa.me/${branding.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 hover:border-emerald-300"
              >
                <span><span className="block text-[10px] font-bold tracking-wider text-emerald-700 uppercase">{branding.whatsappLabel || "WhatsApp"}</span><span className="block truncate text-xs font-semibold text-slate-900">{branding.whatsappNumber}</span></span>
                <ContactIcon type="arrow" />
              </a>
              <a
                href={`tel:${branding.phoneNumber}`}
                className="group flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/50 p-3 hover:border-amber-300"
              >
                <span><span className="block text-[10px] font-bold tracking-wider text-amber-700 uppercase">{branding.phoneLabel || "Direct Call"}</span><span className="block truncate text-xs font-semibold text-slate-900">{branding.phoneNumber}</span></span>
                <ContactIcon type="phone" />
              </a>
              <a
                href={branding.facebookPageUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-3 hover:border-blue-300"
              >
                <span><span className="block text-[10px] font-bold tracking-wider text-blue-700 uppercase">{branding.facebookLabel || "Facebook"}</span><span className="block truncate text-xs font-semibold text-slate-900">{branding.facebookHandle}</span></span>
                <ContactIcon type="social" />
              </a>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={open ? "Close contact options" : "Open contact options"}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/80 bg-amber-400 text-slate-950 shadow-[0_8px_30px_rgba(245,184,0,0.4)] transition-all duration-300 hover:-translate-y-1"
        >
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          <ContactIcon type={open ? "close" : "chat"} />
        </button>
      </div>
    </div>
  );
}
