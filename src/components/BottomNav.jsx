const TABS = [
  { id: 'dashboard',    label: 'Inicio',      icon: '🏠' },
  { id: 'transactions', label: 'Movimientos', icon: '📋' },
  { id: 'wallets',      label: 'Bolsillos',   icon: '💰' },
  { id: 'settings',     label: 'Ajustes',     icon: '⚙️' }
]

export default function BottomNav({ view, setView }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900
      border-t border-gray-100 dark:border-gray-800 safe-bottom">
      <div className="flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5
              transition-colors min-h-[56px]
              ${view === tab.id
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
              }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
