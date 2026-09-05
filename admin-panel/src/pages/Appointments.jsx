import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Eye, Phone, Search, UserRound, X } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { BOOKING_STATUSES, subscribeToBookings, updateBookingStatus } from "../services/bookingService";

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = value?.toDate ? value.toDate() : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const statusKey = (status) => String(status || "Pending").toLowerCase();

function Appointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToBookings(
      (data) => { setBookings(data); setLoading(false); setError(""); },
      (bookingError) => {
        console.error("Bookings failed to load:", bookingError);
        setError("We could not load appointments from Firestore.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const visibleBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch = !term || [booking.customerName, booking.phone].some((value) => String(value || "").toLowerCase().includes(term));
      const matchesStatus = !statusFilter || statusKey(booking.status) === statusFilter.toLowerCase();
      const matchesDate = !dateFilter || String(booking.preferredDate || "").slice(0, 10) === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, search, statusFilter, dateFilter]);

  const changeStatus = async (booking, status) => {
    setUpdatingId(booking.id); setActionError("");
    try { await updateBookingStatus(booking.id, status); setSelectedBooking(null); setCancellingBooking(null); }
    catch (bookingError) { console.error("Booking status update failed:", bookingError); setActionError("We could not update this appointment. Please try again."); }
    finally { setUpdatingId(""); }
  };

  return (
    <div className="appointments-page">
      <header className="module-heading"><div><p className="eyebrow">Client schedule</p><h1>Appointments</h1><p>Stay on top of every booking and its next step.</p></div></header>
      {actionError && <div className="module-error" role="alert">{actionError}<button type="button" onClick={() => setActionError("")} aria-label="Dismiss error"><X size={16} /></button></div>}
      {error && <div className="module-error" role="alert">{error}</div>}

      <section className="service-toolbar" aria-label="Appointment filters">
        <label className="search-field"><Search size={17} /><span className="sr-only">Search customers</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or phone" /></label>
        <label className="filter-field"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{BOOKING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label className="date-filter"><span>Date</span><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label>
      </section>

      <section className="appointments-list" aria-label="Appointments list">
        {loading && <LoadingSpinner label="Loading appointments" />}
        {!loading && !error && bookings.length === 0 && <EmptyState icon={CalendarDays} title="No appointments yet" description="New bookings will appear here when they are received." />}
        {!loading && !error && bookings.length > 0 && visibleBookings.length === 0 && <EmptyState icon={CalendarDays} title="No matching appointments" description="Try a different customer, status, or date filter." />}
        {!loading && !error && visibleBookings.length > 0 && <div className="appointments-table-wrap"><table className="appointments-table"><thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
          {visibleBookings.map((booking) => <tr key={booking.id}>
            <td><div className="appointment-customer"><span><UserRound size={16} /></span><div><strong>{booking.customerName || "Unnamed customer"}</strong><small>{booking.phone || "No phone provided"}</small></div></div></td>
            <td>{booking.serviceSelected || "Not provided"}</td><td>{formatDate(booking.preferredDate)}</td><td>{booking.preferredTime || "Not provided"}</td>
            <td><span className={`booking-status booking-status--${statusKey(booking.status)}`}>{booking.status || "Pending"}</span></td>
            <td><button type="button" className="view-details-button" onClick={() => setSelectedBooking(booking)}><Eye size={15} /> Details</button></td>
          </tr>)}
        </tbody></table></div>}
      </section>

      {selectedBooking && <BookingDetails booking={selectedBooking} updating={updatingId === selectedBooking.id} onClose={() => setSelectedBooking(null)} onConfirm={() => changeStatus(selectedBooking, "Confirmed")} onComplete={() => changeStatus(selectedBooking, "Completed")} onCancel={() => setCancellingBooking(selectedBooking)} />}
      {cancellingBooking && <ConfirmModal title="Cancel this appointment?" message={`This will mark ${cancellingBooking.customerName || "the booking"} as cancelled. The booking will remain in your records.`} confirmLabel="Cancel appointment" onConfirm={() => changeStatus(cancellingBooking, "Cancelled")} onCancel={() => updatingId ? undefined : setCancellingBooking(null)} loading={updatingId === cancellingBooking.id} />}
    </div>
  );
}

function BookingDetails({ booking, updating, onClose, onConfirm, onComplete, onCancel }) {
  const status = booking.status || "Pending";
  return <div className="modal-backdrop" role="presentation"><section className="booking-details-modal" role="dialog" aria-modal="true" aria-labelledby="booking-details-title"><div className="modal-heading"><div><p className="eyebrow">Booking details</p><h2 id="booking-details-title">{booking.customerName || "Unnamed customer"}</h2></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close booking details"><X size={18} /></button></div><div className="booking-detail-status"><span className={`booking-status booking-status--${statusKey(status)}`}>{status}</span></div><dl className="booking-detail-grid"><div><dt><UserRound size={15} /> Customer</dt><dd>{booking.customerName || "Not provided"}</dd></div><div><dt><Phone size={15} /> Phone</dt><dd>{booking.phone || "Not provided"}</dd></div><div><dt><CalendarDays size={15} /> Preferred date</dt><dd>{formatDate(booking.preferredDate)}</dd></div><div><dt><Clock3 size={15} /> Preferred time</dt><dd>{booking.preferredTime || "Not provided"}</dd></div></dl><div className="booking-detail-copy"><span>Service</span><p>{booking.serviceSelected || "Not provided"}</p><span>Notes</span><p>{booking.notes || "No notes provided."}</p></div><div className="modal-actions">{status === "Pending" && <button type="button" className="button-primary" onClick={onConfirm} disabled={updating}><Check size={15} />{updating ? "Updating..." : "Confirm booking"}</button>}{status === "Confirmed" && <button type="button" className="button-primary" onClick={onComplete} disabled={updating}><Check size={15} />{updating ? "Updating..." : "Mark completed"}</button>}{!["Cancelled", "Completed"].includes(status) && <button type="button" className="button-danger" onClick={onCancel} disabled={updating}>Cancel booking</button>}</div></section></div>;
}

export default Appointments;