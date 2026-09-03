import { CalendarDays } from "lucide-react";

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

function RecentBookingsTable({ bookings }) {
  return (
    <div className="bookings-table-wrap">
      <table className="bookings-table">
        <thead>
          <tr><th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th></tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const status = String(booking.status || "pending").toLowerCase();
            const statusLabel = statusLabels[status] || "Pending";
            return (
              <tr key={booking.id}>
                <td><span className="customer-name">{booking.customerName || booking.name || "Unnamed customer"}</span><span className="customer-email">{booking.email || ""}</span></td>
                <td>{booking.serviceName || booking.service || "-"}</td>
                <td>{formatDate(booking.date || booking.appointmentDate)}</td>
                <td>{booking.time || booking.appointmentTime || "-"}</td>
                <td><span className={`status-badge status-badge--${status}`}>{statusLabel}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bookings-mobile-hint"><CalendarDays size={15} /> Showing the latest {bookings.length} bookings</div>
    </div>
  );
}

export default RecentBookingsTable;