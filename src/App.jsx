import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import Layout from './components/Layout.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'

function PrivateRoute({ children }) {
	const { isAuthenticated } = useAuth()
	return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
					<Route index element={<Dashboard />} />
					<Route path="tasks" element={<Tasks />} />
					<Route path="calendar" element={<CalendarPage />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</AuthProvider>
	)
}


