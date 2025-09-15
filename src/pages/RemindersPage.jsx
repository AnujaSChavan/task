import { useState, useEffect } from 'react'
import { api } from '../utils/api.js'
import './RemindersPage.css'

export default function RemindersPage() {
	const [reminders, setReminders] = useState([])
	const [overdueCount, setOverdueCount] = useState(0)
	const [upcomingCount, setUpcomingCount] = useState(0)
	const [completedCount, setCompletedCount] = useState(0)

	useEffect(() => {
		loadReminders()
	}, [])

	async function loadReminders() {
		try {
			const page = await api.get('/api/tasks')
			const tasks = page.content || []
			const now = new Date()
			const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
			const dueSoon = tasks.filter(t => {
				if (!t.dueDate) return false
				const d = new Date(t.dueDate)
				return d >= now && d <= next24h && (t.status === 'PENDING' || t.status === 'IN_PROGRESS')
			})
			setReminders(dueSoon)

			const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status === 'PENDING').length
			const upcoming = dueSoon.length
			const completed = tasks.filter(t => t.status === 'COMPLETED').length
			setOverdueCount(overdue)
			setUpcomingCount(upcoming)
			setCompletedCount(completed)
		} catch (error) {
			console.error('Error loading reminders:', error)
		}
	}

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'HIGH': return 'red'
			case 'MEDIUM': return 'yellow'
			case 'LOW': return 'green'
			default: return 'gray'
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const formatTime = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className="reminders-page">
			<div className="reminders-header">
				<div className="header-content">
					<h1 className="reminders-title">Reminders</h1>
					<p className="reminders-subtitle">Upcoming reminders and notifications</p>
				</div>
				<div className="header-actions">
					<div className="search-container">
						<input type="text" placeholder="Search tasks..." className="search-input" />
						<span className="search-icon">🔍</span>
					</div>
					<div className="notification-bell">
						🔔
						<span className="notification-dot"></span>
					</div>
				</div>
			</div>

			<div className="reminders-section">
				<div className="section-header">
					<h2 className="section-title">Reminders</h2>
					<p className="section-subtitle">Manage your task reminders and notifications</p>
				</div>

				<div className="reminder-cards">
					<div className="reminder-card overdue">
						<div className="card-icon">⚠️</div>
						<div className="card-content">
							<div className="card-label">Overdue</div>
							<div className="card-value">{overdueCount}</div>
						</div>
					</div>

					<div className="reminder-card upcoming">
						<div className="card-icon">🔔</div>
						<div className="card-content">
							<div className="card-label">Upcoming</div>
							<div className="card-value">{upcomingCount}</div>
						</div>
					</div>

					<div className="reminder-card completed">
						<div className="card-icon">✅</div>
						<div className="card-content">
							<div className="card-label">Completed</div>
							<div className="card-value">{completedCount}</div>
						</div>
					</div>
				</div>

				{reminders.length === 0 ? (
					<div className="empty-reminders">
						<div className="empty-icon">🔔</div>
						<h3 className="empty-title">No reminders set</h3>
						<p className="empty-description">
							Add reminders to your tasks to stay on track with deadlines
						</p>
						<button className="add-reminder-btn">Add Reminder</button>
					</div>
				) : (
					<div className="reminders-list">
						{reminders.map(reminder => (
							<div key={reminder.id} className={`reminder-item ${reminder.status.toLowerCase()}`}>
								<div className="reminder-priority" data-priority={reminder.priority.toLowerCase()}></div>
								<div className="reminder-content">
									<div className="reminder-header">
										<h3 className="reminder-title">{reminder.title}</h3>
										<span className={`priority-badge ${getPriorityColor(reminder.priority)}`}>
											{reminder.priority}
										</span>
									</div>
									<p className="reminder-description">{reminder.description}</p>
									<div className="reminder-meta">
										<div className="reminder-date">
											<span className="date-icon">📅</span>
											<span className="date-text">{formatDate(reminder.dueDate)}</span>
										</div>
										<div className="reminder-time">
											<span className="time-icon">🕐</span>
											<span className="time-text">{formatTime(reminder.dueDate)}</span>
										</div>
									</div>
								</div>
								<div className="reminder-actions">
									<button className="action-btn edit-btn" title="Edit reminder">
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="currentColor" strokeWidth="1.5"/>
											<path d="M14.06 6.44a1.5 1.5 0 1 0-2.12-2.12l-1.06 1.06 2.5 2.5 1.06-1.06z" stroke="currentColor" strokeWidth="1.5"/>
										</svg>
									</button>
									<button className="action-btn delete-btn" title="Delete reminder">
										<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
											<path d="M6 7v7m4-7v7M3 7h14" stroke="currentColor" strokeWidth="1.5"/>
											<rect x="5" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
											<rect x="8" y="3" width="4" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/>
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
