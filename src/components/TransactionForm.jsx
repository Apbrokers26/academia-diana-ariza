import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { today } from '../utils/dateHelpers'

const STEP = { TYPE: 1, DETAILS: 2 }

export default function TransactionForm({ transaction = null, onClose }) {
  const { wallets, categories, templates, addTransaction, updateTransaction } = useApp()

  const isEdit = !!transaction

  const [step,        setStep]        = useState(isEdit ? STEP.DETAILS : STEP.TYPE)
  const [type,        setType]        = useState(transaction?.type || 'expense')
  const [amount,      setAmount]      = useState(transaction?.amount?.toString() || '')
  const [walletId,    setWalletId]    = useState(transaction?.walletId || wallets[0]?.id || '')
  const [categoryId,  setCategoryId]  = useState(transaction?.categoryId || '')
  const [note,        setNote]        = useState(transaction?.note || '')
  const [date,        setDate]        = useState(transaction?.date || today())
  const [useTemplate, setUseTemplate] = useState(false)
  const [qty,         setQty]         = useState('1')

  const filteredCats = categories.filter(c => c.type === type || c.type === 'both')

  // auto-select first category when type changes
  useEffect(() => {
    if (!isEdit) {
      const first = categories.find(c => c.type === type || c.type === 'both')
      setCategoryId(first?.id || '')
    }
  }, [type])

  const applyTemplate = (tpl) => {
    const q = parseFloat(qty) || 1
    setAmount(String(tpl.price * q))
    setNote(tpl.name + (q > 1 ? ` x${q}` : ''))
    if (tpl.walletId) setWalletId(tpl.walletId)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(/[^0-9.]/g, ''))
    if (!parsed || !walletId || !categoryId) return

    const data = { type, amount: parsed, walletId, categoryId, note: note.trim(), date }
    if (isEdit) {
      updateTransaction(transaction.id, data)
    } else {
      addTransaction(data)
    }
    onClose()
  }

  const incomeTemplates = templates.filter(t => !t.walletId || t.walletId === walletId)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl
        shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar movimiento' : step === STEP.TYPE ? 'Tipo de movimiento' : 'Detalles'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* ── STEP 1: Choose type ─────────────────────────── */}
          {step === STEP.TYPE && !isEdit && (
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { v: 'expense', label: 'Gasto',   icon: '📤', color: 'border-red-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',  active: 'border-red-500 bg-red-50 dark:bg-red-900/20' },
                { v: 'income',  label: 'Ingreso',  icon: '📥', color: 'border-green-200 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20', active: 'border-green-500 bg-green-50 dark:bg-green-900/20' }
              ].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => { setType(opt.v); setStep(STEP.DETAILS) }}
                  className={`flex flex-col items-center justify-center gap-2 py-8
                    rounded-2xl border-2 transition-all font-medium
                    ${type === opt.v ? opt.active : opt.color}
                    text-gray-800 dark:text-gray-200`}
                >
                  <span className="text-4xl">{opt.icon}</span>
                  <span className="text-base">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 2: Details ─────────────────────────────── */}
          {(step === STEP.DETAILS || isEdit) && (
            <form id="txform" onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Type toggle (only when editing) */}
              {isEdit && (
                <div className="flex gap-2">
                  {['expense', 'income'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors
                        ${type === t
                          ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                    >
                      {t === 'expense' ? '📤 Gasto' : '📥 Ingreso'}
                    </button>
                  ))}
                </div>
              )}

              {/* Template quick-fill (income only) */}
              {type === 'income' && incomeTemplates.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setUseTemplate(!useTemplate)}
                    className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1"
                  >
                    <span>{useTemplate ? '▼' : '▶'}</span>
                    Usar plantilla de producto
                  </button>
                  {useTemplate && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Cantidad:</label>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={e => setQty(e.target.value)}
                          className="w-16 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {incomeTemplates.map(tpl => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => applyTemplate(tpl)}
                            className="text-left p-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200
                              dark:border-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                          >
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tpl.name}</p>
                            <p className="text-xs text-primary-600 dark:text-primary-400">
                              ${tpl.price.toFixed(2)} / {tpl.unit}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Monto (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                      text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                      focus:border-primary-400 focus:bg-white dark:focus:bg-gray-800 outline-none transition-colors"
                    autoFocus={!isEdit}
                  />
                </div>
              </div>

              {/* Wallet */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Bolsillo
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {wallets.map(w => (
                    <label
                      key={w.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors
                        ${walletId === w.id
                          ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'
                        }`}
                    >
                      <input
                        type="radio"
                        name="wallet"
                        value={w.id}
                        checked={walletId === w.id}
                        onChange={() => setWalletId(w.id)}
                        className="sr-only"
                      />
                      <span className="text-xl">{w.icon}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{w.name}</span>
                      {walletId === w.id && <span className="ml-auto text-primary-600">✓</span>}
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Categoría
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {filteredCats.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all
                        ${categoryId === cat.id
                          ? 'border-2 scale-95'
                          : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'
                        }`}
                      style={categoryId === cat.id ? { borderColor: cat.color, background: cat.color + '18' } : {}}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-[10px] text-center text-gray-600 dark:text-gray-400 leading-tight">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none transition-colors"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Nota <span className="font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mercado La 14, SITP semanal…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 border-2 border-gray-100 dark:border-gray-700 rounded-xl
                    text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800
                    focus:border-primary-400 outline-none transition-colors"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {(step === STEP.DETAILS || isEdit) && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
            {!isEdit && (
              <button
                type="button"
                onClick={() => setStep(STEP.TYPE)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                  text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                ← Atrás
              </button>
            )}
            <button
              type="submit"
              form="txform"
              className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700
                text-white text-sm font-bold shadow-lg shadow-primary-600/20 transition-colors"
            >
              {isEdit ? 'Guardar cambios' : type === 'income' ? '💰 Registrar ingreso' : '💸 Registrar gasto'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
