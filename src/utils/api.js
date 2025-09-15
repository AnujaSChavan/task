const base = '' // proxied by Vite to http://localhost:8080

async function request(method, url, body, opts = {}) {
	const headers = { 'Content-Type': 'application/json' }
	const accessToken = localStorage.getItem('accessToken')
	if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
	const res = await fetch(base + url, { method, headers, body: body ? JSON.stringify(body) : undefined })
	if (res.status === 401 && localStorage.getItem('refreshToken')) {
		const refreshed = await refreshToken()
		if (refreshed) {
			return request(method, url, body, opts)
		}
	}
	if (!res.ok) {
		const t = await safeJson(res)
		throw new Error(t?.message || `HTTP ${res.status}`)
	}
	return opts.raw ? await res.json() : await safeJson(res)
}

async function safeJson(res) {
	try { return await res.json() } catch { return null }
}

async function refreshToken() {
	try {
		const refreshToken = localStorage.getItem('refreshToken')
		if (!refreshToken) return false
		const res = await fetch('/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) })
		if (!res.ok) return false
		const json = await res.json()
		localStorage.setItem('accessToken', json.accessToken)
		if (json.refreshToken) localStorage.setItem('refreshToken', json.refreshToken)
		return true
	} catch {
		return false
	}
}

export const api = {
	get: (url) => request('GET', url),
	post: (url, body, opts) => request('POST', url, body, opts),
	put: (url, body) => request('PUT', url, body),
	del: (url) => request('DELETE', url),
}


