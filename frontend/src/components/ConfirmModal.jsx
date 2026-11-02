import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <div className="confirm-icon"><AlertTriangle size={21} /></div><h2 id="confirm-title">{title}</h2><p id="confirm-message">{message}</p>
        <div className="modal-actions"><button className="button button-secondary" onClick={onCancel}>Keep task</button><button className="button button-danger" onClick={onConfirm}>Delete task</button></div>
      </section>
    </div>
  );
}
