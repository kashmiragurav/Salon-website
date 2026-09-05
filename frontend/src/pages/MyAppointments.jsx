import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";
import { cancelBooking, subscribeToMyBookings } from "../services/bookingService";
import AppointmentDetailsModal from "../components/AppointmentDetailsModal";
import { EmptyState, ErrorState, LoadingState } from "../components/DataState";

const tabs = ["All", "Upcoming", "Past", "Cancelled", "Completed"];
const appointmentDate = (booking) => { const [year, month, day] = String(booking.preferredDate || "").split("-").map(Number); const [hour = 0, minute = 0] = String(booking.preferredTime || "00:00").split(":").map(Number); const value = new Date(year, month - 1, day, hour, minute); return year && month && day && !Number.isNaN(value.getTime()) ? value : null; };
const formatDate = (booking) => { const date = appointmentDate(booking); return date ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date) : "Date unavailable"; };
const isUpcoming = (booking) => booking.status !== "Cancelled" && appointmentDate(booking)?.getTime() >= Date.now();
const isPast = (booking) => !["Cancelled", "Completed"].includes(booking.status) && appointmentDate(booking)?.getTime() < Date.now();
const canCancel = (booking) => ["Pending", "Confirmed"].includes(booking.status) && appointmentDate(booking)?.getTime() > Date.now();

export default function MyAppointments() {
  const { user } = useClientAuth();
  const [state, setState] = useState({ bookings: [], loading: true, error: "" });
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { let unsubscribe; let cancelled = false; Promise.resolve().then(() => { if (cancelled) return; unsubscribe = subscribeToMyBookings(user.uid, (bookings) => setState({ bookings, loading: false, error: "" }), (error) => { console.error("My appointments failed to load:", error); setState({ bookings: [], loading: false, error: "Unable to load your appointments. Please try again." }); }); }).catch((error) => { console.error("My appointments failed to start:", error); if (!cancelled) setState({ bookings: [], loading: false, error: "Unable to load your appointments. Please try again." }); }); return () => { cancelled = true; unsubscribe?.(); }; }, [user.uid]);
  const visible = useMemo(() => state.bookings.filter((booking) => tab === "All" || (tab === "Upcoming" && isUpcoming(booking)) || (tab === "Past" && isPast(booking)) || (tab === "Cancelled" && booking.status === "Cancelled") || (tab === "Completed" && booking.status === "Completed")), [state.bookings, tab]);
  const cancel = async (booking) => { if (!canCancel(booking) || !window.confirm("Are you sure you want to cancel this appointment?")) return; try { await cancelBooking(booking.id); setState((current) => ({ ...current, bookings: current.bookings.map((item) => item.id === booking.id ? { ...item, status: "Cancelled" } : item) })); setSelected(null); setNotice("Appointment cancelled successfully."); } catch (error) { console.error(error); setNotice("Unable to cancel this appointment. Please try again."); } };
  const emptyMessage = tab === "All" ? "You don't have any appointments yet." : tab === "Upcoming" ? "No upcoming appointments." : tab === "Past" ? "No past appointments." : tab === "Completed" ? "No completed appointments." : "No cancelled appointments.";
  return <section className="section page-intro appointments-page"><span className="eyebrow">Your account</span><h1>My appointments</h1><div className="appointment-tabs" role="tablist">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>{notice && <p className={notice.startsWith("Appointment") ? "success-message" : "error-message"} role="status">{notice}</p>}{state.loading && <LoadingState label="Loading your appointments..." />}{state.error && <ErrorState message={state.error} />}{!state.loading && !state.error && !visible.length && <div><EmptyState message={emptyMessage} /><Link className="button" to="/book-appointment">Book an appointment</Link></div>}{!state.loading && !state.error && visible.length > 0 && <div className="client-appointments-grid">{visible.map((booking) => <article className="client-appointment-card" key={booking.id}><span className="kicker">{booking.status}</span><h2>{booking.serviceSelected}</h2><p><CalendarDays size={15} />{formatDate(booking)} · {booking.preferredTime || "Time unavailable"}</p><small>Booking ID: {booking.id}</small><div><button type="button" className="button-secondary" onClick={() => setSelected(booking)}><Eye size={15} /> View details</button>{canCancel(booking) && <button type="button" className="button-danger" onClick={() => cancel(booking)}>Cancel</button>}</div></article>)}</div>}{selected && <AppointmentDetailsModal booking={selected} onClose={() => setSelected(null)} onCancel={canCancel(selected) ? () => cancel(selected) : undefined} />}</section>;
}
