import { CarFront, Grid2X2, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navigation = [
	{ label: 'Dashboard', icon: Grid2X2, active: true },
	{ label: 'Fleet', icon: CarFront },
]

export function Sidebar() {
	const navigate = useNavigate()
	const { logout } = useAuth()

	function handleSignOut() {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<aside className="sidebar">
			<div className="brand">
				<div className="brand-mark"><CarFront size={19} strokeWidth={2.1} /></div>
				<span>FleetPesa</span>
			</div>

			<div className="owner-profile">
				<div className="owner-avatar">JD</div>
				<div>
					<strong>James David</strong>
					<span>Fleet Owner</span>
				</div>
			</div>

			<nav className="sidebar-nav" aria-label="Main navigation">
				{navigation.map(({ label, icon: Icon, active, badge }) => (
					<a className={`nav-item${active ? ' active' : ''}`} href={`#${label.toLowerCase()}`} key={label}>
						<Icon size={18} strokeWidth={1.8} />
						<span>{label}</span>
						{badge && <b>{badge}</b>}
					</a>
				))}
			</nav>

			<div className="sidebar-footer">
				<a className="nav-item" href="#settings"><Settings size={18} strokeWidth={1.8} /><span>Settings</span></a>
				<button className="nav-item" type="button" onClick={handleSignOut}><LogOut size={18} strokeWidth={1.8} /><span>Sign Out</span></button>
			</div>
		</aside>
	)
}
