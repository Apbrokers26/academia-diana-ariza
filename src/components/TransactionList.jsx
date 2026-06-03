import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { usePrivacy } from '../hooks/usePrivacy'
import { formatCurrency, formatDate } from '../utils/dateHelpers'

const FILTERS = [
  { id: 'all',     label: 'Todos' },
  { id: 'income',  label: 'Ingresos' },
  { id: 'expense', label: 'Gastos' }
]

export default function TransactionList({ onEdit }) {
  const { wallets, categories, transactions, deleteTransaction, settings } = useApp()
  const { hidden } = usePrivacy()

  const [filter,       setFilter]   = useState('all')
  const [walletFilter, setWallet]   = useState('all')
  const [confirm,      setConfirm]  = useState(null)

  const { currentMonth } = settings

  const catById    = Object.fromEntries(categories.map(c => [c.id, c]))
  const walletById = Object.fromEntries(wallets.map(w => [w.id, w]))

  const list = transactions
    .filter(t => t.month === currentMonth)
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => walletFilter === 'all' || t.walletId === walletFilter)
    .sort((a, b) => b.date.localeCompare(a.date))

  // Group by date
  const grouped = list.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = []
    acc[tx.date].push(tx)
    return acc
  }, {})

  const handleDelete = (id) => {
    deleteTransaction(id)
    setConfirm(null)
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Filters */}
      <div className="sticky top-[72px] z-30 bg-gray-50 dark:bg-gray-900 pt-3 pb-2 px-4 space-y-2">
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${filter === f.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={walletFilter}
          onChange={e => setWallet(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 outline-none"
        >
          <option value="all">Todos los bolsillos</option>
          {wallets.map(w => (
            <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="mx-4 bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sin movimientos para este filtro
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, txs]) => (
          <div key={date} className="mx-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
              {formatDate(date)}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden
              divide-y divide-gray-50 dark:divide-gray-700">
              {txs.map(tx => {
                const cat    = catById[tx.categoryId]
                const wallet = walletById[tx.walletId]

                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-3 group">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: (cat?.color || '#6b7280') + '22' }}
                    >
                      {cat?.icon || '📌'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {tx.note || cat?.name || 'Sin nota'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="text-[11px] px-1.5 py-0.5 rounded-full"
                          style={{ background: wallet?.color + '22', color: wallet?.color }}
                        >
                          {wallet?.icon} {wallet?.name}
                        </span>
                        <span className="text-[11px] text-gray-400">{cat?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-sm font-bold ${
                          tx.type === 'income' ? 'text-primary-600 dark:text-primary-400' : 'text-red-500'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount, hidden)}
                      </span>

                      <div className="hidden group-hover:flex gap-1">
                        <button
                          onClick={() => onEdit(tx)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg
                            bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-primary-600 text-xs"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setConfirm(tx.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg
                            bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 text-xs"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      {/* Delete confirm */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirm(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
            <p className="text-2xl mb-2">🗑️</p>
            <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
              ¿Eliminar movimiento?
            </p>
            <p className="text-sm text-gray-500 mb-4">Esta acción no se puede deshacer</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
                  text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
