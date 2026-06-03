import { getCurrentMonth, prevMonth } from './dateHelpers'

export function seedData() {
  const now  = getCurrentMonth()   // 2026-06
  const prev = prevMonth(now)      // 2026-05

  const wallets = [
    { id: 'w1', name: 'Main Job',      icon: '💼', color: '#16a34a', createdAt: '2026-01-01' },
    { id: 'w2', name: 'Side Business', icon: '🏪', color: '#7c3aed', createdAt: '2026-01-01' },
    { id: 'w3', name: 'Shared (Home)', icon: '🏠', color: '#dc2626', createdAt: '2026-01-01' }
  ]

  const categories = [
    { id: 'c1',  name: 'Housing',       icon: '🏠', color: '#6366f1', type: 'expense' },
    { id: 'c2',  name: 'Groceries',     icon: '🛒', color: '#f97316', type: 'expense' },
    { id: 'c3',  name: 'Transport',     icon: '🚌', color: '#0ea5e9', type: 'expense' },
    { id: 'c4',  name: 'Health',        icon: '💊', color: '#ec4899', type: 'expense' },
    { id: 'c5',  name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
    { id: 'c6',  name: 'Dining Out',    icon: '🍽️', color: '#f59e0b', type: 'expense' },
    { id: 'c7',  name: 'Utilities',     icon: '💡', color: '#14b8a6', type: 'expense' },
    { id: 'c8',  name: 'Education',     icon: '📚', color: '#3b82f6', type: 'expense' },
    { id: 'c9',  name: 'Clothing',      icon: '👕', color: '#d946ef', type: 'expense' },
    { id: 'c10', name: 'Other',         icon: '📌', color: '#6b7280', type: 'expense' },
    { id: 'c11', name: 'Salary',        icon: '💰', color: '#16a34a', type: 'income' },
    { id: 'c12', name: 'Sales',         icon: '🏷️', color: '#22c55e', type: 'income' },
    { id: 'c13', name: 'Transfer',      icon: '💸', color: '#84cc16', type: 'income' }
  ]

  const mk = (id, walletId, type, amount, catId, note, date) => ({
    id, walletId, type, amount, categoryId: catId,
    note, date, month: date.substring(0, 7),
    createdAt: date + 'T08:00:00.000Z'
  })

  const transactions = [
    // ── May (previous month) ─────────────────────────────
    mk('t01', 'w1', 'income',  2800.00, 'c11', 'Paycheck 1',          `${prev}-01`),
    mk('t02', 'w1', 'income',  2800.00, 'c11', 'Paycheck 2',          `${prev}-16`),
    mk('t03', 'w2', 'income',  1400.00, 'c12', 'Product sales',       `${prev}-03`),
    mk('t04', 'w2', 'income',   850.00, 'c12', 'Bulk order',          `${prev}-20`),
    mk('t05', 'w3', 'income',   600.00, 'c13', 'Monthly contribution',`${prev}-01`),
    mk('t06', 'w3', 'expense', 1200.00, 'c1',  'Rent',                `${prev}-01`),
    mk('t07', 'w3', 'expense',  380.00, 'c2',  'Monthly groceries',   `${prev}-03`),
    mk('t08', 'w1', 'expense',  120.00, 'c3',  'Monthly transit pass',`${prev}-05`),
    mk('t09', 'w1', 'expense',   78.50, 'c6',  'Work lunches',        `${prev}-07`),
    mk('t10', 'w3', 'expense',  185.00, 'c7',  'Water, power, gas',   `${prev}-10`),
    mk('t11', 'w1', 'expense',   15.99, 'c5',  'Netflix',             `${prev}-15`),
    mk('t12', 'w2', 'expense',  290.00, 'c9',  'Inventory restock',   `${prev}-15`),
    mk('t13', 'w1', 'expense',   42.00, 'c4',  'Pharmacy',            `${prev}-18`),
    mk('t14', 'w1', 'expense',   24.99, 'c8',  'Online course',       `${prev}-22`),
    mk('t15', 'w2', 'expense',   95.00, 'c6',  'Birthday dinner',     `${prev}-25`),
    // ── June (current month) ─────────────────────────────
    mk('t16', 'w3', 'expense', 1200.00, 'c1',  'Rent — June',         `${now}-01`),
    mk('t17', 'w1', 'income',  2800.00, 'c11', 'Paycheck 1 — June',   `${now}-02`),
    mk('t18', 'w3', 'expense',   64.30, 'c2',  'Weekly groceries',    `${now}-03`)
  ]

  const templates = [
    { id: 'tp1', name: 'Basic Tee',      price: 35.00, unit: 'unit', walletId: 'w2' },
    { id: 'tp2', name: 'Denim Jeans',    price: 89.00, unit: 'unit', walletId: 'w2' },
    { id: 'tp3', name: 'Casual Dress',   price: 65.00, unit: 'unit', walletId: 'w2' },
    { id: 'tp4', name: 'Sneakers',       price: 120.00, unit: 'pair', walletId: 'w2' }
  ]

  const recurring = [
    {
      id: 'r1', walletId: 'w3', categoryId: 'c1',
      description: 'Rent',        amount: 1200.00, dayOfMonth: 1,
      active: true, notificationsEnabled: true, lastProcessedMonth: prev
    },
    {
      id: 'r2', walletId: 'w1', categoryId: 'c5',
      description: 'Netflix',     amount: 15.99,  dayOfMonth: 15,
      active: true, notificationsEnabled: true, lastProcessedMonth: prev
    },
    {
      id: 'r3', walletId: 'w1', categoryId: 'c3',
      description: 'Transit Pass', amount: 120.00, dayOfMonth: 5,
      active: true, notificationsEnabled: false, lastProcessedMonth: prev
    }
  ]

  return { wallets, categories, transactions, templates, recurring }
}
