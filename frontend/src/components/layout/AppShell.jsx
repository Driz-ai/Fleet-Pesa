import { Bell, CircleHelp } from 'lucide-react'
import { Owner } from '../Dashboard/Owner'
import { Sidebar } from './Sidebar'

export function AppShell() {
	return (
		<div className="app-shell">
			<Sidebar />
			<main className="main-content">
				<header className="topbar">
					<div>
						<h1>Dashboard</h1>
						<p>Thursday, 20 August 2026</p>
					</div>
					<div className="topbar-actions">
						<button className="icon-button" aria-label="Help">
							<CircleHelp size={19} strokeWidth={1.8} />
						</button>
						<button className="icon-button notification-button" aria-label="Notifications">
							<Bell size={20} strokeWidth={1.8} />
							<span />
						</button>
						<div className="topbar-avatar">MO</div>
					</div>
				</header>
				<section className="dashboard-content" aria-label="Fleet dashboard">
					<Owner />
				</section>
			</main>
		</div>
	)
}
