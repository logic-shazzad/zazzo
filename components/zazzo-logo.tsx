import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";

type ZazzoLogoProps = {
  withLink?: boolean;
  showTagline?: boolean;
  compact?: boolean;
  dark?: boolean;
};

function LogoInner({
  showTagline = false,
  compact = false,
  dark = false
}: Omit<ZazzoLogoProps, "withLink">) {
  return (
    <span className="inline-flex items-center gap-3 align-middle">
      <BrandIcon size={compact ? 36 : 40} />
      <span className="flex flex-col justify-center">
        <span
          className={`text-[1.5rem] font-black tracking-[0.08em] ${
            dark ? "text-white" : "text-[#111111]"
          }`}
        >
          ZAZZO
        </span>
        {showTagline ? (
          <span
            className={`text-[0.68rem] uppercase tracking-[0.28em] ${
              dark ? "text-white/70" : "text-slate-400"
            }`}
          >
            Modern Fashion
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function ZazzoLogo({
  withLink = false,
  showTagline = false,
  compact = false,
  dark = false
}: ZazzoLogoProps) {
  if (withLink) {
    return (
      <Link href="/" className="inline-flex items-center">
        <LogoInner showTagline={showTagline} compact={compact} dark={dark} />
      </Link>
    );
  }

  return <LogoInner showTagline={showTagline} compact={compact} dark={dark} />;
}
