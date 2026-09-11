import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading" }) { return <div className="state"><LoaderCircle className="spin" size={28} /><p>{label}</p></div>; }
export function ErrorState({ message = "This content could not be loaded." }) { return <div className="state state--error"><AlertCircle size={28} /><p>{message}</p></div>; }
export function EmptyState({ message = "Nothing to show yet." }) { return <div className="state"><Inbox size={28} /><p>{message}</p></div>; }
