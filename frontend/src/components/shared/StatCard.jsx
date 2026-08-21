export function StatCard({ label, value, subtitle }) {
  return (
    <div className="stat-card">
      <span className="stat-card-label">{label}</span>

      <strong className="stat-card-value">{value}</strong>

      {subtitle && (
        <span className="stat-card-subtitle">
          {subtitle}
        </span>
      )}
    </div>
  );
}