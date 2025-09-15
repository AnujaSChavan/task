import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import Modal from '../components/Modal.jsx'

export default function CalendarPage() {
	const [monthOffset, setMonthOffset] = useState(0)
	const [selectedDate, setSelectedDate] = useState(null)
	const [tasks, setTasks] = useState([])
	const today = new Date()
	const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)

	const days = useMemo(() => {
		const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
		const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth()+1, 0)
		const start = new Date(firstDay)
		start.setDate(start.getDate() - ((start.getDay()+6)%7))
		const end = new Date(lastDay)
		end.setDate(end.getDate() + (6 - ((end.getDay()+6)%7)))
		const arr = []
		for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) arr.push(new Date(d))
		return arr
	}, [monthDate])

	async function openDay(date) {
		const iso = date.toISOString().slice(0,10)
		const page = await api.get(`/api/tasks/calendar?date=${iso}`)
		setTasks(page.content || [])
		setSelectedDate(iso)
	}

	return (
		<div className="fade-in">
			<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
				<h1 style={{marginTop:0}}>Calendar</h1>
				<div style={{display:'flex', gap:8}}>
					<button className="btn secondary" onClick={()=>setMonthOffset(m=>m-1)}>Prev</button>
					<div style={{alignSelf:'center'}}>{monthDate.toLocaleString('default', { month: 'long' })} {monthDate.getFullYear()}</div>
					<button className="btn" onClick={()=>setMonthOffset(m=>m+1)}>Next</button>
				</div>
			</div>
			<div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8}}>
				{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=> <div key={d} style={{opacity:.6}}>{d}</div>)}
				{days.map((d, i) => (
					<div key={i} className="card" style={{padding:10, minHeight:80, cursor:'pointer', opacity: d.getMonth()===monthDate.getMonth()?1:.5}} onClick={()=>openDay(d)}>
						<div style={{fontSize:12, opacity:.7}}>{d.getDate()}</div>
					</div>
				))}
			</div>

			{selectedDate && (
				<Modal title={`Tasks on ${selectedDate}`} onClose={()=>setSelectedDate(null)}>
					<div className="grid">
						{tasks.map(t => (
							<div key={t.id} className="card">
								<div style={{display:'flex', justifyContent:'space-between'}}>
									<div style={{fontWeight:700}}>{t.title}</div>
									<span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
								</div>
								<div style={{opacity:.9}}>{t.description}</div>
							</div>
						))}
					</div>
				</Modal>
			)}
		</div>
	)
}

// When a date is clicked, tasks due that day are fetched and shown in a modal below.


