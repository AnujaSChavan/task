import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import Modal from '../components/Modal.jsx'
import NotificationPopup from '../components/NotificationPopup.jsx'

export default function Dashboard() {
	const [counters, setCounters] = useState(null)
	const [completedPerDay, setCompletedPerDay] = useState([])
	const [streaks, setStreaks] = useState(null)
	const [activeModal, setActiveModal] = useState(null)
	const [modalTasks, setModalTasks] = useState([])

	async function load() {
		const c = await api.get('/api/analytics/counters')
		const d = await api.get('/api/analytics/completed-per-day?days=7')
		const s = await api.get('/api/analytics/streaks?windowDays=30')
		setCounters(c)
		setCompletedPerDay(d.items || [])
		setStreaks(s)
	}

	useEffect(() => { load() }, [])

	async function openTasksModal(type) {
		let page
		if (type === 'completed') page = await api.get('/api/tasks/filter/status?status=COMPLETED')
		else if (type === 'incomplete') page = await api.get('/api/tasks/filter/status?status=PENDING')
		else if (type === 'high') page = await api.get('/api/tasks/filter/priority?priority=HIGH')
		else if (type === 'medium') page = await api.get('/api/tasks/filter/priority?priority=MEDIUM')
		else if (type === 'low') page = await api.get('/api/tasks/filter/priority?priority=LOW')
		setModalTasks(page.content || [])
		setActiveModal(type)
	}

	async function deleteTask(id) {
		await api.del(`/api/tasks/${id}`)
		await load()
		if (activeModal) openTasksModal(activeModal)
	}

	const chartBars = useMemo(() => {
		const max = Math.max(1, ...completedPerDay.map(i => i.count))
		return completedPerDay.map(i => ({ day: i.day, height: (i.count / max) * 100, count: i.count }))
	}, [completedPerDay])

	return (
		<div className="fade-in">
			<h1 style={{marginTop:0}}>Dashboard</h1>
			{counters && (
				<div className="grid">
					<Card label="High Priority" value={counters.highPriority} color="#ef4444" onClick={()=>openTasksModal('high')} />
					<Card label="Medium Priority" value={counters.mediumPriority} color="#f59e0b" onClick={()=>openTasksModal('medium')} />
					<Card label="Low Priority" value={counters.lowPriority} color="#10b981" onClick={()=>openTasksModal('low')} />
					<Card label="Completed" value={counters.completedTasks} color="#22c55e" onClick={()=>openTasksModal('completed')} />
					<Card label="Incomplete" value={counters.incompleteTasks} color="#3b82f6" onClick={()=>openTasksModal('incomplete')} />
				</div>
			)}

			<div className="row" style={{marginTop:20}}>
				<div className="card" style={{flex:2}}>
					<div className="section-title">Tasks Completed (last 7 days)</div>
					<div style={{display:'flex', alignItems:'flex-end', gap:8, height:160}}>
						{chartBars.map((b, idx) => (
							<div key={idx} style={{width:28, background:'#1d4ed8', height: `${b.height}%`, borderRadius:6, position:'relative'}} title={`${b.day}: ${b.count}`}>
								<div style={{position:'absolute', top:-18, left:'50%', transform:'translateX(-50%)', fontSize:12}}>{b.count}</div>
							</div>
						))}
					</div>
				</div>
				<div className="card" style={{flex:1}}>
					<div className="section-title">Streaks</div>
					<div>Current streak: <b>{streaks?.currentDailyStreak || 0}</b> days</div>
					<div>Best streak: <b>{streaks?.bestDailyStreak || 0}</b> days</div>
				</div>
			</div>

			{activeModal && (
				<Modal title={`Tasks: ${activeModal}`} onClose={()=>setActiveModal(null)}>
					<div className="grid">
						{modalTasks.map(t => (
							<div key={t.id} className="card">
								<div style={{display:'flex', justifyContent:'space-between'}}>
									<div style={{fontWeight:700}}>{t.title}</div>
									<span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
								</div>
								<div style={{opacity:.9}}>{t.description}</div>
								<div style={{marginTop:8, display:'flex', gap:8, justifyContent:'flex-end'}}>
									<button className="btn secondary" onClick={()=>alert('Open edit modal on Tasks page for simplicity')}>Edit</button>
									<button className="btn" style={{background:'#ef4444'}} onClick={()=>deleteTask(t.id)}>Delete</button>
								</div>
							</div>
						))}
					</div>
				</Modal>
			)}

			<NotificationPopup />
		</div>
	)
}

function Card({ label, value, color, onClick }) {
	return (
		<div className="card" onClick={onClick} style={{cursor:'pointer', borderColor: color}}>
			<div style={{fontSize:14, opacity:.85}}>{label}</div>
			<div style={{fontSize:28, fontWeight:800, color}}>{value}</div>
		</div>
	)
}


