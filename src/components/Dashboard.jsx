import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { usePrivacy } from '../hooks/usePrivacy'
import { getTotalMonthStats, getCategoryBreakdown, getWalletBalance } from '../utils/calculations'
import { formatCurrency, formatDate } from '../utils/dateHelpers'
import WalletCard from './WalletCard'
import DonutChart from './DonutChart'

export default function Dashboard({ onAddTx }) {
  const { wallets, transactions, categories, settings } = useApp()
  const { hidden } = usePrivacy()
  const { currentMonth } = settings
  const [activeWallet, setActiveWallet] = useState(null)

  const stats      = getTotalMonthStats(currentMonth, transactions)
  const breakdown  = getCategoryBreakdown(currentMonth, transactions, categories, activeWallet)
  const spentPct   = stats.income > 0 ? Math.min((stats.expenses / stats.income) * 100, 100) : 0
  const totalBalance = wallets.reduce((s, w) => s + getWalletBalance(w.id, transactions), 0)

  const recent = transactions
    .filter(t => t.month === currentMonth && (!activeWallet || t.walletId === activeWallet))
    .slice(0, 8)

  const catById   = Object.fromEntries(categories.map(c => [c.id, c]))
  const walletById = Object.fromEntries(wallets.map(w => [w.id, w]))

  return (
    <div className="space-y-4 pb-4">
      {/* ── Total balance hero ─────────────────────────────── */}
      <div className="mx-4 mt-4 rounded-2xl bg-primary-600 dark:bg-primary-800 p-5 text-white shadow-lg">
        <p className="text-sm font-medium opacity-80 mb-1">Saldo acumulado total</p>
        <p className="text-4xl font-extrabold tracking-tight">
          {formatCurrency(totalBalance, hidden)}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Ingresado', value: stats.income,   color: 'text-green-300' },
            { label: 'Gastado',   value: stats.expenses, color: 'text-red-300' },
            { label: 'Del mes',   value: stats.net,      color: stats.net >= 0 ? 'text-green-300' : 'text-red-300' }
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/10 rounded-xl py-2 px-1">
              <p className={`text-sm font-bold ${color}`}>{formatCurrency(value, hidden)}</p>
              <p className="text-[11px] opacity-70 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-80 mb-1">
            <span>Gastado este mes</span>
            <span>{Math.round(spentPct)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                spentPct > 90 ? 'bg-red-400' : spentPct > 70 ? 'bg-yellow-300' : 'bg-green-300'
              }`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Wallet cards horizontal scroll ─────────────────── */}
      <div>
        <div className="flex items-center justify-between px-4 mb-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mis bolsillos</h2>
          {activeWallet && (
            <button
              onClick={() => setActiveWallet(null)}
              className="text-xs text-primary-600 dark:text-primary-400 font-medium"
            >
              Ver todos
            </button>
          )}
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {wallets.map(w => (
            <WalletCard
              key={w.id}
              wallet={w}
              active={activeWallet === w.id}
              onClick={() => setActiveWallet(activeWallet === w.id ? null : w.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Donut chart + legend ────────────────────────────── */}
      {breakdown.length > 0 && (
        <div className="mx-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Gastos por categoría
          </h2>
          <div className="flex gap-4 items-center">
            <div className="flex-shrink-0">
              <DonutChart data={breakdown} size={160} stroke={32} />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {breakdown.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">
                    {item.icon} {item.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex-shrink-0">
                    {formatCurrency(item.amount, hidden)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent transactions ─────────────────────────────── */}
      <div className="mx-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Movimientos recientes
          </h2>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sin movimientos este mes
            </p>
            <button
              onClick={onAddTx}
              className="mt-3 text-sm font-semibold text-primary-600 dark:text-primary-400"
            >
              + Registrar primero
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-gray-700">
            {recent.map(tx => {
              const cat    = catById[tx.categoryId]
              const wallet = walletById[tx.walletId]
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: (cat?.color || '#6b7280') + '22' }}
                  >
                    {cat?.icon || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {tx.note || cat?.name || 'Sin nota'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(tx.date)} · {wallet?.icon} {wallet?.name}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold flex-shrink-0 ${
                      tx.type === 'income'
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-red-500'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount, hidden)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
