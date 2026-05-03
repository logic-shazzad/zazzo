type BrandIconProps = {
  size?: number;
  circle?: boolean;
  className?: string;
};

export function BrandIcon({
  size = 40,
  circle = false,
  className = ""
}: BrandIconProps) {
  const style = {
    width: `${size}px`,
    height: `${size}px`
  };

  const content = (
    <span
      className={`inline-flex items-center justify-center font-black leading-none text-[#111111] ${className}`}
      style={{
        ...style,
        fontSize: `${Math.round(size * 0.5)}px`
      }}
      aria-hidden="true"
    >
      Z
    </span>
  );

  if (!circle) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-[12px] bg-[#F5B800] shadow-[0_10px_22px_rgba(245,184,0,0.26)]"
        style={style}
      >
        {content}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-[#F5B800] shadow-[0_14px_28px_rgba(245,184,0,0.3)]"
      style={style}
    >
      {content}
    </span>
  );
}
