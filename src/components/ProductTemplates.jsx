import { useState } from 'react'
import { useApp } from '../context/AppContext'

const DEFAULT = { name: '', price: '', unit: 'unidad', walletId: '' }

export default function ProductTemplates() {
  const { templates, wallets, addTemplate, updateTemplate, deleteTemplate } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState(null)
  const [form,     setForm]     = useState(DEFAULT)

  const openAdd = () => { setForm(DEFAULT); setEditId(null); setShowForm(true) }
  const openEdit = (t) => {
    setForm({ name: t.name, price: String(t.price), unit: t.unit, walletId: t.walletId || '' })
    setEditId(t.id)
    setShowForm(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    if (!form.name.trim() || !price) return
    const data = { name: form.name.trim(), price, unit: form.unit, walletId: form.walletId || null }
    if (editId) {
      updateTemplate(editId, data)
    } else {
      addTemplate(data)
    }
    setShowForm(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Plantillas de productos</h3>
        <button
          onClick={openAdd}
          className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-xl font-semibold"
        >
          + Nuevo
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Guarda tus productos con precio fijo para registrar ventas rápido.
      </p>

      {templates.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
          Sin plantillas aún
        </p>
      ) : (
        <div className="space-y-2">
          {templates.map(t => {
            const wallet = wallets.find(w => w.id === t.walletId)
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${t.price.toFixed(2)} / {t.unit}
                    {wallet && ` · ${wallet.icon} ${wallet.name}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(t)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg
                      bg-white dark:bg-gray-700 text-gray-400 hover:text-primary-600 text-xs"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteTemplate(t.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg
                      bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 text-xs"
                  >
                    🗑
                  </button>
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
              {editId ? 'Editar plantilla' : 'Nueva plantilla'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Blusa Básica"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoFocus
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                      text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                      focus:border-primary-400 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Unidad</label>
                  <input
                    type="text"
                    placeholder="unidad, par, kg…"
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                      text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                      focus:border-primary-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Bolsillo (opcional)
                </label>
                <select
                  value={form.walletId}
                  onChange={e => setForm(f => ({ ...f, walletId: e.target.value }))}
                  className="mt-1 w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none"
                >
                  <option value="">Sin bolsillo específico</option>
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                  ))}
                </select>
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
