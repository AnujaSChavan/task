import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
	const [theme, setTheme] = useState('light')

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark')
			setTheme('dark')
		} else {
			document.documentElement.classList.remove('dark')
			setTheme('light')
		}
	}, [])

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		if (newTheme === 'dark') document.documentElement.classList.add('dark')
		else document.documentElement.classList.remove('dark')
		localStorage.setItem('theme', newTheme)
	}

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-[Inter]">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex flex-col">
						<span className="text-2xl md:text-[2.6rem] font-black text-blue-600 leading-none tracking-tight">PlanHub</span>
						<span className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">Personal Task Manager</span>
					</div>
					<div className="flex items-center gap-3">
						<button onClick={toggleTheme} className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
							{theme === 'light' ? '🌙' : '☀️'}
							<span className="hidden sm:inline">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
						</button>
						<Link to="/login" className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/60">Login</Link>
						<Link to="/signup" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">Sign Up</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
				<div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
					<div>
						<h1 className="text-4xl md:text-[3.5rem] font-black leading-tight tracking-tight">
							Organize Your Life with
							<span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"> PlanHub</span>
						</h1>
						<p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
							The ultimate personal task management solution that helps you stay organized, productive, and focused on what matters most. Transform your daily routine into a structured, efficient workflow.
						</p>
						<div className="mt-6 flex gap-3">
							<Link to="/signup" className="inline-flex items-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 shadow">Get Started Free</Link>
							<Link to="/login" className="inline-flex items-center rounded-xl border-2 border-slate-200 dark:border-slate-600 px-6 py-3 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50">Sign In</Link>
						</div>
					</div>
					<div className="flex justify-center">
						<div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
							<div className="flex justify-end gap-2 p-4">
								<span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
								<span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
								<span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
							</div>
							<div className="p-4 grid gap-3">
								<div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
									<div className="w-5 h-5 rounded-md bg-emerald-500 text-white grid place-items-center text-xs">✓</div>
									<div className="font-medium line-through opacity-70">Complete project proposal</div>
								</div>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
									<div className="w-5 h-5 rounded-md border-2 border-slate-300"></div>
									<div className="font-medium">Review team feedback</div>
								</div>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
									<div className="w-5 h-5 rounded-md border-2 border-slate-300"></div>
									<div className="font-medium">Schedule team meeting</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-slate-50 dark:bg-slate-900">
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-3xl md:text-[2.5rem] font-black text-center mb-12">Why Choose PlanHub?</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{icon:'📊', title:'Smart Analytics', desc:'Track your productivity with detailed analytics and insights to understand your work patterns and improve efficiency.'},
							{icon:'📅', title:'Calendar Integration', desc:'View your tasks in a beautiful calendar format, making it easy to plan your day and manage deadlines effectively.'},
							{icon:'🔔', title:'Smart Reminders', desc:'Never miss important deadlines with intelligent reminder system that keeps you on track with your goals.'},
							{icon:'🎯', title:'Priority Management', desc:'Organize tasks by priority levels and focus on what\'s most important to maximize your productivity.'},
							{icon:'📱', title:'Cross-Platform', desc:'Access your tasks from anywhere with our responsive design that works perfectly on all devices.'},
							{icon:'🔒', title:'Secure & Private', desc:'Your data is protected with enterprise-grade security, ensuring your personal information stays private.'}
						].map((f, i) => (
							<div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
								<div className="text-4xl mb-3">{f.icon}</div>
								<h3 className="text-lg font-bold mb-2">{f.title}</h3>
								<p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-white dark:bg-slate-800">
				<div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl md:text-[2.5rem] font-black mb-4">Transform Your Productivity</h2>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
							PlanHub is designed to help you achieve more by providing a comprehensive task management solution that adapts to your workflow. Whether you're a student, professional, or entrepreneur, our platform helps you stay organized and focused.
						</p>
						<div className="space-y-3">
							{['Increase productivity by up to 40%','Reduce stress with better organization','Never miss important deadlines','Track progress with detailed analytics'].map((t, i)=> (
								<div key={i} className="flex items-center gap-3">
									<span className="w-6 h-6 grid place-items-center text-white bg-emerald-500 rounded-full text-xs font-bold">✓</span>
									<span className="font-medium">{t}</span>
								</div>
							))}
						</div>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<div className="text-center rounded-2xl p-6 text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow">
							<div className="text-4xl font-black">95%</div>
							<div className="opacity-90">User Satisfaction</div>
						</div>
						<div className="text-center rounded-2xl p-6 text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow">
							<div className="text-4xl font-black">10K+</div>
							<div className="opacity-90">Active Users</div>
						</div>
						<div className="text-center rounded-2xl p-6 text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow">
							<div className="text-4xl font-black">50K+</div>
							<div className="opacity-90">Tasks Completed</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 text-white bg-gradient-to-r from-blue-600 to-violet-600 text-center">
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-3xl md:text-[2.5rem] font-black mb-3">Ready to Get Started?</h2>
					<p className="opacity-90 text-lg mb-6">Join thousands of users who have transformed their productivity with PlanHub</p>
					<div className="flex flex-wrap justify-center gap-3">
						<Link to="/signup" className="inline-flex items-center rounded-xl bg-white text-blue-600 font-semibold px-6 py-3 hover:bg-slate-100">Start Your Free Trial</Link>
						<Link to="/login" className="inline-flex items-center rounded-xl border-2 border-white text-white font-semibold px-6 py-3 hover:bg-white/10">Sign In to Your Account</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
				<div className="max-w-6xl mx-auto px-6 py-12">
					<div className="grid md:grid-cols-3 gap-8 mb-8">
						<div>
							<span className="text-xl font-black text-blue-600">PlanHub</span>
							<p className="text-slate-600 dark:text-slate-400 mt-2">Personal Task Manager</p>
						</div>
						<div className="grid grid-cols-3 gap-6 md:col-span-2">
							<div>
								<h4 className="font-semibold mb-3">Product</h4>
								<a href="#features" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Features</a>
								<a href="#pricing" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Pricing</a>
								<a href="#security" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Security</a>
							</div>
							<div>
								<h4 className="font-semibold mb-3">Support</h4>
								<a href="#help" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Help Center</a>
								<a href="#contact" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Contact Us</a>
								<a href="#status" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Status</a>
							</div>
							<div>
								<h4 className="font-semibold mb-3">Company</h4>
								<a href="#about" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">About</a>
								<a href="#blog" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Blog</a>
								<a href="#careers" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Careers</a>
							</div>
						</div>
					</div>
					<div className="border-t border-slate-200 dark:border-slate-700 pt-6 text-center text-slate-600 dark:text-slate-400">
						<p>&copy; 2024 PlanHub. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
