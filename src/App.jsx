import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Dashboard from './components/Dashboard'
import TransactionList from './components/TransactionList'
import WalletsView from './components/WalletsView'
import SettingsPanel from './components/SettingsPanel'
import TransactionForm from './components/TransactionForm'
import BottomNav from './components/BottomNav'
import PrivacyToggle from './components/PrivacyToggle'
import MonthNavigator from './components/MonthNavigator'

const VIEW_TITLES = {
  dashboard:    'GastosFácil',
  transactions: 'Movimientos',
  wallets:      'Bolsillos',
  settings:     'Ajustes'
}

function Inner() {
  const [view,     setView]     = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editTx,   setEditTx]   = useState(null)

  const openAdd  = () => { setEditTx(null); setShowForm(true) }
  const openEdit = (tx) => { setEditTx(tx); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditTx(null) }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* ── Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-primary-600 dark:bg-primary-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span className="text-base font-bold text-white">
              {VIEW_TITLES[view]}
            </span>
          </div>

          {(view === 'dashboard' || view === 'transactions') && (
            <MonthNavigator />
          )}

          <PrivacyToggle />
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-20">
        {view === 'dashboard'    && <Dashboard    onAddTx={openAdd} />}
        {view === 'transactions' && <TransactionList onEdit={openEdit} />}
        {view === 'wallets'      && <WalletsView />}
        {view === 'settings'     && <SettingsPanel />}
      </main>

      {/* ── FAB ──────────────────────────────────────────── */}
      {view !== 'settings' && (
        <button
          onClick={openAdd}
          aria-label="Registrar movimiento"
          className="fixed bottom-[72px] right-4 z-40 w-14 h-14 rounded-full
            bg-primary-600 hover:bg-primary-700 active:bg-primary-800
            text-white text-2xl shadow-xl shadow-primary-600/30
            flex items-center justify-center transition-all active:scale-95"
        >
          +
        </button>
      )}

      {/* ── Bottom nav ───────────────────────────────────── */}
      <BottomNav view={view} setView={setView} />

      {/* ── Transaction form overlay ─────────────────────── */}
      {showForm && (
        <TransactionForm transaction={editTx} onClose={closeForm} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}
