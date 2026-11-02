import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDismiss, 4200);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);
  if (!toast) return null;
  const Icon = toast.type === "error" ? AlertCircle : CheckCircle2;
  return <div className={`toast toast-${toast.type}`} role="status"><Icon size={19} /><span>{toast.message}</span><button className="icon-button" onClick={onDismiss} aria-label="Dismiss notification"><X size={16} /></button></div>;
}
