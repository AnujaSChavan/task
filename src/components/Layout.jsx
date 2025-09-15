import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import './Layout.css'
import React, { useEffect, useState } from "react";

export default function Layout() {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const [theme, setTheme] = useState('light')

	function onLogout() {
		logout()
		navigate('/login')
	}

	// Always default to light mode unless user has chosen dark
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
			setTheme('dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
			setTheme('light');
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	};

	return (
		<div className="app">
			<aside className="sidebar">
				<div className="logo" style={{paddingLeft: 24, marginBottom: 32}}>
					<span style={{color: '#2563eb', fontWeight: 700, fontSize: '2rem'}}>PlanHub</span>
					<div style={{fontSize: '1rem', color: '#64748b'}}>Personal Task Manager</div>
				</div>
				<nav className="menu">
					<NavLink to="/app" end className={({ isActive }) => isActive ? 'active' : ''}>
						<span className="menu-icon">📊</span>
						Dashboard
					</NavLink>
					<NavLink to="/app/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
						<span className="menu-icon">✅</span>
						Tasks
					</NavLink>
					<NavLink to="/app/calendar" className={({ isActive }) => isActive ? 'active' : ''}>
						<span className="menu-icon">📅</span>
						Calendar
					</NavLink>
					<NavLink to="/app/reminders" className={({ isActive }) => isActive ? 'active' : ''}>
						<span className="menu-icon">🔔</span>
						Reminders
					</NavLink>
				</nav>
				<button className="logout" onClick={onLogout}>
					<span className="logout-icon">→</span>
					Logout
				</button>
				<div className="user-info">
					<div className="user-avatar">U</div>
					<div>
						<div style={{fontWeight: 600}}>{user ? user.name : ''}</div>
						<div style={{fontSize: '0.95rem', color: '#64748b'}}>user@example.com</div>
					</div>
				</div>
			</aside>
			<main className="content">
				<Outlet />
			</main>
		</div>
	)
}


