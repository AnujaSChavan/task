import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'

export default function NotificationPopup() {
	const [items, setItems] = useState([])
	const [show, setShow] = useState(false)

	async function poll() {
		try {
			const count = await api.get('/api/notifications/unread-count')
			if (count > 0) {
				const page = await api.get('/api/notifications?page=0&size=5')
				setItems(page.content || [])
				setShow(true)
			}
		} catch {}
	}

	useEffect(() => {
		const id = setInterval(poll, 15000)
		poll()
		return () => clearInterval(id)
	}, [])

	if (!show || items.length === 0) return null
	return (
		<div style={{ position:'fixed', right:24, bottom:24, display:'grid', gap:10, zIndex:50 }}>
			{items.map(n => (
				<div key={n.id} className="card fade-in" style={{minWidth:320}}>
					<div style={{fontWeight:700}}>{n.title}</div>
					<div style={{opacity:.9}}>{n.body}</div>
					<div style={{display:'flex', justifyContent:'flex-end'}}>
						<button className="btn secondary" onClick={async()=>{ await api.post(`/api/notifications/${n.id}/read`); setShow(false) }}>Dismiss</button>
					</div>
				</div>
			))}
		</div>
	)
}


