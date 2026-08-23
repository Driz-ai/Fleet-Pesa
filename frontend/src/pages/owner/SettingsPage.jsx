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
	const [profileSaved, setProfileSaved] = useState(false)
	const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmation: '' })
	const [passwordState, setPasswordState] = useState({ loading: false, error: '', success: '' })
	const [notificationPreference, setNotificationPreference] = useState(user?.notification_preference || 'none')
	const [email, setEmail] = useState(user?.email || '')
	const [notificationState, setNotificationState] = useState({ loading: false, error: '', success: '' })

	async function handleProfileSubmit(event) {
		event.preventDefault()
		setProfileSaved(false)
		setProfileState({ loading: true, error: '', success: '' })
		try {
			const response = token?.startsWith('mock-token')
				? await new Promise((resolve) => window.setTimeout(() => resolve({ user: { ...user, name: name.trim(), phone: phone.trim() } }), 450))
				: await updateProfile({ name: name.trim(), phone: phone.trim() })
			setAuth({ token, user: response.user })
			setProfileState({ loading: false, error: '', success: '' })
			setProfileSaved(true)
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
			if (token?.startsWith('mock-token')) {
				await new Promise((resolve) => window.setTimeout(resolve, 450))
			} else {
				await updatePassword(passwords)
			}
			setPasswords({ currentPassword: '', newPassword: '', confirmation: '' })
			setPasswordState({ loading: false, error: '', success: 'Password updated successfully.' })
		} catch (error) {
			setPasswordState({ loading: false, error: error.message, success: '' })
		}
	}

	async function handleNotificationSubmit(event) {
		event.preventDefault()
		setNotificationState({ loading: true, error: '', success: '' })
		try {
			if (notificationPreference === 'email' && !/^\S+@\S+\.\S+$/.test(email)) {
				setNotificationState({ loading: false, error: 'Enter a valid email address for email alerts.', success: '' })
				return
			}
			const response = token?.startsWith('mock-token')
				? await new Promise((resolve) => window.setTimeout(() => resolve({ user: { ...user, notification_preference: notificationPreference, email } }), 450))
				: await updateProfile({ notification_preference: notificationPreference })
			setAuth({ token, user: response.user })
			setNotificationState({ loading: false, error: '', success: 'Notification preference saved.' })
		} catch (error) {
			setNotificationState({ loading: false, error: error.message, success: '' })
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
						{profileSaved && <div className="settings-success-card" role="status"><strong>Profile saved</strong><span>Your profile details are up to date.</span></div>}
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
						<form onSubmit={handleNotificationSubmit}>
							<div className="settings-preferences">
								{[['email', 'Email'], ['sms', 'SMS'], ['none', 'None']].map(([value, label]) => (
									<label key={value}><input type="radio" name="notification-preference" value={value} checked={notificationPreference === value} onChange={(event) => setNotificationPreference(event.target.value)} />{label}</label>
								))}
							</div>
							{notificationPreference === 'email' && <label className="settings-email-field">Alert email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>}
							{notificationState.error && <p className="settings-error" role="alert">{notificationState.error}</p>}
							{notificationState.success && <p className="settings-success" role="status">{notificationState.success}</p>}
							<button className="settings-secondary" type="submit" disabled={notificationState.loading}>{notificationState.loading ? 'Saving...' : 'Save notification preference'}</button>
						</form>
					</section>
				</div>
			</div>
		</div>
	)
}