export const getCurrentMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const today = () => new Date().toISOString().split('T')[0]

export const formatMonthLabel = (monthStr) => {
  const [year, month] = monthStr.split('-')
  const months = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ]
  return `${months[parseInt(month) - 1]} ${year}`
}

export const prevMonth = (monthStr) => {
  const [y, m] = monthStr.split('-').map(Number)
  return m === 1
    ? `${y - 1}-12`
    : `${y}-${String(m - 1).padStart(2, '0')}`
}

export const nextMonth = (monthStr) => {
  const [y, m] = monthStr.split('-').map(Number)
  return m === 12
    ? `${y + 1}-01`
    : `${y}-${String(m + 1).padStart(2, '0')}`
}

export const getMonthFromDate = (dateStr) => dateStr.substring(0, 7)

export const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export const formatCurrency = (amount, hidden = false) => {
  if (hidden) return '$ ••••••'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const isCurrentMonth = (monthStr) => monthStr === getCurrentMonth()
export const isFutureMonth = (monthStr) => monthStr > getCurrentMonth()
