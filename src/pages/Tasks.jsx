import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import Modal from '../components/Modal.jsx'
import TaskModal from '../components/TaskModal.jsx'
import './Tasks.css'

const emptyTask = { title:'', description:'', priority:'MEDIUM', status:'PENDING', dueDate:'', reminder:'', subtasks:[] }

export default function Tasks() {
	const [tasks, setTasks] = useState([])
	const [filter, setFilter] = useState({ type:'all', value:'' })
	const [showAdd, setShowAdd] = useState(false)
	const [editTask, setEditTask] = useState(null)
	const [searchQuery, setSearchQuery] = useState('')

	async function load() {
		let page
		switch (filter.type) {
			case 'priority': page = await api.get(`/api/tasks/filter/priority?priority=${filter.value}`); break
			case 'status': page = await api.get(`/api/tasks/filter/status?status=${filter.value}`); break
			case 'today': page = await api.get('/api/tasks/due/today'); break
			case 'week': page = await api.get('/api/tasks/due/week'); break
			default: page = await api.get('/api/tasks');
		}
		setTasks(page.content || [])
	}
	useEffect(() => { load() }, [filter])

	const filtered = useMemo(() => {
		if (!searchQuery) return tasks
		return tasks.filter(task => 
			task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	}, [tasks, searchQuery])

	function TaskBox({ t }) {
		const [isCompleted, setIsCompleted] = useState(t.status === 'COMPLETED');
		const handleComplete = async (e) => {
			e.stopPropagation();
			if (!isCompleted) {
				await api.put(`/api/tasks/${t.id}`, { ...t, status: 'COMPLETED' });
				setIsCompleted(true);
				load();
			}
		};

		const getPriorityColor = (priority) => {
			switch (priority) {
				case 'HIGH': return 'red'
				case 'MEDIUM': return 'yellow'
				case 'LOW': return 'green'
				default: return 'gray'
			}
		}

		const getStatusColor = (status) => {
			switch (status) {
				case 'COMPLETED': return 'green'
				case 'IN_PROGRESS': return 'blue'
				case 'PENDING': return 'gray'
				default: return 'gray'
			}
		}

		return (
			<div className={`task-card ${isCompleted ? 'completed' : ''}`}>
				<div className="task-header">
					<div className="task-checkbox-container">
						<input 
							type="checkbox" 
							checked={isCompleted} 
							onChange={handleComplete}
							className="task-checkbox"
						/>
					</div>
					<div className="task-actions">
						<button 
							className="action-btn edit-btn" 
							onClick={() => setEditTask(t)}
							title="Edit task"
						>
							<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
								<path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="currentColor" strokeWidth="1.5"/>
								<path d="M14.06 6.44a1.5 1.5 0 1 0-2.12-2.12l-1.06 1.06 2.5 2.5 1.06-1.06z" stroke="currentColor" strokeWidth="1.5"/>
							</svg>
						</button>
						<button 
							className="action-btn delete-btn" 
							onClick={async(e) => {
								e.stopPropagation(); 
								await api.del(`/api/tasks/${t.id}`); 
								load();
							}}
							title="Delete task"
						>
							<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
								<path d="M6 7v7m4-7v7M3 7h14" stroke="currentColor" strokeWidth="1.5"/>
								<rect x="5" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
								<rect x="8" y="3" width="4" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/>
							</svg>
						</button>
					</div>
				</div>

				<div className="task-content">
					<h3 className="task-title">{t.title}</h3>
					<p className="task-description">{t.description}</p>
				</div>

				<div className="task-footer">
					<div className="task-badges">
						<span className={`priority-badge ${getPriorityColor(t.priority)}`}>
							{t.priority}
						</span>
						<span className={`status-badge ${getStatusColor(t.status)}`}>
							{t.status.replace('_', ' ')}
						</span>
					</div>
					{t.dueDate && (
						<div className="task-due-date">
							<span className="due-icon">📅</span>
							<span className="due-text">
								{new Date(t.dueDate).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</span>
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="tasks-page">
			<div className="tasks-header">
				<div className="header-content">
					<h1 className="tasks-title">Tasks</h1>
					<p className="tasks-subtitle">Manage your tasks and stay organized</p>
				</div>
				<button className="add-task-btn" onClick={() => setShowAdd(true)}>
					<span className="btn-icon">+</span>
					Add Task
				</button>
			</div>

			<div className="tasks-controls">
				<div className="search-container">
					<input 
						type="text" 
						placeholder="Search tasks..." 
						className="search-input"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<span className="search-icon">🔍</span>
				</div>
				
				<select 
					className="filter-select" 
					value={`${filter.type}:${filter.value}`} 
					onChange={(e) => {
						const [type, value] = e.target.value.split(':')
						setFilter({ type, value })
					}}
				>
					<option value="all:">All tasks</option>
					<option value="priority:HIGH">High priority</option>
					<option value="priority:MEDIUM">Medium priority</option>
					<option value="priority:LOW">Low priority</option>
					<option value="status:PENDING">Pending</option>
					<option value="status:IN_PROGRESS">In Progress</option>
					<option value="status:COMPLETED">Completed</option>
					<option value="today:">Due today</option>
					<option value="week:">Due this week</option>
				</select>
			</div>

			<div className="tasks-grid">
				{filtered.length === 0 ? (
					<div className="empty-state">
						<div className="empty-icon">📝</div>
						<h3 className="empty-title">No tasks found</h3>
						<p className="empty-description">
							{searchQuery ? 'Try adjusting your search terms' : 'Create your first task to get started'}
						</p>
						{!searchQuery && (
							<button className="empty-action-btn" onClick={() => setShowAdd(true)}>
								Create Task
							</button>
						)}
					</div>
				) : (
					filtered.map(t => <TaskBox key={t.id} t={t} />)
				)}
			</div>

			{showAdd && (
				<TaskModal
					title="Add New Task"
					onClose={() => setShowAdd(false)}
					onSaved={() => { setShowAdd(false); load() }}
					initial={emptyTask}
					saveTask={async (task) => {
						if (task.id) {
							await api.put(`/api/tasks/${task.id}`, task);
						} else {
							await api.post('/api/tasks', task);
						}
						await load();
					}}
				/>
			)}
			{editTask && (
				<TaskModal
					title="Edit Task"
					onClose={() => setEditTask(null)}
					onSaved={() => { setEditTask(null); load() }}
					initial={editTask}
					saveTask={async (task) => {
						if (task.id) {
							await api.put(`/api/tasks/${task.id}`, task);
						} else {
							await api.post('/api/tasks', task);
						}
						await load();
					}}
				/>
			)}
		</div>
	)
}
// All tasks owned by the user are fetched and shown as cards below.
// If you want to filter by user, ensure the backend returns only the user's tasks.

