const PREFIX = 'gf_'

export const storage = {
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw !== null ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error('localStorage error:', e)
    }
  },
  remove: (key) => localStorage.removeItem(PREFIX + key),
  clearAll: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  }
}
