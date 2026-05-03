"use client";

import { usePathname } from "next/navigation";
import { FloatingContactWidget } from "@/components/floating-contact-widget";
import { SiteFooter } from "@/components/site-footer";
import { StoreBranding } from "@/lib/types";

export function RootChrome({
  children,
  branding
}: {
  children: React.ReactNode;
  branding: StoreBranding;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdmin ? <FloatingContactWidget branding={branding} /> : null}
      {children}
      {!isAdmin ? <SiteFooter branding={branding} /> : null}
    </div>
  );
}
