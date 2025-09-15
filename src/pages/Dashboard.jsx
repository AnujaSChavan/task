import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import Modal from '../components/Modal.jsx'
import NotificationPopup from '../components/NotificationPopup.jsx'
import './Dashboard.css'

export default function Dashboard() {
	const [counters, setCounters] = useState(null)
	const [completedPerDay, setCompletedPerDay] = useState([])
	const [streaks, setStreaks] = useState(null)
	const [activeModal, setActiveModal] = useState(null)
	const [modalTasks, setModalTasks] = useState([])
	const [weeklyData, setWeeklyData] = useState([])
	const [theme, setTheme] = useState('light')

	async function load() {
		const c = await api.get('/api/analytics/counters')
		const d = await api.get('/api/analytics/completed-per-day?days=7')
		const s = await api.get('/api/analytics/streaks?windowDays=30')
		setCounters(c)
		setCompletedPerDay((d.items || []).slice().reverse().reverse())
		setStreaks(s)
		
		const mockWeeklyData = [
			{ week: 'Week 1', completed: 15, total: 20 },
			{ week: 'Week 2', completed: 18, total: 22 },
			{ week: 'Week 3', completed: 12, total: 18 },
			{ week: 'Week 4', completed: 19, total: 25 }
		]
		setWeeklyData(mockWeeklyData)
	}

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		const initial = savedTheme === 'dark' ? 'dark' : 'light'
		setTheme(initial)
		document.documentElement.setAttribute('data-theme', initial)
		load()
	}, [])

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		document.documentElement.setAttribute('data-theme', newTheme)
		localStorage.setItem('theme', newTheme)
	}

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

	const weeklyChartBars = useMemo(() => {
		const max = Math.max(1, ...weeklyData.map(w => w.completed))
		return weeklyData.map(w => ({ 
			week: w.week, 
			height: (w.completed / max) * 100, 
			completed: w.completed,
			total: w.total,
			percentage: Math.round((w.completed / w.total) * 100)
		}))
	}, [weeklyData])

	return (
		<div className="dashboard-page">
			<div className="dashboard-header" style={{alignItems:'center'}}>
				<div className="header-content" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
					<div style={{display:'flex', flexDirection:'column'}}>
						<span style={{color:'#2563eb', fontWeight:800, fontSize:'1.25rem'}}>PlanHub</span>
						<span style={{fontSize:'0.85rem', color:'var(--text-muted,#64748b)'}}>Personal Task Manager</span>
					</div>
					<div className="search-container" style={{marginLeft:'1rem'}}>
						<input type="text" placeholder="Search tasks..." className="search-input" />
						<span className="search-icon">🔍</span>
					</div>
				</div>
				<div className="header-actions">
					<div className="notification-bell">
						🔔
						<span className="notification-dot"></span>
					</div>
					<button className="auth-button" onClick={toggleTheme} style={{padding:'0.5rem 0.75rem'}}>
						{theme === 'light' ? '🌙' : '☀️'}
					</button>
				</div>
			</div>

			{counters && (
				<div className="priority-cards">
					<PriorityCard 
						label="High Priority" 
						value={counters.highPriority} 
						icon="⚠️"
						color="red" 
						onClick={() => openTasksModal('high')} 
					/>
					<PriorityCard 
						label="Medium Priority" 
						value={counters.mediumPriority} 
						icon="⏰"
						color="yellow" 
						onClick={() => openTasksModal('medium')} 
					/>
					<PriorityCard 
						label="Low Priority" 
						value={counters.lowPriority} 
						icon="✅"
						color="green" 
						onClick={() => openTasksModal('low')} 
					/>
				</div>
			)}

			<div className="charts-section">
				<div className="chart-container">
					<div className="chart-header">
						<h3 className="chart-title">Daily Productivity</h3>
						<p className="chart-subtitle">Tasks completed over the last 7 days</p>
					</div>
					<div className="chart-content">
						<div className="bar-chart">
							{chartBars.map((bar, idx) => (
								<div key={idx} className="bar-container">
									<div 
										className="bar" 
										style={{ height: `${bar.height}%` }}
										title={`${bar.day}: ${bar.count} tasks`}
									>
										<span className="bar-value">{bar.count}</span>
									</div>
									<span className="bar-label">{bar.day}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="chart-container">
					<div className="chart-header">
						<h3 className="chart-title">Weekly Productivity</h3>
						<p className="chart-subtitle">Task completion rate by week</p>
					</div>
					<div className="chart-content">
						<div className="bar-chart">
							{weeklyChartBars.map((bar, idx) => (
								<div key={idx} className="bar-container">
									<div 
										className="bar weekly-bar" 
										style={{ height: `${bar.height}%` }}
										title={`${bar.week}: ${bar.completed}/${bar.total} tasks (${bar.percentage}%)`}
									>
										<span className="bar-value">{bar.completed}</span>
									</div>
									<span className="bar-label">{bar.week}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="stats-section">
				<div className="stats-card">
					<div className="stats-header">
						<h3>Current Streak</h3>
						<div className="streak-icon">🔥</div>
					</div>
					<div className="streak-value">{streaks?.currentDailyStreak || 0}</div>
					<div className="streak-label">days in a row</div>
				</div>

				<div className="stats-card">
					<div className="stats-header">
						<h3>Best Streak</h3>
						<div className="streak-icon">⭐</div>
					</div>
					<div className="streak-value">{streaks?.bestDailyStreak || 0}</div>
					<div className="streak-label">days achieved</div>
				</div>

				<div className="stats-card">
					<div className="stats-header">
						<h3>Completion Rate</h3>
						<div className="streak-icon">📊</div>
					</div>
					<div className="streak-value">
						{counters ? Math.round((counters.completedTasks / (counters.completedTasks + counters.incompleteTasks)) * 100) : 0}%
					</div>
					<div className="streak-label">tasks completed</div>
				</div>
			</div>

			{activeModal && (
				<Modal title={`Tasks: ${activeModal}`} onClose={() => setActiveModal(null)}>
					<div className="modal-tasks">
						{modalTasks.map(t => (
							<div key={t.id} className="task-card">
								<div className="task-header">
									<div className="task-title">{t.title}</div>
									<span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
								</div>
								<div className="task-description">{t.description}</div>
								<div className="task-actions">
									<button className="btn secondary" onClick={() => alert('Open edit modal on Tasks page for simplicity')}>
										Edit
									</button>
									<button className="btn danger" onClick={() => deleteTask(t.id)}>
										Delete
									</button>
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

function PriorityCard({ label, value, icon, color, onClick }) {
	return (
		<div className={`priority-card ${color}`} onClick={onClick}>
			<div className="priority-icon">{icon}</div>
			<div className="priority-content">
				<div className="priority-label">{label}</div>
				<div className="priority-value">{value}</div>
			</div>
		</div>
	)
}


