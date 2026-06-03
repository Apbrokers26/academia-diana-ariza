import { useApp } from '../context/AppContext'
import { prevMonth, nextMonth, formatMonthLabel, getCurrentMonth, isFutureMonth } from '../utils/dateHelpers'

export default function MonthNavigator() {
  const { settings, setCurrentMonth } = useApp()
  const { currentMonth } = settings
  const isToday = currentMonth === getCurrentMonth()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentMonth(prevMonth(currentMonth))}
        className="w-8 h-8 flex items-center justify-center rounded-full
          text-white/80 hover:text-white hover:bg-white/20 transition-colors"
      >
        ‹
      </button>

      <button
        onClick={() => setCurrentMonth(getCurrentMonth())}
        className="text-sm font-semibold text-white min-w-[130px] text-center"
      >
        {formatMonthLabel(currentMonth)}
        {isToday && (
          <span className="ml-1.5 text-xs font-normal bg-white/25 px-1.5 py-0.5 rounded-full">
            actual
          </span>
        )}
      </button>

      <button
        onClick={() => !isFutureMonth(nextMonth(currentMonth)) && setCurrentMonth(nextMonth(currentMonth))}
        disabled={isFutureMonth(nextMonth(currentMonth))}
        className="w-8 h-8 flex items-center justify-center rounded-full
          text-white/80 hover:text-white hover:bg-white/20 transition-colors
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  )
}
