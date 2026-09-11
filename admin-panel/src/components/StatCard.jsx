function StatCard({ label, value, icon: Icon, tone = "wine", loading = false }) {
	return (
		<article className={`dashboard-stat dashboard-stat--${tone}`}>
			<div className="dashboard-stat__topline">
				<span className="dashboard-stat__icon"><Icon size={18} strokeWidth={1.8} /></span>
				<span className="dashboard-stat__label">{label}</span>
			</div>
			{loading ? <span className="dashboard-stat__loading" aria-label={`Loading ${label}`} /> : <strong>{value}</strong>}
		</article>
	);
}

export default StatCard;
