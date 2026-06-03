import { usePrivacy } from '../hooks/usePrivacy'

export default function PrivacyToggle() {
  const { hidden, togglePrivacy } = usePrivacy()

  return (
    <button
      onClick={togglePrivacy}
      title={hidden ? 'Mostrar montos' : 'Ocultar montos'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        bg-white/20 hover:bg-white/30 dark:bg-gray-700 dark:hover:bg-gray-600
        text-white dark:text-gray-200 transition-colors select-none"
    >
      <span className="text-base">{hidden ? '👁️' : '🙈'}</span>
      <span className="hidden sm:inline">{hidden ? 'Mostrar' : 'Ocultar'}</span>
    </button>
  )
}
