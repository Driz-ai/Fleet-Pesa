import { Bell, KeyRound, UserRound } from 'lucide-react'

const sections = [
	{ id: 'profile', label: 'Profile details', icon: UserRound },
	{ id: 'password', label: 'Password', icon: KeyRound },
	{ id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
	return (
		<div className="settings-page">
			<div className="settings-heading">
				<div>
					<p className="settings-eyebrow">Account</p>
					<h2>Settings</h2>
					<p>Manage your profile, security, and remittance alerts.</p>
				</div>
			</div>

			<div className="settings-layout">
				<nav className="settings-tabs" aria-label="Settings sections">
					{sections.map(({ id, label, icon: Icon }, index) => (
						<a className={`settings-tab${index === 0 ? ' active' : ''}`} href={`#${id}`} key={id}>
							<Icon size={17} strokeWidth={1.8} />
							<span>{label}</span>
						</a>
					))}
				</nav>

				<div className="settings-panels">
					<section className="settings-panel" id="profile">
						<div className="settings-panel-heading">
							<div><h3>Profile details</h3><p>Keep your contact details up to date.</p></div>
						</div>
						<div className="settings-form-grid">
							<label>Name<input type="text" placeholder="Your name" /></label>
							<label>Phone number<input type="tel" placeholder="0712345678" /></label>
						</div>
						<button className="settings-primary" type="button">Save profile</button>
					</section>

					<section className="settings-panel" id="password">
						<h3>Change password</h3><p>Use a strong password you do not use elsewhere.</p>
						<button className="settings-secondary" type="button">Update password</button>
					</section>

					<section className="settings-panel" id="notifications">
						<h3>Remittance alerts</h3><p>Choose where default remittance notifications should be sent.</p>
						<button className="settings-secondary" type="button">Save notification preference</button>
					</section>
				</div>
			</div>
		</div>
	)
}