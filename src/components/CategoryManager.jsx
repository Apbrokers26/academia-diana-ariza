import { useState } from 'react'
import { useApp } from '../context/AppContext'

const ICONS = [
  '🏠','🛒','🚌','💊','🎬','🍽️','💡','📚','👕','📌',
  '💰','🏷️','💸','✈️','🎮','🐾','🎁','🍺','☕','💇'
]
const COLORS = [
  '#16a34a','#7c3aed','#dc2626','#0ea5e9','#f97316',
  '#8b5cf6','#ec4899','#14b8a6','#f59e0b','#6366f1',
  '#d946ef','#3b82f6','#22c55e','#6b7280'
]
const DEFAULT = { name: '', icon: '📌', color: '#6b7280', type: 'expense' }

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState(null)
  const [form,     setForm]     = useState(DEFAULT)

  const openAdd  = () => { setForm(DEFAULT); setEditId(null); setShowForm(true) }
  const openEdit = (c) => {
    setForm({ name: c.name, icon: c.icon, color: c.color, type: c.type })
    setEditId(c.id)
    setShowForm(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editId) {
      updateCategory(editId, form)
    } else {
      addCategory(form)
    }
    setShowForm(false)
  }

  const expense = categories.filter(c => c.type === 'expense' || c.type === 'both')
  const income  = categories.filter(c => c.type === 'income')

  const CatRow = ({ c }) => (
    <div className="flex items-center gap-2 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: c.color + '22' }}
      >
        {c.icon}
      </div>
      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{c.name}</span>
      <div className="flex gap-1">
        <button onClick={() => openEdit(c)}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary-600 text-xs">
          ✎
        </button>
        <button onClick={() => deleteCategory(c.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 text-xs">
          🗑
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Categorías</h3>
        <button
          onClick={openAdd}
          className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-xl font-semibold"
        >
          + Nueva
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">
            Gastos
          </p>
          {expense.map(c => <CatRow key={c.id} c={c} />)}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">
            Ingresos
          </p>
          {income.map(c => <CatRow key={c.id} c={c} />)}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full sm:max-w-sm bg-white dark:bg-gray-900
            rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {editId ? 'Editar categoría' : 'Nueva categoría'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Nombre</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoFocus
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tipo</label>
                <div className="flex gap-2 mt-1">
                  {['expense','income','both'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors
                        ${form.type === t
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                    >
                      {t === 'expense' ? 'Gasto' : t === 'income' ? 'Ingreso' : 'Ambos'}
                    </button>
                  ))}
                </div>
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
