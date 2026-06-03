export default function DonutChart({ data = [], size = 180, stroke = 36 }) {
  const R   = (size - stroke) / 2
  const C   = size / 2
  const circ = 2 * Math.PI * R

  const total = data.reduce((s, d) => s + d.amount, 0)

  let cumulative = 0
  const segments = data.map(item => {
    const len = total > 0 ? (item.amount / total) * circ : 0
    const seg = { ...item, len, offset: cumulative }
    cumulative += len
    return seg
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      {/* Background track */}
      <circle
        cx={C} cy={C} r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-gray-100 dark:text-gray-700"
      />

      {segments.length === 0 ? null : segments.map(seg => (
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

      {/* Centre label */}
      <text
        x={C} y={C - 6}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        fill="#111827"
        className="dark:fill-white"
      >
        {total > 0 ? `${Math.round(data[0]?.pct ?? 0)}%` : '–'}
      </text>
      <text
        x={C} y={C + 10}
        textAnchor="middle"
        fontSize="9"
        fontFamily="Inter, sans-serif"
        fill="#6b7280"
      >
        gastos
      </text>
    </svg>
  )
}
