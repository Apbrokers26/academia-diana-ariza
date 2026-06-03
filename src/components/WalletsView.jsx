import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { usePrivacy } from '../hooks/usePrivacy'
import { getWalletBalance, getMonthlyStats } from '../utils/calculations'
import { formatCurrency } from '../utils/dateHelpers'

const ICONS  = ['💼','🏪','💑','🏦','💵','🎯','🏠','✈️','🎓','💻','🌱','🐷']
const COLORS = ['#16a34a','#7c3aed','#dc2626','#0ea5e9','#f97316','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#6366f1']

const DEFAULT_FORM = { name: '', icon: '💼', color: '#16a34a' }

export default function WalletsView() {
  const { wallets, transactions, settings, addWallet, updateWallet, deleteWallet } = useApp()
  const { hidden } = usePrivacy()
  const { currentMonth } = settings

  const [showForm, setShowForm]     = useState(false)
  const [editId,   setEditId]       = useState(null)
  const [form,     setForm]         = useState(DEFAULT_FORM)
  const [confirm,  setConfirm]      = useState(null)

  const openAdd = () => { setForm(DEFAULT_FORM); setEditId(null); setShowForm(true) }
  const openEdit = (w) => {
    setForm({ name: w.name, icon: w.icon, color: w.color })
    setEditId(w.id)
    setShowForm(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editId) {
      updateWallet(editId, form)
    } else {
      addWallet(form)
    }
    setShowForm(false)
  }

  return (
    <div className="space-y-3 pb-4">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Mis bolsillos</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white
            rounded-xl text-sm font-semibold shadow-sm"
        >
          + Nuevo
        </button>
      </div>

      {wallets.map(w => {
        const balance  = getWalletBalance(w.id, transactions)
        const monthly  = getMonthlyStats(currentMonth, transactions, w.id)

        return (
          <div
            key={w.id}
            className="mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-4 flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: w.color + '22' }}
              >
                {w.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 dark:text-white">{w.name}</p>
                </div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                  {formatCurrency(balance, hidden)}
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-primary-600 dark:text-primary-400">
                    ↑ {formatCurrency(monthly.income, hidden)} este mes
                  </span>
                  <span className="text-red-500">
                    ↓ {formatCurrency(monthly.expenses, hidden)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => openEdit(w)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl
                    bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-primary-600 text-sm"
                >
                  ✎
                </button>
                <button
                  onClick={() => setConfirm(w.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl
                    bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 text-sm"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {wallets.length === 0 && (
        <div className="mx-4 bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-4xl mb-2">💰</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aún no tienes bolsillos
          </p>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full sm:max-w-sm bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl
            shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editId ? 'Editar bolsillo' : 'Nuevo bolsillo'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Trabajo, Negocio, Pareja…"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Ícono</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`w-9 h-9 rounded-xl text-xl transition-all
                        ${form.icon === ic ? 'scale-110 bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' : 'bg-gray-100 dark:bg-gray-800'}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Color</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {COLORS.map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color: col }))}
                      className={`w-7 h-7 rounded-full transition-transform
                        ${form.color === col ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      style={{ background: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                    text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold"
                >
                  {editId ? 'Guardar' : 'Crear bolsillo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirm(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
            <p className="text-2xl mb-2">🗑️</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              ¿Eliminar este bolsillo?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Se eliminarán también todos sus movimientos
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
                  text-sm font-semibold text-gray-600">Cancelar</button>
              <button onClick={() => { deleteWallet(confirm); setConfirm(null) }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
