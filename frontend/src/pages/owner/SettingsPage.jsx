import { Bell, KeyRound, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { updatePassword, updateProfile } from '../../lib/api.js'

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
	const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmation: '' })
	const [passwordState, setPasswordState] = useState({ loading: false, error: '', success: '' })

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

	async function handlePasswordSubmit(event) {
		event.preventDefault()
		if (passwords.newPassword !== passwords.confirmation) {
			setPasswordState({ loading: false, error: 'New passwords do not match.', success: '' })
			return
		}
		setPasswordState({ loading: true, error: '', success: '' })
		try {
			await updatePassword(passwords)
			setPasswords({ currentPassword: '', newPassword: '', confirmation: '' })
			setPasswordState({ loading: false, error: '', success: 'Password updated successfully.' })
		} catch (error) {
			setPasswordState({ loading: false, error: error.message, success: '' })
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
						<form onSubmit={handlePasswordSubmit} className="settings-form-grid">
							<label>Current password<input type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required /></label>
							<label>New password<input type="password" autoComplete="new-password" minLength={6} value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required /></label>
							<label>Confirm new password<input type="password" autoComplete="new-password" minLength={6} value={passwords.confirmation} onChange={(event) => setPasswords({ ...passwords, confirmation: event.target.value })} required /></label>
							<div>
								{passwordState.error && <p className="settings-error" role="alert">{passwordState.error}</p>}
								{passwordState.success && <p className="settings-success" role="status">{passwordState.success}</p>}
								<button className="settings-secondary" type="submit" disabled={passwordState.loading}>{passwordState.loading ? 'Updating...' : 'Update password'}</button>
							</div>
						</form>
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