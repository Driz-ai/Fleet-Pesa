import { Bell, CircleHelp, Moon, Sun, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export function AppShell() {
	const location = useLocation()
	const [successMessage, setSuccessMessage] = useState(location.state?.success || '')
	const { isDark, toggleTheme } = useTheme()
	const { user } = useAuth()
	const [showNotifications, setShowNotifications] = useState(false)
	const [showFaq, setShowFaq] = useState(false)
	const initials = (user?.name || 'Fleet Owner').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

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
						<button className="icon-button" aria-label="Help" onClick={() => setShowFaq((open) => !open)}>
							<CircleHelp size={19} strokeWidth={1.8} />
						</button>
						<button className="icon-button notification-button" aria-label="Notifications" onClick={() => setShowNotifications((open) => !open)}>
							<Bell size={20} strokeWidth={1.8} />
							<span />
						</button>
						<div className="topbar-avatar">{user?.profile_picture ? <img src={user.profile_picture} alt="" /> : initials}</div>
					</div>
					{showNotifications && <div className="topbar-popover"><strong>Notifications</strong><p>No new remittance alerts.</p></div>}
					{showFaq && <div className="topbar-popover faq-popover"><button type="button" aria-label="Close FAQ" onClick={() => setShowFaq(false)}><X size={15} /></button><strong>FleetPesa FAQ</strong><p>Need help with remittances or fleet records? Open Settings to update your account details.</p></div>}
				</header>
				<section className="dashboard-content" aria-label="Fleet dashboard">
					<Outlet />
				</section>
				<BottomNav />
			</main>
		</div>
	)
}