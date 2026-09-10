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
    {
      href: branding.socialFacebookUrl,
      label: branding.socialFacebookLabel
    },
    {
      href: branding.socialInstagramUrl,
      label: branding.socialInstagramLabel
    },
    {
      href: `https://wa.me/${branding.whatsappNumber.replace(/\D/g, "")}`,
      label: branding.socialWhatsappLabel
    }
  ];

  return (
    <footer className="relative mt-auto border-t border-amber-950/10 bg-gradient-to-b from-[#fdfbf7] to-[#f7f2e7] pt-20 pb-12 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-200/60 bg-white/80 p-8 shadow-[0_20px_50px_rgba(217,119,6,0.05)] backdrop-blur-md sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-6 sm:col-span-2 lg:col-span-5 lg:pr-8">
              <ZazzoLogo showTagline compact />
              <p className="max-w-sm text-sm leading-relaxed text-slate-600">
                {branding.footerDescription}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {socials.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200/80 bg-amber-50/50 text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:shadow-md"
                    >
                      <span className="text-xs font-bold tracking-wide">{social.label}</span>
                    </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                Quick Links
              </h3>
              <nav className="flex flex-col space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex items-center text-sm text-slate-600 transition-colors duration-200 hover:text-slate-950"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                Shop Support
              </h3>
              <div className="flex flex-col space-y-3">
                {supportLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group inline-flex items-center text-sm text-slate-600 transition-colors duration-200 hover:text-slate-950"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:col-span-2 lg:col-span-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                Contact
              </h3>
              <div className="space-y-2.5 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-xs leading-relaxed text-slate-600">
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-800">Phone:</span>
                  <span>{branding.phoneNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-800">WhatsApp:</span>
                  <span>{branding.whatsappNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-800">Facebook:</span>
                  <span>{branding.facebookHandle}</span>
                </p>
                <div className="flex items-center justify-between border-t border-amber-200/50 pt-2">
                  <span className="font-semibold text-slate-800">Hours:</span>
                  <span className="text-right">{branding.supportHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200/60 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 text-xs font-medium text-slate-500 sm:flex-row">
              <p>© {new Date().getFullYear()} ZAZZO. All rights reserved.</p>
              <p className="rounded-full bg-amber-100/60 px-3.5 py-1 text-amber-900">
                Crafted for premium everyday shopping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
