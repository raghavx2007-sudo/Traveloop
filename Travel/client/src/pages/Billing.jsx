import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTrips, getTrip, getBudgetItems } from '../services/tripService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

/* ── helpers ── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const genInvoiceId = (id) =>
  'INV-' + id.toString().slice(-6).toUpperCase().replace(/[^A-Z0-9]/g, 'X')

/* ── Donut SVG ── */
const Donut = ({ pct = 0, over = false }) => {
  const r = 15.9
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  return (
    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--border)" strokeWidth="3.5" />
      <circle cx="18" cy="18" r={r} fill="none"
        stroke={over ? '#f43f5e' : '#0ea5e9'} strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════ */
const Billing = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const printRef = useRef(null)

  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(searchParams.get('trip') || '')
  const [trip, setTrip] = useState(null)
  const [budgetData, setBudgetData] = useState({ items: [], overall: {} })
  const [loading, setLoading] = useState(true)
  const [tripLoading, setTripLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending | paid
  const [taxRate] = useState(5)   // 5%
  const [discount] = useState(50) // flat $50

  /* load trip list */
  useEffect(() => {
    getTrips().then(r => {
      setTrips(r.data || [])
      if (!selectedTripId && r.data?.length > 0) {
        setSelectedTripId(r.data[0]._id)
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  /* load selected trip + budget */
  useEffect(() => {
    if (!selectedTripId) return
    setSearchParams({ trip: selectedTripId })
    setTripLoading(true)
    Promise.all([getTrip(selectedTripId), getBudgetItems(selectedTripId)])
      .then(([tripRes, budgetRes]) => {
        setTrip(tripRes.data)
        setBudgetData(budgetRes.data)
        setPaymentStatus('pending')
      })
      .catch(() => toast.error('Failed to load trip data'))
      .finally(() => setTripLoading(false))
  }, [selectedTripId])

  /* filtered trips for search */
  const filteredTrips = trips.filter(t =>
    t.trip_name.toLowerCase().includes(search.toLowerCase())
  )

  /* invoice line items from real budget data */
  const lineItems = (budgetData.items || []).map((item, i) => ({
    no: i + 1,
    category: item.category,
    description: item.item_name,
    qty: item.notes || '1',
    unitCost: item.estimated_cost || 0,
    amount: item.actual_cost || item.estimated_cost || 0,
  }))

  const subtotal  = lineItems.reduce((s, i) => s + i.amount, 0)
  const taxAmt    = Math.round(subtotal * taxRate / 100)
  const grandTotal = subtotal + taxAmt - discount
  const totalBudget = budgetData.overall?.total_estimated || 0
  const totalSpent  = budgetData.overall?.total_actual    || 0
  const budgetPct   = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0
  const isOver      = totalSpent > totalBudget && totalBudget > 0

  /* print / export */
  const handlePrint = () => window.print()

  const handleMarkPaid = () => {
    setPaymentStatus('paid')
    toast.success('Invoice marked as paid!')
  }

  const handleDownload = () => {
    toast.success('Invoice downloaded as PDF')
    handlePrint()
  }

  /* ── render ── */
  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 skeleton rounded-xl" />
      <div className="h-64 skeleton rounded-xl" />
      <div className="h-48 skeleton rounded-xl" />
    </div>
  )

  return (
    <div className="space-y-5 page-enter" ref={printRef}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-color">🧾 Billing & Invoices</h1>
          <p className="text-muted-color text-sm font-medium mt-0.5">Expense invoices for your trips</p>
        </div>

        {/* Search + Filter + Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-color text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search invoices…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-8 w-52 text-xs"
            />
          </div>
          <button className="btn-secondary btn-sm text-xs">Filter</button>
          <button className="btn-secondary btn-sm text-xs">Sort ↕</button>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Trip selector ── */}
      {filteredTrips.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {filteredTrips.map(t => (
            <button key={t._id}
              onClick={() => setSelectedTripId(t._id)}
              className={`btn-sm text-xs transition-all ${
                selectedTripId === t._id ? 'btn-primary' : 'btn-secondary'
              }`}>
              {t.trip_name}
            </button>
          ))}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="card empty-state py-20">
          <div className="empty-icon">🧾</div>
          <p className="text-primary-color font-semibold mb-2">No trips yet</p>
          <p className="text-muted-color text-sm mb-5">Create a trip and add budget items to generate an invoice</p>
          <Link to="/my-trips" className="btn-primary">Create a Trip</Link>
        </div>
      ) : tripLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 skeleton rounded-xl" />
          <div className="h-64 skeleton rounded-xl" />
        </div>
      ) : trip ? (
        <>
          {/* ── Back link ── */}
          <Link to={`/trips/${trip._id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-color hover:text-primary-color transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            back to {trip.trip_name}
          </Link>

          {/* ── Invoice header + Budget insights ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Invoice header — 2/3 */}
            <div className="lg:col-span-2 card p-5">
              <div className="flex gap-4">
                {/* Cover thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-theme">
                  {trip.cover_image ? (
                    <img src={`http://localhost:5000${trip.cover_image}`} alt={trip.trip_name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-3xl">✈️</div>
                  )}
                </div>

                {/* Trip info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-primary-color mb-0.5">{trip.trip_name}</h2>
                  <p className="text-xs text-muted-color mb-0.5">
                    {fmtDate(trip.start_date)} – {fmtDate(trip.end_date)} · {trip.destination_count} cities
                  </p>
                  <p className="text-xs text-muted-color mb-3">created by {user?.name}</p>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                    <div>
                      <span className="text-muted-color">Invoice Id</span>
                      <p className="font-mono font-semibold text-primary-color">{genInvoiceId(trip._id)}</p>
                    </div>
                    <div>
                      <span className="text-muted-color">Generated date</span>
                      <p className="font-semibold text-primary-color">{fmtDate(new Date())}</p>
                    </div>
                    <div className="mt-2">
                      <span className="text-muted-color">Traveler Details</span>
                      <div className="mt-0.5 space-y-0.5">
                        {/* Show stop cities as "traveler details" */}
                        {trip.stops?.length > 0
                          ? trip.stops.map(s => (
                              <p key={s._id} className="text-primary-color font-medium">{s.city_name}</p>
                            ))
                          : <p className="text-primary-color font-medium">{user?.name}</p>
                        }
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-muted-color">Payment status</span>
                      <p className={`font-semibold mt-0.5 ${paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget insights — 1/3 */}
            <div className="card p-5">
              <h3 className="text-xs font-semibold text-primary-color mb-4">Budget Insights</h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Donut pct={budgetPct} over={isOver} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm font-bold text-primary-color">{budgetPct}%</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-muted-color">
                    Total Budget: <span className="font-semibold text-primary-color">{fmt(totalBudget)}</span>
                  </p>
                  <p className="text-muted-color">
                    Total Spent: <span className={`font-semibold ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>{fmt(totalSpent)}</span>
                  </p>
                  <p className={`font-semibold ${isOver ? 'text-red-400' : 'text-primary-color'}`}>
                    {isOver ? 'Over by: ' : 'Remaining: '}
                    {fmt(Math.abs(totalBudget - totalSpent))}
                  </p>
                </div>
              </div>

              <Link to={`/trips/${trip._id}?tab=budget`}
                className="btn-secondary btn-sm w-full text-center text-xs">
                View Full Budget
              </Link>
            </div>
          </div>

          {/* ── Invoice table ── */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-theme" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-color w-10">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-color">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-color">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-color">Qty / Details</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-color">Unit Cost</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-color">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-color text-xs">
                        No budget items yet —{' '}
                        <Link to={`/trips/${trip._id}`} className="text-indigo-400 hover:underline">
                          add items in the Budget tab
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item) => (
                      <tr key={item.no} className="border-b border-theme hover:bg-indigo-500/3 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-color">{item.no}</td>
                        <td className="px-4 py-3 text-xs capitalize">
                          <span className="badge-indigo">{item.category}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-primary-color">{item.description}</td>
                        <td className="px-4 py-3 text-xs text-muted-color">{item.qty}</td>
                        <td className="px-4 py-3 text-xs text-right text-primary-color">{fmt(item.unitCost)}</td>
                        <td className="px-4 py-3 text-xs text-right font-semibold text-primary-color">{fmt(item.amount)}</td>
                      </tr>
                    ))
                  )}

                  {/* Empty filler rows to match wireframe look */}
                  {lineItems.length > 0 && lineItems.length < 4 &&
                    [...Array(4 - lineItems.length)].map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-theme">
                        <td className="px-4 py-3 text-xs text-muted-color/30">{lineItems.length + i + 1}</td>
                        <td colSpan={5} className="px-4 py-3" />
                      </tr>
                    ))
                  }
                </tbody>

                {/* Totals footer */}
                {lineItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-theme">
                      <td colSpan={4} />
                      <td className="px-4 py-2 text-xs text-right text-muted-color">Subtotal</td>
                      <td className="px-4 py-2 text-xs text-right font-semibold text-primary-color">{fmt(subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} />
                      <td className="px-4 py-1 text-xs text-right text-muted-color">Tax ({taxRate}%)</td>
                      <td className="px-4 py-1 text-xs text-right text-primary-color">{fmt(taxAmt)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} />
                      <td className="px-4 py-1 text-xs text-right text-muted-color">Discount</td>
                      <td className="px-4 py-1 text-xs text-right text-emerald-400">− {fmt(discount)}</td>
                    </tr>
                    <tr className="border-t-2 border-indigo-500/40" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <td colSpan={4} />
                      <td className="px-4 py-3 text-sm font-bold text-primary-color text-right">Grand Total</td>
                      <td className="px-4 py-3 text-sm font-bold text-indigo-400 text-right">{fmt(grandTotal)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleDownload} className="btn-secondary btn-sm">
              ⬇ Download Invoice
            </button>
            <button onClick={handlePrint} className="btn-secondary btn-sm">
              📄 Export as PDF
            </button>
            <div className="flex-1" />
            {paymentStatus === 'pending' ? (
              <button onClick={handleMarkPaid} className="btn-success btn-sm">
                ✓ Mark as Paid
              </button>
            ) : (
              <span className="badge-green text-sm px-4 py-2">✓ Paid</span>
            )}
          </div>
        </>
      ) : (
        <div className="card empty-state py-16">
          <div className="empty-icon">🧾</div>
          <p className="text-muted-color text-sm">Select a trip to view its invoice</p>
        </div>
      )}
    </div>
  )
}

export default Billing
