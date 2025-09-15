import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import Modal from '../components/Modal.jsx'
import TaskModal from '../components/TaskModal';
import './CalendarPage.css'

export default function CalendarPage() {
	const [monthOffset, setMonthOffset] = useState(0)
	const [selectedDate, setSelectedDate] = useState(null)
	const [tasks, setTasks] = useState([])
	const [showAdd, setShowAdd] = useState(false);
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

	const isToday = (date) => {
		const today = new Date()
		return date.toDateString() === today.toDateString()
	}

	const isSelected = (date) => {
		if (!selectedDate) return false
		return date.toISOString().slice(0,10) === selectedDate
	}

	const isCurrentMonth = (date) => {
		return date.getMonth() === monthDate.getMonth()
	}

	async function saveTaskToDB(task) {
		// Use the same logic as in Tasks.jsx
		if (task.id) {
			await api.put(`/api/tasks/${task.id}`, task);
		} else {
			await api.post('/api/tasks', task);
		}
		// Optionally reload tasks for the selected date
		if (selectedDate) openDay(new Date(selectedDate));
	}

	return (
		<div className="calendar-page">
			<div className="calendar-header">
				<div className="header-content">
					<h1 className="calendar-title">Calendar</h1>
					<p className="calendar-subtitle">View tasks in calendar format</p>
				</div>
				<div className="calendar-controls">
					<button className="nav-btn" onClick={() => setMonthOffset(m => m - 1)}>
						<span>‹</span>
					</button>
					<button className="today-btn" onClick={() => setMonthOffset(0)}>
						Today
					</button>
					<button className="nav-btn" onClick={() => setMonthOffset(m => m + 1)}>
						<span>›</span>
					</button>
				</div>
			</div>

			<div className="calendar-container">
				<div className="calendar-main">
					<div className="month-header">
						<h2 className="month-title">
							{monthDate.toLocaleString('default', { month: 'long' })} {monthDate.getFullYear()}
						</h2>
					</div>
					
					<div className="calendar-grid">
						{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
							<div key={day} className="day-header">
								{day}
							</div>
						))}
						
						{days.map((date, i) => (
							<div 
								key={i} 
								className={`calendar-day ${!isCurrentMonth(date) ? 'other-month' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
								onClick={() => openDay(date)}
							>
								<span className="day-number">{date.getDate()}</span>
							</div>
						))}
					</div>
				</div>

				<div className="calendar-sidebar">
					<div className="sidebar-header">
						<h3 className="sidebar-title">
							Tasks for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
								weekday: 'long', 
								month: 'long', 
								day: 'numeric',
								year: 'numeric'
							}) : 'Select a date'}
						</h3>
					</div>
					
					<div className="sidebar-content">
						{tasks.length === 0 ? (
							<div className="no-tasks">
								<div className="no-tasks-icon">📅</div>
								<p className="no-tasks-text">No tasks for this date</p>
								<button className="add-task-btn" onClick={() => setShowAdd(true)}>Add Task</button>
							</div>
						) : (
							<div className="tasks-list">
								{tasks.map(task => (
									<div key={task.id} className="task-item">
										<div className="task-priority" data-priority={task.priority.toLowerCase()}></div>
										<div className="task-content">
											<div className="task-title">{task.title}</div>
											<div className="task-description">{task.description}</div>
											<div className="task-meta">
												<span className={`priority-badge ${task.priority.toLowerCase()}`}>
													{task.priority}
												</span>
												<span className="task-time">
													{task.dueDate ? new Date(task.dueDate).toLocaleTimeString('en-US', {
														hour: '2-digit',
														minute: '2-digit'
													}) : 'All day'}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{selectedDate && (
				<Modal title={`Tasks for ${selectedDate}`} onClose={() => setSelectedDate(null)}>
					<div className="modal-tasks">
						{tasks.map(t => (
							<div key={t.id} className="task-card">
								<div className="task-header">
									<div className="task-title">{t.title}</div>
									<span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>
								</div>
								<div className="task-description">{t.description}</div>
							</div>
						))}
					</div>
				</Modal>
			)}

			{showAdd && (
				<TaskModal
					onClose={() => setShowAdd(false)}
					onSaved={() => {
						setShowAdd(false);
						if (selectedDate) openDay(new Date(selectedDate));
					}}
					saveTask={saveTaskToDB}
					initial={{
						title: '',
						description: '',
						priority: 'MEDIUM',
						status: 'PENDING',
						dueDate: selectedDate || '',
						reminder: '',
						subtasks: []
					}}
				/>
			)}
		</div>
	)
}

// When a date is clicked, tasks due that day are fetched and shown in a modal below.


