import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
	const { login } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [theme, setTheme] = useState('light')
	const navigate = useNavigate()

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark')
			setTheme('dark')
		} else {
			document.documentElement.setAttribute('data-theme', 'light')
			setTheme('light')
		}
	}, [])

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			await login(email, password)
			navigate('/app')
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
			<main className="min-h-[calc(100vh-0px)] flex items-center justify-center p-6">
				<div className="w-full max-w-[520px]">
					<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
						<div className="text-center mb-6">
							<h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
							<p className="text-slate-500 dark:text-slate-400">Sign in to your account</p>
						</div>

						<form onSubmit={onSubmit} className="space-y-5">
							<div>
								<label className="block text-sm font-semibold mb-2">Email Address</label>
								<input
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder="Enter your email"
									required
									className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold mb-2">Password</label>
								<input
									type="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									placeholder="Enter your password"
									required
									className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
								/>
							</div>

							{error && (
								<div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
									<span>⚠️</span>
									{error}
								</div>
							)}

							<button type="submit" className="w-full inline-flex justify-center items-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 shadow-md hover:shadow-lg transition">
								Sign In
							</button>
						</form>

						<div className="text-center mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
							<p className="text-slate-600 dark:text-slate-400">Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</Link></p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}





