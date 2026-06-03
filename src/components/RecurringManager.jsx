import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getCurrentMonth, formatCurrency } from '../utils/dateHelpers'

const DEFAULT = { description: '', amount: '', walletId: '', categoryId: '', dayOfMonth: '1', notificationsEnabled: false }

export default function RecurringManager() {
  const { recurring, wallets, categories, addRecurring, updateRecurring, deleteRecurring, addTransaction } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState(null)
  const [form,     setForm]     = useState(DEFAULT)

  const expenseCats = categories.filter(c => c.type === 'expense' || c.type === 'both')

  const openAdd  = () => { setForm(DEFAULT); setEditId(null); setShowForm(true) }
  const openEdit = (r) => {
    setForm({
      description: r.description,
      amount: String(r.amount),
      walletId: r.walletId,
      categoryId: r.categoryId,
      dayOfMonth: String(r.dayOfMonth),
      notificationsEnabled: r.notificationsEnabled
    })
    setEditId(r.id)
    setShowForm(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.description || !amount || !form.walletId || !form.categoryId) return
    const data = {
      description: form.description.trim(),
      amount,
      walletId: form.walletId,
      categoryId: form.categoryId,
      dayOfMonth: parseInt(form.dayOfMonth),
      notificationsEnabled: form.notificationsEnabled,
      active: true,
      lastProcessedMonth: getCurrentMonth()
    }
    if (editId) {
      updateRecurring(editId, data)
    } else {
      addRecurring(data)
    }
    setShowForm(false)
  }

  const duplicate = (r) => {
    const now  = getCurrentMonth()
    const d    = new Date()
    const day  = Math.min(r.dayOfMonth, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())
    const date = `${now}-${String(day).padStart(2, '0')}`
    addTransaction({
      type: 'expense',
      amount: r.amount,
      walletId: r.walletId,
      categoryId: r.categoryId,
      note: r.description + ' (recurrente)',
      date
    })
  }

  const catById    = Object.fromEntries(categories.map(c => [c.id, c]))
  const walletById = Object.fromEntries(wallets.map(w => [w.id, w]))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Gastos recurrentes</h3>
        <button
          onClick={openAdd}
          className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-xl font-semibold"
        >
          + Nuevo
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Configura gastos fijos mensuales y duplícalos con un toque.
      </p>

      {recurring.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
          Sin gastos recurrentes
        </p>
      ) : (
        <div className="space-y-2">
          {recurring.map(r => {
            const cat    = catById[r.categoryId]
            const wallet = walletById[r.walletId]
            return (
              <div
                key={r.id}
                className={`p-3 rounded-xl border-l-4 bg-gray-50 dark:bg-gray-800
                  ${r.active ? 'border-primary-500' : 'border-gray-300 opacity-60'}`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{ background: (cat?.color || '#6b7280') + '22' }}
                  >
                    {cat?.icon || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Día {r.dayOfMonth} · {wallet?.icon} {wallet?.name}
                    </p>
                    <p className="text-sm font-bold text-red-500 mt-0.5">
                      -{formatCurrency(r.amount)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={() => duplicate(r)}
                      className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30
                        text-primary-700 dark:text-primary-300 rounded-lg font-medium"
                    >
                      + Agregar este mes
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(r)}
                        className="flex-1 py-1 flex items-center justify-center rounded-lg
                          bg-white dark:bg-gray-700 text-gray-400 hover:text-primary-600 text-xs">
                        ✎
                      </button>
                      <button onClick={() => deleteRecurring(r.id)}
                        className="flex-1 py-1 flex items-center justify-center rounded-lg
                          bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 text-xs">
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full sm:max-w-sm bg-white dark:bg-gray-900
            rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editId ? 'Editar gasto recurrente' : 'Nuevo gasto recurrente'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Descripción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Arriendo, Netflix…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  autoFocus
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Monto</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                      text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                      focus:border-primary-400 outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Día</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={form.dayOfMonth}
                    onChange={e => setForm(f => ({ ...f, dayOfMonth: e.target.value }))}
                    className="mt-1 w-full px-3 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                      text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                      focus:border-primary-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bolsillo</label>
                <select
                  required
                  value={form.walletId}
                  onChange={e => setForm(f => ({ ...f, walletId: e.target.value }))}
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                >
                  <option value="">Seleccionar bolsillo</option>
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Categoría</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                >
                  <option value="">Seleccionar categoría</option>
                  {expenseCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.notificationsEnabled}
                  onChange={e => setForm(f => ({ ...f, notificationsEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Activar recordatorio (notificación)
                </span>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                    text-sm font-semibold text-gray-600 dark:text-gray-300">Cancelar</button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold">
                  {editId ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
