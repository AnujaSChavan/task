import './Modal.css'

export default function Modal({ title, children, onClose, footer }) {
	return (
		<div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
			<div className="modal">
				<div className="modal-header">
					<div className="modal-title">{title}</div>
					<button className="modal-close" onClick={onClose}>✕</button>
				</div>
				<div className="modal-body">
					{children}
				</div>
				{footer && <div className="modal-footer">{footer}</div>}
			</div>
		</div>
	)
}


