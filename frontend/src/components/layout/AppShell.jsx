import { Bell, CircleHelp, Moon, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Owner } from '../Dashboard/Owner'
import { Sidebar } from './Sidebar'
import { useTheme } from '../../context/ThemeContext.jsx'

export function AppShell() {
	const location = useLocation()
	const [successMessage, setSuccessMessage] = useState(location.state?.success || '')
	const { isDark, toggleTheme } = useTheme()

	useEffect(() => {
		if (!successMessage) return undefined
		const timeoutId = window.setTimeout(() => setSuccessMessage(''), 5000)
		return () => window.clearTimeout(timeoutId)
	}, [successMessage])
	const todayLabel = useMemo(
		() => new Intl.DateTimeFormat('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
		[]
	)

	return (
		<div className="app-shell">
			<Sidebar />
			<main className="main-content">
				{successMessage && <p className="auth-success" role="status">{successMessage}</p>}
				<header className="topbar">
					<div>
						<h1>Dashboard</h1>
						<p>{todayLabel}</p>
					</div>
					<div className="topbar-actions">
						<button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
							{isDark ? <Sun size={18} /> : <Moon size={18} />}
						</button>
						<button className="icon-button" aria-label="Help">
							<CircleHelp size={19} strokeWidth={1.8} />
						</button>
						<button className="icon-button notification-button" aria-label="Notifications">
							<Bell size={20} strokeWidth={1.8} />
							<span />
						</button>
						<div className="topbar-avatar">JD</div>
					</div>
				</header>
				<section className="dashboard-content" aria-label="Fleet dashboard">
					<Owner />
				</section>
			</main>
		</div>
	)
}
