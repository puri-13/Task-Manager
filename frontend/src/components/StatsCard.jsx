export default function StatsCard({ label, value, caption, icon: Icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-${tone}`}><Icon size={19} strokeWidth={1.9} /></div>
      <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{caption}</small></div>
    </article>
  );
}
