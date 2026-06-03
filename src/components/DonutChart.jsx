import { formatCurrency } from '../utils/dateHelpers'

export default function DonutChart({ data = [], size = 180, stroke = 36, hidden = false }) {
  const R    = (size - stroke) / 2
  const C    = size / 2
  const circ = 2 * Math.PI * R

  const total = data.reduce((s, d) => s + d.amount, 0)

  let cumulative = 0
  const segments = data.map(item => {
    const len = total > 0 ? (item.amount / total) * circ : 0
    const seg = { ...item, len, offset: cumulative }
    cumulative += len
    return seg
  })

  // Format compact: $1.2k, $12k, $1.2M
  const compact = (v) => {
    if (hidden) return '••••'
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000)     return `$${(v / 1_000).toFixed(1)}k`
    return `$${v.toFixed(0)}`
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      {/* Track de fondo */}
      <circle
        cx={C} cy={C} r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-gray-100 dark:text-gray-700"
      />

      {segments.map(seg => (
        <circle
          key={seg.id}
          cx={C} cy={C} r={R}
          fill="none"
          stroke={seg.color}
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${seg.len} ${circ - seg.len}`}
          strokeDashoffset={circ / 4 - seg.offset}
        />
      ))}

      {/* Monto total en el centro */}
      <text
        x={C} y={C - 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
        fill="#111827"
      >
        {compact(total)}
      </text>
      <text
        x={C} y={C + 11}
        textAnchor="middle"
        fontSize="9"
        fontFamily="Inter, sans-serif"
        fill="#6b7280"
      >
        en gastos
      </text>
    </svg>
  )
}
