import { useState } from 'react'
import { useApp } from '../context/AppContext'
import CategoryManager from './CategoryManager'
import ProductTemplates from './ProductTemplates'
import RecurringManager from './RecurringManager'

const SECTIONS = [
  { id: 'categories', label: 'Categorías',         icon: '🏷️' },
  { id: 'templates',  label: 'Plantillas',          icon: '📋' },
  { id: 'recurring',  label: 'Gastos recurrentes',  icon: '🔄' },
  { id: 'app',        label: 'Configuración',        icon: '⚙️' }
]

export default function SettingsPanel() {
  const { settings, toggleDarkMode, resetAllData } = useApp()
  const [section,      setSection]      = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const requestNotifPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones')
      return
    }
    const result = await Notification.requestPermission()
    if (result === 'granted') {
      new Notification('GastosFácil', {
        body: '¡Notificaciones activadas correctamente! 🎉'
      })
    }
  }

  if (section) {
    return (
      <div className="pb-4">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 sticky top-[72px] z-30
          bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setSection(null)}
            className="w-8 h-8 flex items-center justify-center rounded-xl
              bg-white dark:bg-gray-800 text-gray-500 hover:text-primary-600"
          >
            ←
          </button>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {SECTIONS.find(s => s.id === section)?.label}
          </h2>
        </div>
        <div className="px-4 pt-4">
          {section === 'categories' && <CategoryManager />}
          {section === 'templates'  && <ProductTemplates />}
          {section === 'recurring'  && <RecurringManager />}
          {section === 'app'        && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50 dark:divide-gray-700">
                {/* Dark mode */}
                <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌙</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Modo oscuro
                    </span>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-11 h-6 rounded-full transition-colors
                      ${settings.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                        ${settings.darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                    />
                  </button>
                </label>

                {/* Notifications */}
                <button
                  onClick={requestNotifPermission}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-xl">🔔</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Activar notificaciones
                  </span>
                  <span className="ml-auto text-gray-300 text-sm">›</span>
                </button>
              </div>

              {/* Danger zone */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setConfirmReset(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-xl">🗑️</span>
                  <span className="text-sm font-medium text-red-500">
                    Borrar todos los datos
                  </span>
                  <span className="ml-auto text-gray-300 text-sm">›</span>
                </button>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                GastosFácil v1.0 · Todos los datos se guardan localmente en tu dispositivo
              </p>
            </div>
          )}
        </div>

        {confirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmReset(false)} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl">
              <p className="text-3xl mb-2">⚠️</p>
              <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
                ¿Borrar todo?
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Se eliminarán todos tus bolsillos, movimientos y configuraciones. No se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
                    text-sm font-semibold text-gray-600">Cancelar</button>
                <button onClick={resetAllData}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">
                  Borrar todo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-3 pb-4">
      <h2 className="text-base font-bold text-gray-900 dark:text-white">Ajustes</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden
        divide-y divide-gray-50 dark:divide-gray-700">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl w-8">{s.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
              {s.label}
            </span>
            <span className="text-gray-300 text-sm">›</span>
          </button>
        ))}
      </div>

      {/* Quick dark mode toggle on main settings page */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-4 py-3.5
        flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌙</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo oscuro</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`relative w-11 h-6 rounded-full transition-colors
            ${settings.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
              ${settings.darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
          />
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
        GastosFácil v1.0 · Datos guardados localmente
      </p>
    </div>
  )
}
