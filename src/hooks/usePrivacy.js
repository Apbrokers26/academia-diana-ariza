import { useApp } from '../context/AppContext'

export function usePrivacy() {
  const { settings, togglePrivacy } = useApp()
  return { hidden: settings.privacyMode, togglePrivacy }
}
