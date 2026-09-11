import { CalendarDays } from "lucide-react";

function EmptyState({ title = "No bookings yet", description = "New appointments will appear here when they are created.", icon: Icon = CalendarDays }) {
	return (
		<div className="dashboard-empty">
			<span className="dashboard-empty__icon"><Icon size={20} /></span>
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

export default EmptyState;
