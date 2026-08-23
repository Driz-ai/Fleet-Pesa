const driverRemittances = [
	{ initials: 'JK', name: 'Joseph Kamau', type: 'Matatu', vehicle: 'KBZ 234K', collected: 4500, expected: 4500, status: 'Paid', time: '08:42 AM' },
	{ initials: 'GW', name: 'Grace Wanjiku', type: 'Boda Boda', vehicle: 'KCA 891B', collected: 1200, expected: 1500, status: 'Short', time: '09:15 AM', action: 'Review' },
	{ initials: 'PO', name: 'Peter Omondi', type: 'Matatu', vehicle: 'KDG 567M', collected: 0, expected: 4500, status: 'Late', time: '—' },
	{ initials: 'MA', name: 'Mary Achieng', type: 'Boda Boda', vehicle: 'KBF 112A', collected: 1500, expected: 1500, status: 'Paid', time: '07:55 AM' },
	{ initials: 'DM', name: 'David Mwangi', type: 'Matatu', vehicle: 'KDD 789P', collected: 0, expected: 4500, status: 'Overdue', time: '—', action: 'Review' },
	{ initials: 'FN', name: 'Faith Njeri', type: 'Boda Boda', vehicle: 'KCE 445T', collected: 1500, expected: 1500, status: 'Paid', time: '10:03 AM' },
	{ initials: 'SK', name: 'Samuel Kipchoge', type: 'Matatu', vehicle: 'KBM 678G', collected: 4500, expected: 4500, status: 'Paid', time: '11:20 AM' },
	{ initials: 'EN', name: 'Esther Nyambura', type: 'Boda Boda', vehicle: 'KCH 321R', collected: 900, expected: 1500, status: 'Short', time: '09:47 AM', action: 'Review' },
]

function formatAmount(value) {
	return `KES ${value.toLocaleString('en-KE')}`
}

function statusClass(status) {
	return `status-badge status-${status.toLowerCase()}`
}

export function BottomNav() {
	return (
		<section className="bottom-nav" aria-labelledby="remittances-title">
			<div className="table-heading">
				<div>
					<h2 id="remittances-title">Driver Remittances</h2>
					<p>Today's collection status</p>
				</div>
				<button className="filter-button" type="button" aria-label="Filter remittances">Filter</button>
			</div>
			<div className="remittances-table-wrap">
				<table className="remittances-table">
					<thead><tr><th>Driver</th><th>Vehicle</th><th>Collected</th><th>Status</th><th>Time</th><th aria-label="Actions" /></tr></thead>
					<tbody>
						{driverRemittances.map((driver) => (
							<tr key={driver.vehicle}>
								<td><div className="driver-cell"><span className="driver-table-avatar">{driver.initials}</span><span><strong>{driver.name}</strong><small>{driver.type}</small></span></div></td>
								<td className="vehicle-cell">{driver.vehicle}</td>
								<td><strong className="collected-amount">{formatAmount(driver.collected)}</strong><small className="expected-label">of {formatAmount(driver.expected)}</small></td>
								<td><span className={statusClass(driver.status)}>{driver.status}</span></td>
								<td className="time-cell">{driver.time}</td>
								<td className="action-cell">{driver.action && <button className="review-button" type="button">{driver.action}</button>}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}
