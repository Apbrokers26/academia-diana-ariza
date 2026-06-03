import { useApp } from '../context/AppContext'
import { usePrivacy } from '../hooks/usePrivacy'
import { getWalletBalance, getMonthlyStats } from '../utils/calculations'
import { formatCurrency } from '../utils/dateHelpers'

export default function WalletCard({ wallet, active = false, onClick }) {
  const { transactions, settings } = useApp()
  const { hidden } = usePrivacy()

  const balance = getWalletBalance(wallet.id, transactions)
  const { income, expenses } = getMonthlyStats(settings.currentMonth, transactions, wallet.id)

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-52 rounded-2xl p-4 text-left transition-all
        shadow-sm border-2
        ${active
          ? 'border-2 scale-[1.02] shadow-md'
          : 'border-transparent bg-white dark:bg-gray-800 hover:shadow-md'
        }`}
      style={active ? { borderColor: wallet.color, background: wallet.color + '15' } : {}}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: wallet.color + '22' }}
        >
          {wallet.icon}
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: wallet.color + '20', color: wallet.color }}
        >
          {balance >= 0 ? '+' : ''}{hidden ? '••' : balance >= 0 ? 'positivo' : 'negativo'}
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 truncate">
        {wallet.name}
      </p>
      <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        {formatCurrency(balance, hidden)}
      </p>

      <div className="mt-3 flex justify-between text-[11px]">
        <span className="text-primary-600 dark:text-primary-400">
          ↑ {formatCurrency(income, hidden)}
        </span>
        <span className="text-red-500">
          ↓ {formatCurrency(expenses, hidden)}
        </span>
      </div>
    </button>
  )
}
