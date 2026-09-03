import { AlertTriangle, X } from "lucide-react";

function ConfirmModal({ title, message, confirmLabel = "Delete", onConfirm, onCancel, loading = false }) {
	return (
		<div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
			<section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
				<button type="button" className="modal-close" onClick={onCancel} aria-label="Close confirmation dialog">
					<X size={18} />
				</button>
				<span className="confirm-modal__icon"><AlertTriangle size={20} /></span>
				<h2 id="confirm-modal-title">{title}</h2>
				<p>{message}</p>
				<div className="modal-actions">
					<button type="button" className="button-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
					<button type="button" className="button-danger" onClick={onConfirm} disabled={loading}>{loading ? "Deleting..." : confirmLabel}</button>
				</div>
			</section>
		</div>
	);
}

export default ConfirmModal;
