import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import './Layout.css'

export default function Layout() {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	function onLogout() {
		logout()
		navigate('/login')
	}
	return (
		<div className="app">
			<aside className="sidebar">
				<div className="brand">🗂️ TaskManager</div>
				<div className="user">{user ? user.name : ''}</div>
				<nav>
					<NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
					<NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>Tasks</NavLink>
					<NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Calendar</NavLink>
				</nav>
				<button className="logout" onClick={onLogout}>Logout</button>
			</aside>
			<main className="content">
				<Outlet />
			</main>
		</div>
	)
}


