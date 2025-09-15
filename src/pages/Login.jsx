import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
	const { login } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			await login(email, password)
			navigate('/')
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<div className="app" style={{alignItems:'center', justifyContent:'center'}}>
			<div className="card" style={{width:420}}>
				<h2 style={{marginTop:0}}>Welcome back</h2>
				<form onSubmit={onSubmit} className="fade-in">
					<div className="label">Email</div>
					<input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
					<div className="label" style={{marginTop:10}}>Password</div>
					<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
					{error && <div style={{color:'#f87171', marginTop:8}}>{error}</div>}
					<button className="btn" style={{marginTop:12, width:'100%'}}>Login</button>
				</form>
				<div style={{marginTop:10}}>No account? <Link to="/signup">Sign up</Link></div>
			</div>
		</div>
	)
}


