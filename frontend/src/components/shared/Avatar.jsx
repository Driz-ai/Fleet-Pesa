export default function Avatar({ name = "Driver", size = "md", className = "" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "D";

  const sizes = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  return (
    <div
      className={`grid place-items-center rounded-full bg-slate-900 font-semibold text-white ${sizes[size] || sizes.md} ${className}`}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
