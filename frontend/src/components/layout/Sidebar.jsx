import { CarFront, Grid2X2, LogOut, Settings } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navigation = [
	{ label: 'Dashboard', icon: Grid2X2, to: '/owner/dashboard' },
	{ label: 'Fleet', icon: CarFront, to: '/owner/fleet' },
]

export function Sidebar() {
	const navigate = useNavigate()
	const { logout } = useAuth()

	function handleSignOut() {
		logout()
		navigate('/login', {
			replace: true,
			state: { success: 'Successfully signed out.' },
		})
	}

	return (
		<aside className="sidebar">
			<div className="brand">
				<img className="brand-logo" src="/FleetPesa%20FavIcon.jpg" alt="FleetPesa" />
			</div>

			<div className="owner-profile">
				<div className="owner-avatar">JD</div>
				<div>
					<strong>James David</strong>
					<span>Fleet Owner</span>
				</div>
			</div>

			<nav className="sidebar-nav" aria-label="Main navigation">
				{navigation.map(({ label, icon: Icon, to, badge }) => (
					<NavLink
						className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
						to={to}
						key={label}
					>
						<Icon size={18} strokeWidth={1.8} />
						<span>{label}</span>
						{badge && <b>{badge}</b>}
					</NavLink>
				))}
			</nav>

			<div className="sidebar-footer">
				<NavLink
					className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
					to="/owner/settings"
				>
					<Settings size={18} strokeWidth={1.8} /><span>Settings</span>
				</NavLink>
				<button className="nav-item" type="button" onClick={handleSignOut}><LogOut size={18} strokeWidth={1.8} /><span>Sign Out</span></button>
			</div>
		</aside>
	)
}