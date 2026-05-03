export function StatusBadge({
  value,
  tone = "neutral"
}: {
  value: string;
  tone?: "success" | "warning" | "neutral";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {value}
    </span>
  );
}
