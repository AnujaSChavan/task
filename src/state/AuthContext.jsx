import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '')
	const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '')
	const [user, setUser] = useState(null)

	const isAuthenticated = !!accessToken

	async function fetchMe() {
		try {
			const res = await api.get('/api/auth/me')
			setUser(res)
		} catch (e) {
			// ignore
		}
	}

	useEffect(() => {
		if (accessToken) {
			fetchMe()
		}
	}, [accessToken])

	function saveTokens(access, refresh) {
		setAccessToken(access)
		setRefreshToken(refresh)
		localStorage.setItem('accessToken', access)
		localStorage.setItem('refreshToken', refresh)
	}

	async function login(email, password) {
		const res = await api.post('/api/auth/login', { email, password }, { raw: true })
		saveTokens(res.accessToken, res.refreshToken)
		await fetchMe()
	}

	async function signup(name, email, password) {
		const res = await api.post('/api/auth/signup', { name, email, password }, { raw: true })
		saveTokens(res.accessToken, res.refreshToken)
		await fetchMe()
	}

	function logout() {
		setAccessToken('')
		setRefreshToken('')
		setUser(null)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	}

	return (
		<AuthContext.Provider value={{ accessToken, refreshToken, user, isAuthenticated, setAccessToken, setRefreshToken, saveTokens, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}


