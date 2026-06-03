/** Running balance of a wallet across ALL time */
export const getWalletBalance = (walletId, transactions) => {
  return transactions
    .filter(tx => tx.walletId === walletId)
    .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0)
}

/** Balance of a wallet BEFORE the given month (carryover) */
export const getCarryover = (walletId, month, transactions) => {
  return transactions
    .filter(tx => tx.walletId === walletId && tx.month < month)
    .reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0)
}

/** Stats for a specific month, optionally filtered by wallet */
export const getMonthlyStats = (month, transactions, walletId = null) => {
  let txs = transactions.filter(tx => tx.month === month)
  if (walletId) txs = txs.filter(tx => tx.walletId === walletId)
  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return { income, expenses, net: income - expenses }
}

/** Expense breakdown by category for a given month */
export const getCategoryBreakdown = (month, transactions, categories, walletId = null) => {
  let txs = transactions.filter(tx => tx.month === month && tx.type === 'expense')
  if (walletId) txs = txs.filter(tx => tx.walletId === walletId)

  const map = {}
  txs.forEach(tx => {
    map[tx.categoryId] = (map[tx.categoryId] || 0) + tx.amount
  })

  const total = Object.values(map).reduce((a, b) => a + b, 0)

  return Object.entries(map)
    .map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId)
      return {
        id: catId,
        name: cat?.name || 'Sin categoría',
        icon: cat?.icon || '📌',
        color: cat?.color || '#6b7280',
        amount,
        pct: total > 0 ? (amount / total) * 100 : 0
      }
    })
    .sort((a, b) => b.amount - a.amount)
}

/** Total stats across all wallets for a month */
export const getTotalMonthStats = (month, transactions) =>
  getMonthlyStats(month, transactions, null)
