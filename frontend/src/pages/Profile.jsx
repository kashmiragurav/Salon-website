import { Link } from "react-router-dom";
import { useClientAuth } from "../hooks/useClientAuth";

export default function Profile() {
  const { user } = useClientAuth();
  return <section className="section page-intro auth-page"><span className="eyebrow">My account</span><h1>Welcome back.</h1><p className="lead">{user?.email}</p><div className="account-links"><Link className="button" to="/my-appointments">My appointments</Link><Link className="text-link" to="/">Return to the salon</Link></div></section>;
}