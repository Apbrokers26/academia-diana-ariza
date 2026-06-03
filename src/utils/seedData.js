import { getCurrentMonth, prevMonth } from './dateHelpers'

const uid = () => Math.random().toString(36).slice(2, 11)

export function seedData() {
  const now = getCurrentMonth()   // 2026-06
  const prev = prevMonth(now)     // 2026-05

  const wallets = [
    { id: 'w1', name: 'Trabajo Empleado', icon: '💼', color: '#16a34a', createdAt: '2026-01-01' },
    { id: 'w2', name: 'Boutique Ropa',    icon: '🏪', color: '#7c3aed', createdAt: '2026-01-01' },
    { id: 'w3', name: 'Cuentas Pareja',   icon: '💑', color: '#dc2626', createdAt: '2026-01-01' }
  ]

  const categories = [
    { id: 'c1',  name: 'Vivienda',        icon: '🏠', color: '#6366f1', type: 'expense' },
    { id: 'c2',  name: 'Mercado',         icon: '🛒', color: '#f97316', type: 'expense' },
    { id: 'c3',  name: 'Transporte',      icon: '🚌', color: '#0ea5e9', type: 'expense' },
    { id: 'c4',  name: 'Salud',           icon: '💊', color: '#ec4899', type: 'expense' },
    { id: 'c5',  name: 'Entretenimiento', icon: '🎬', color: '#8b5cf6', type: 'expense' },
    { id: 'c6',  name: 'Restaurante',     icon: '🍽️', color: '#f59e0b', type: 'expense' },
    { id: 'c7',  name: 'Servicios',       icon: '💡', color: '#14b8a6', type: 'expense' },
    { id: 'c8',  name: 'Educación',       icon: '📚', color: '#3b82f6', type: 'expense' },
    { id: 'c9',  name: 'Ropa',            icon: '👕', color: '#d946ef', type: 'expense' },
    { id: 'c10', name: 'Otros',           icon: '📌', color: '#6b7280', type: 'expense' },
    { id: 'c11', name: 'Salario',         icon: '💰', color: '#16a34a', type: 'income' },
    { id: 'c12', name: 'Ventas',          icon: '🏷️', color: '#22c55e', type: 'income' },
    { id: 'c13', name: 'Transferencia',   icon: '💸', color: '#84cc16', type: 'income' }
  ]

  const mk = (id, walletId, type, amount, catId, note, date) => ({
    id,
    walletId,
    type,
    amount,
    categoryId: catId,
    note,
    date,
    month: date.substring(0, 7),
    createdAt: date + 'T08:00:00.000Z'
  })

  const transactions = [
    // ── Mayo (mes anterior) ──────────────────────────────
    mk('t01', 'w1', 'income',  3500000, 'c11', 'Quincena 1',         `${prev}-01`),
    mk('t02', 'w1', 'income',  3500000, 'c11', 'Quincena 2',         `${prev}-16`),
    mk('t03', 'w2', 'income',  1200000, 'c12', 'Ventas de ropa',     `${prev}-03`),
    mk('t04', 'w2', 'income',   800000, 'c12', 'Pedido especial',    `${prev}-20`),
    mk('t05', 'w3', 'income',   500000, 'c13', 'Aporte mensual',     `${prev}-01`),
    mk('t06', 'w3', 'expense',  800000, 'c1',  'Arriendo',           `${prev}-01`),
    mk('t07', 'w3', 'expense',  450000, 'c2',  'Mercado mensual',    `${prev}-03`),
    mk('t08', 'w1', 'expense',  120000, 'c3',  'SITP mes',           `${prev}-05`),
    mk('t09', 'w1', 'expense',   89000, 'c6',  'Almuerzos semana',   `${prev}-07`),
    mk('t10', 'w3', 'expense',  150000, 'c7',  'Agua, luz y gas',    `${prev}-10`),
    mk('t11', 'w1', 'expense',   24900, 'c5',  'Netflix',            `${prev}-15`),
    mk('t12', 'w2', 'expense',  320000, 'c9',  'Inventario blusas',  `${prev}-15`),
    mk('t13', 'w1', 'expense',   65000, 'c4',  'Farmacia Colsubsidio', `${prev}-18`),
    mk('t14', 'w1', 'expense',   45000, 'c8',  'Libro diseño',       `${prev}-22`),
    mk('t15', 'w2', 'expense',  180000, 'c6',  'Cumpleaños amiga',   `${prev}-25`),
    // ── Junio (mes actual) ───────────────────────────────
    mk('t16', 'w3', 'expense',  800000, 'c1',  'Arriendo junio',     `${now}-01`),
    mk('t17', 'w1', 'income',  3500000, 'c11', 'Quincena 1 junio',   `${now}-02`),
    mk('t18', 'w3', 'expense',   85000, 'c2',  'Mercadito semana',   `${now}-03`)
  ]

  const templates = [
    { id: 'tp1', name: 'Blusa Básica',    price: 45000,  unit: 'unidad',   walletId: 'w2' },
    { id: 'tp2', name: 'Pantalón Jean',   price: 120000, unit: 'unidad',   walletId: 'w2' },
    { id: 'tp3', name: 'Vestido Casual',  price: 85000,  unit: 'unidad',   walletId: 'w2' },
    { id: 'tp4', name: 'Zapatos Tenis',   price: 180000, unit: 'par',      walletId: 'w2' }
  ]

  const recurring = [
    {
      id: 'r1', walletId: 'w3', categoryId: 'c1',
      description: 'Arriendo',  amount: 800000, dayOfMonth: 1,
      active: true, notificationsEnabled: true, lastProcessedMonth: prev
    },
    {
      id: 'r2', walletId: 'w1', categoryId: 'c5',
      description: 'Netflix',   amount: 24900,  dayOfMonth: 15,
      active: true, notificationsEnabled: true, lastProcessedMonth: prev
    },
    {
      id: 'r3', walletId: 'w1', categoryId: 'c3',
      description: 'SITP (Bus)', amount: 120000, dayOfMonth: 5,
      active: true, notificationsEnabled: false, lastProcessedMonth: prev
    }
  ]

  return { wallets, categories, transactions, templates, recurring }
}
