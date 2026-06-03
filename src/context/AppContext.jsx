import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { storage } from '../utils/storage'
import { seedData } from '../utils/seedData'
import { getCurrentMonth } from '../utils/dateHelpers'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const [wallets,      setWallets]      = useState([])
  const [categories,   setCategories]   = useState([])
  const [transactions, setTransactions] = useState([])
  const [templates,    setTemplates]    = useState([])
  const [recurring,    setRecurring]    = useState([])
  const [settings,     setSettings]     = useState({
    privacyMode: false,
    darkMode:    false,
    currency:    'COP',
    currentMonth: getCurrentMonth()
  })
  const [ready, setReady] = useState(false)

  // ── Bootstrap ───────────────────────────────────────────
  useEffect(() => {
    const saved = storage.get('wallets')
    if (!saved) {
      const seed = seedData()
      storage.set('wallets',      seed.wallets)
      storage.set('categories',   seed.categories)
      storage.set('transactions', seed.transactions)
      storage.set('templates',    seed.templates)
      storage.set('recurring',    seed.recurring)
      setWallets(seed.wallets)
      setCategories(seed.categories)
      setTransactions(seed.transactions)
      setTemplates(seed.templates)
      setRecurring(seed.recurring)
    } else {
      setWallets(saved)
      setCategories(storage.get('categories',   []))
      setTransactions(storage.get('transactions', []))
      setTemplates(storage.get('templates',    []))
      setRecurring(storage.get('recurring',    []))
    }
    const s = storage.get('settings')
    if (s) setSettings(prev => ({ ...prev, ...s, currentMonth: getCurrentMonth() }))
    setReady(true)
  }, [])

  // ── Persist ─────────────────────────────────────────────
  useEffect(() => { if (ready) storage.set('wallets',      wallets)      }, [wallets,      ready])
  useEffect(() => { if (ready) storage.set('categories',   categories)   }, [categories,   ready])
  useEffect(() => { if (ready) storage.set('transactions', transactions) }, [transactions, ready])
  useEffect(() => { if (ready) storage.set('templates',    templates)    }, [templates,    ready])
  useEffect(() => { if (ready) storage.set('recurring',    recurring)    }, [recurring,    ready])
  useEffect(() => { if (ready) storage.set('settings',     settings)     }, [settings,     ready])

  // ── Dark mode DOM sync ───────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  // ── Wallets ─────────────────────────────────────────────
  const addWallet = useCallback(data => {
    const w = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setWallets(p => [...p, w])
    return w
  }, [])

  const updateWallet = useCallback((id, data) =>
    setWallets(p => p.map(w => w.id === id ? { ...w, ...data } : w)), [])

  const deleteWallet = useCallback(id => {
    setWallets(p => p.filter(w => w.id !== id))
    setTransactions(p => p.filter(t => t.walletId !== id))
  }, [])

  // ── Categories ──────────────────────────────────────────
  const addCategory = useCallback(data => {
    const c = { ...data, id: crypto.randomUUID() }
    setCategories(p => [...p, c])
    return c
  }, [])

  const updateCategory = useCallback((id, data) =>
    setCategories(p => p.map(c => c.id === id ? { ...c, ...data } : c)), [])

  const deleteCategory = useCallback(id =>
    setCategories(p => p.filter(c => c.id !== id)), [])

  // ── Transactions ─────────────────────────────────────────
  const addTransaction = useCallback(data => {
    const t = {
      ...data,
      id: crypto.randomUUID(),
      month: data.date.substring(0, 7),
      createdAt: new Date().toISOString()
    }
    setTransactions(p => [t, ...p])
    return t
  }, [])

  const updateTransaction = useCallback((id, data) =>
    setTransactions(p => p.map(t =>
      t.id === id
        ? { ...t, ...data, month: (data.date ?? t.date).substring(0, 7) }
        : t
    )), [])

  const deleteTransaction = useCallback(id =>
    setTransactions(p => p.filter(t => t.id !== id)), [])

  // ── Templates ────────────────────────────────────────────
  const addTemplate = useCallback(data => {
    const tp = { ...data, id: crypto.randomUUID() }
    setTemplates(p => [...p, tp])
    return tp
  }, [])

  const updateTemplate = useCallback((id, data) =>
    setTemplates(p => p.map(t => t.id === id ? { ...t, ...data } : t)), [])

  const deleteTemplate = useCallback(id =>
    setTemplates(p => p.filter(t => t.id !== id)), [])

  // ── Recurring ────────────────────────────────────────────
  const addRecurring = useCallback(data => {
    const r = { ...data, id: crypto.randomUUID() }
    setRecurring(p => [...p, r])
    return r
  }, [])

  const updateRecurring = useCallback((id, data) =>
    setRecurring(p => p.map(r => r.id === id ? { ...r, ...data } : r)), [])

  const deleteRecurring = useCallback(id =>
    setRecurring(p => p.filter(r => r.id !== id)), [])

  // ── Settings ─────────────────────────────────────────────
  const updateSettings   = useCallback(data => setSettings(p => ({ ...p, ...data })), [])
  const togglePrivacy    = useCallback(() => setSettings(p => ({ ...p, privacyMode: !p.privacyMode })), [])
  const toggleDarkMode   = useCallback(() => setSettings(p => ({ ...p, darkMode: !p.darkMode })), [])
  const setCurrentMonth  = useCallback(m  => setSettings(p => ({ ...p, currentMonth: m })), [])
  const resetAllData     = useCallback(() => {
    storage.clearAll()
    window.location.reload()
  }, [])

  const value = {
    wallets, categories, transactions, templates, recurring, settings,
    addWallet, updateWallet, deleteWallet,
    addCategory, updateCategory, deleteCategory,
    addTransaction, updateTransaction, deleteTransaction,
    addTemplate, updateTemplate, deleteTemplate,
    addRecurring, updateRecurring, deleteRecurring,
    updateSettings, togglePrivacy, toggleDarkMode, setCurrentMonth, resetAllData
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-3">
          <div className="text-5xl">💰</div>
          <p className="text-gray-400 text-sm">Cargando GastosFácil…</p>
        </div>
      </div>
    )
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
