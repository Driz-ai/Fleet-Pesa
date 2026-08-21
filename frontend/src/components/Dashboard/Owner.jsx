import { useState } from 'react'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import ShortfallModal from '../../features/shortfall/ShortfallModal.jsx'

const weeklyRevenue = [
	{ day: 'Mon', revenue: 38000 },
	{ day: 'Tue', revenue: 45000 },
	{ day: 'Wed', revenue: 42000 },
	{ day: 'Thu', revenue: 39000 },
	{ day: 'Fri', revenue: 52000 },
	{ day: 'Sat', revenue: 62000 },
	{ day: 'Sun', revenue: 48000 },
]

const sampleShortfall = {
	id: 'rem-1042',
	driver_name: 'Peter Omondi',
	vehicle: 'KCA 482Q',
	expected_amount: 24000,
	actual_amount: 14600,
	timestamp: '2026-08-21T08:40:00Z',
}

function formatCurrency(value) {
	return `KES ${value.toLocaleString('en-KE')}`
}

function RevenueTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null

	return (
		<div className="chart-tooltip">
			<strong>{label}</strong>
			<span>{formatCurrency(payload[0].value)}</span>
		</div>
	)
}

export function Owner() {
	const [showShortfall, setShowShortfall] = useState(true)
	const [isResolved, setIsResolved] = useState(false)

	return (
		<div className="owner-dashboard">
			<section className="revenue-card" aria-labelledby="weekly-revenue-title">
				<div className="card-heading">
					<div>
						<h2 id="weekly-revenue-title">Weekly Revenue</h2>
						<p>Last 7 days · daily target KES 42,000</p>
					</div>
					<div className="chart-legend" aria-label="Chart legend">
						<span><i className="legend-dot revenue-dot" />Revenue</span>
						<span><i className="legend-dot target-dot" />Target</span>
					</div>
				</div>
				<div className="revenue-chart">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={weeklyRevenue} margin={{ top: 10, right: 8, left: 4, bottom: 4 }}>
							<CartesianGrid stroke="#e8eef4" strokeDasharray="3 4" vertical={false} />
							<XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9aacc2', fontSize: 12 }} />
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9aacc2', fontSize: 12 }}
								tickFormatter={(value) => `${value / 1000}k`}
								width={36}
								domain={[0, 80000]}
							/>
							<Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#cbd8e5', strokeDasharray: '4 4' }} />
							<Line type="monotone" dataKey="revenue" stroke="#203f68" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#0ca653', strokeWidth: 0 }} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</section>

			<section className={`${isResolved ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'} mt-6 rounded-2xl p-4 shadow-sm`}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className={`text-xs font-semibold uppercase tracking-[0.12em] ${isResolved ? 'text-emerald-700' : 'text-amber-700'}`}>
							{isResolved ? 'Resolved shortfall' : 'Shortfall alert'}
						</p>
						<h3 className="mt-1 text-lg font-bold text-slate-900">
							{isResolved ? 'Peter Omondi remittance has been resolved' : 'Peter Omondi has a remittance gap'}
						</h3>
					</div>
					<button
						type="button"
						onClick={() => setShowShortfall(true)}
						className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
					>
						{isResolved ? 'View resolved record' : 'View details'}
					</button>
				</div>
			</section>

			{showShortfall && (
				<ShortfallModal
					remittance={sampleShortfall}
					onClose={() => setShowShortfall(false)}
					onResolved={() => setIsResolved(true)}
				/>
			)}
		</div>
	)
}
