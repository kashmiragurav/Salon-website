function LoadingSpinner({ label = "Loading dashboard" }) {
	return (
		<div className="dashboard-loading" role="status" aria-live="polite">
			<span className="loading-mark" aria-hidden="true" />
			<span>{label}</span>
		</div>
	);
}

export default LoadingSpinner;
