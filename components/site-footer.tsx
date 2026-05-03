import Link from "next/link";
import { ZazzoLogo } from "@/components/zazzo-logo";
import { StoreBranding } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/checkout", label: "Checkout" },
  { href: "/cart", label: "Bag" }
];

const supportLinks = [
  { href: "/products", label: "New Arrivals" },
  { href: "/checkout", label: "Secure Checkout" },
  { href: "/cart", label: "Your Bag" }
];

export function SiteFooter({ branding }: { branding: StoreBranding }) {
  const socials = [
    { href: branding.socialFacebookUrl, label: branding.socialFacebookLabel },
    { href: branding.socialInstagramUrl, label: branding.socialInstagramLabel },
    {
      href: `https://wa.me/${branding.whatsappNumber.replace(/\D/g, "")}`,
      label: branding.socialWhatsappLabel
    }
  ];

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-[linear-gradient(180deg,#fbf8ef_0%,#fffdf8_100%)] pt-16">
      <div className="shell py-12 sm:py-14">
        <div className="panel overflow-hidden rounded-[28px] border border-[#f3e5b3] bg-white/90 shadow-[0_24px_80px_rgba(17,17,17,0.06)]">
          <div className="grid gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1fr] lg:gap-8">
            <div className="space-y-4">
              <ZazzoLogo showTagline compact />
              <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-[0.95rem]">
                {branding.footerDescription}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f2df9a] bg-[#fff8de] text-sm font-semibold text-[#111111] transition duration-200 hover:-translate-y-0.5 hover:border-[#F5B800] hover:bg-[#F5B800]"
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Quick Links
              </h3>
              <nav className="flex flex-col gap-3 text-sm text-slate-700">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-[#111111]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Shop Support
              </h3>
              <div className="flex flex-col gap-3 text-sm text-slate-700">
                {supportLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition hover:text-[#111111]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Contact
              </h3>
              <div className="space-y-3 text-sm leading-7 text-slate-600">
                <p>Phone: {branding.phoneNumber}</p>
                <p>WhatsApp: {branding.whatsappNumber}</p>
                <p>Facebook: {branding.facebookHandle}</p>
                <p>Support hours: {branding.supportHours}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 bg-[#fffaf0] px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p>Copyright {new Date().getFullYear()} ZAZZO. All rights reserved.</p>
              <p>Crafted for premium everyday shopping.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
