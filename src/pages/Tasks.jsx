import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api.js'
import Modal from '../components/Modal.jsx'

const emptyTask = { title:'', description:'', priority:'MEDIUM', status:'PENDING', dueDate:'', subtasks:[] }

export default function Tasks() {
	const [tasks, setTasks] = useState([])
	const [filter, setFilter] = useState({ type:'all', value:'' })
	const [showAdd, setShowAdd] = useState(false)
	const [editTask, setEditTask] = useState(null)

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

	const filtered = useMemo(() => tasks, [tasks])

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
					return (
						<div className="dashboard-card" style={{minWidth:280, flex:1, position:'relative', paddingTop:18}}>
							<div style={{position:'absolute', top:10, right:12, display:'flex', gap:8}}>
								<span title="Edit" style={{cursor:'pointer', fontSize:18, color:'#2563eb'}} onClick={()=>setEditTask(t)}>
									<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#2563eb" strokeWidth="1.5"/><path d="M14.06 6.44a1.5 1.5 0 1 0-2.12-2.12l-1.06 1.06 2.5 2.5 1.06-1.06z" stroke="#2563eb" strokeWidth="1.5"/></svg>
								</span>
								<span title="Delete" style={{cursor:'pointer', fontSize:18, color:'#ef4444'}} onClick={async(e)=>{e.stopPropagation(); await api.del(`/api/tasks/${t.id}`); load();}}>
									<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 7v7m4-7v7M3 7h14" stroke="#ef4444" strokeWidth="1.5"/><rect x="5" y="7" width="10" height="8" rx="2" stroke="#ef4444" strokeWidth="1.5"/><rect x="8" y="3" width="4" height="2" rx="1" stroke="#ef4444" strokeWidth="1.5"/></svg>
								</span>
							</div>
							<div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
								<input type="checkbox" checked={isCompleted} onChange={handleComplete} style={{width:18, height:18, accentColor:'#22c55e'}} />
								<div style={{fontWeight:700, fontSize:'1.15rem', flex:1}}>{t.title}</div>
							</div>
							<div style={{fontSize:13, opacity:.8, marginBottom:2}}><span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span></div>
							<div style={{fontSize:13, opacity:.8}}>Due: {t.dueDate || '-'}</div>
							<div style={{fontSize:13, opacity:.8}}>Status: {t.status}</div>
						</div>
					)
	}

		return (
			<div className="fade-in">
				<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
					<h1 style={{marginTop:0, fontWeight:800, fontSize:'2.2rem'}}>Tasks</h1>
					<button className="btn" onClick={()=>setShowAdd(true)}>Add Task</button>
				</div>

				<div style={{marginBottom:20}}>
					<select className="input" style={{maxWidth:220}} value={`${filter.type}:${filter.value}`} onChange={(e)=>{
						const [type, value] = e.target.value.split(':')
						setFilter({ type, value })
					}}>
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

				<div className="dashboard-grid" style={{flexWrap:'wrap'}}>
					{filtered.map(t => <TaskBox key={t.id} t={t} />)}
				</div>

				{showAdd && <TaskModal title="Add Task" onClose={()=>setShowAdd(false)} onSaved={()=>{ setShowAdd(false); load() }} initial={emptyTask} />}
				{editTask && <TaskModal title="Edit Task" onClose={()=>setEditTask(null)} onSaved={()=>{ setEditTask(null); load() }} initial={editTask} />}
			</div>
		)
}

function TaskModal({ title, onClose, onSaved, initial }) {
	const [form, setForm] = useState({ ...initial, subtasks: initial.subtasks || [] })

	function updateField(key, val) { setForm(f => ({ ...f, [key]: val })) }
	function addSubtask() { setForm(f => ({ ...f, subtasks: [...(f.subtasks||[]), { title:'', description:'', status:'PENDING' }] })) }
	function updateSubtask(idx, key, val) { setForm(f => ({ ...f, subtasks: f.subtasks.map((s,i)=> i===idx? { ...s, [key]: val }: s) })) }
	function removeSubtask(idx) { setForm(f => ({ ...f, subtasks: f.subtasks.filter((_,i)=>i!==idx) })) }

	async function onSubmit() {
		const payload = { title:form.title, description:form.description, priority:form.priority, status:form.status, dueDate:form.dueDate }
		let res
		if (initial.id) res = await api.put(`/api/tasks/${initial.id}`, payload)
		else res = await api.post('/api/tasks', payload)
		// Save subtasks sequentially for simplicity
		for (const s of form.subtasks || []) {
			if (!s.id) await api.post(`/api/tasks/${res.id}/subtasks`, s)
			else await api.put(`/api/tasks/${res.id}/subtasks/${s.id}`, s)
		}
		onSaved?.()
	}

	return (
		<Modal title={title} onClose={onClose} footer={<>
			<button className="btn secondary" onClick={onClose}>Cancel</button>
			<button className="btn" onClick={onSubmit}>Save</button>
		</>}>
			<div className="form-row">
				<div>
					<div className="label">Title</div>
					<input className="input" value={form.title} onChange={e=>updateField('title', e.target.value)} />
				</div>
				<div>
					<div className="label">Due date</div>
					<input className="input" type="date" value={form.dueDate||''} onChange={e=>updateField('dueDate', e.target.value)} />
				</div>
			</div>
			<div className="form-row" style={{marginTop:10}}>
				<div>
					<div className="label">Priority</div>
					<select className="input" value={form.priority} onChange={e=>updateField('priority', e.target.value)}>
						<option>HIGH</option>
						<option>MEDIUM</option>
						<option>LOW</option>
					</select>
				</div>
				<div>
					<div className="label">Status</div>
					<select className="input" value={form.status} onChange={e=>updateField('status', e.target.value)}>
						<option>PENDING</option>
						<option>IN_PROGRESS</option>
						<option>COMPLETED</option>
					</select>
				</div>
			</div>
			<div className="label" style={{marginTop:10}}>Description</div>
			<textarea className="input" rows={4} value={form.description} onChange={e=>updateField('description', e.target.value)} />

			<div className="section-title" style={{marginTop:12}}>Subtasks</div>
			<div style={{display:'grid', gap:8}}>
				{(form.subtasks||[]).map((s, idx) => (
					<div key={idx} className="card" style={{padding:12}}>
						<div className="form-row">
							<input className="input" placeholder="Title" value={s.title} onChange={e=>updateSubtask(idx,'title', e.target.value)} />
							<select className="input" value={s.status} onChange={e=>updateSubtask(idx,'status', e.target.value)}>
								<option>PENDING</option>
								<option>IN_PROGRESS</option>
								<option>COMPLETED</option>
							</select>
						</div>
						<textarea className="input" style={{marginTop:8}} rows={2} placeholder="Description" value={s.description} onChange={e=>updateSubtask(idx,'description', e.target.value)} />
						<div style={{display:'flex', justifyContent:'flex-end', marginTop:6}}>
							<button className="btn secondary" onClick={()=>removeSubtask(idx)}>Remove</button>
						</div>
					</div>
				))}
				<button className="btn" onClick={addSubtask}>Add subtask</button>
			</div>
		</Modal>
	)
}

// All tasks owned by the user are fetched and shown as cards below.
// If you want to filter by user, ensure the backend returns only the user's tasks.


