import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Signup() {
	const { signup } = useAuth()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			await signup(name, email, password)
			navigate('/')
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<div className="app" style={{alignItems:'center', justifyContent:'center'}}>
			<div className="card" style={{width:460}}>
				<h2 style={{marginTop:0}}>Create your account</h2>
				<form onSubmit={onSubmit} className="fade-in">
					<div className="label">Name</div>
					<input className="input" value={name} onChange={e=>setName(e.target.value)} />
					<div className="label" style={{marginTop:10}}>Email</div>
					<input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
					<div className="label" style={{marginTop:10}}>Password</div>
					<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
					{error && <div style={{color:'#f87171', marginTop:8}}>{error}</div>}
					<button className="btn" style={{marginTop:12, width:'100%'}}>Sign up</button>
				</form>
				<div style={{marginTop:10}}>Have an account? <Link to="/login">Log in</Link></div>
			</div>
		</div>
	)
}


