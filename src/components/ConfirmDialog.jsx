import './ConfirmDialog.css'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Ya, Keluar',
  cancelLabel = 'Batal',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) return null
  return (
    <div className="cd-backdrop" role="dialog" aria-modal="true" aria-labelledby="cd-title">
      <div className="cd-card">
        <div className={`cd-badge cd-badge--${tone}`}>!</div>
        <h3 className="cd-title" id="cd-title">{title}</h3>
        <p className="cd-message">{message}</p>
        <div className="cd-actions">
          <button className="cd-btn cd-btn--ghost" onClick={onCancel}>{cancelLabel}</button>
          <button className={`cd-btn cd-btn--${tone}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
