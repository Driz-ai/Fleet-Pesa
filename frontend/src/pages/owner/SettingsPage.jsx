import { Bell, KeyRound, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { updateProfile } from '../../lib/api.js'

const sections = [
	{ id: 'profile', label: 'Profile details', icon: UserRound },
	{ id: 'password', label: 'Password', icon: KeyRound },
	{ id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
	const { user, setAuth, token } = useAuth()
	const [name, setName] = useState(user?.name || '')
	const [phone, setPhone] = useState(user?.phone || '')
	const [profileState, setProfileState] = useState({ loading: false, error: '', success: '' })

	async function handleProfileSubmit(event) {
		event.preventDefault()
		setProfileState({ loading: true, error: '', success: '' })
		try {
			const response = await updateProfile({ name: name.trim(), phone: phone.trim() })
			setAuth({ token, user: response.user })
			setProfileState({ loading: false, error: '', success: 'Profile updated successfully.' })
		} catch (error) {
			setProfileState({ loading: false, error: error.message, success: '' })
		}
	}

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
						<form onSubmit={handleProfileSubmit}>
							<div className="settings-form-grid">
								<label>Name<input type="text" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={120} /></label>
								<label>Phone number<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
							</div>
							{profileState.error && <p className="settings-error" role="alert">{profileState.error}</p>}
							{profileState.success && <p className="settings-success" role="status">{profileState.success}</p>}
							<button className="settings-primary" type="submit" disabled={profileState.loading}>{profileState.loading ? 'Saving...' : 'Save profile'}</button>
						</form>
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