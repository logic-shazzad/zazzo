"use client";

import { usePathname } from "next/navigation";
import { FloatingContactWidget } from "@/components/floating-contact-widget";
import { SiteFooter } from "@/components/site-footer";

export function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin ? <FloatingContactWidget /> : null}
      {children}
      {!isAdmin ? <SiteFooter /> : null}
    </>
  );
}
