/**
 * Theme Manager
 * Handles dark/light mode and theme preferences
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light'
    this.systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    this.listeners = new Set()
    
    this.init()
  }

  init() {
    // Apply saved theme or system preference
    this.applyTheme(this.currentTheme === 'system' ? this.systemTheme : this.currentTheme)
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.systemTheme = e.matches ? 'dark' : 'light'
      if (this.currentTheme === 'system') {
        this.applyTheme(this.systemTheme)
      }
    })
    
    // Listen for theme changes from other components
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        this.currentTheme = e.newValue || 'light'
        this.applyTheme(this.currentTheme === 'system' ? this.systemTheme : this.currentTheme)
      }
    })
  }

  setTheme(theme) {
    if (!['light', 'dark', 'system'].includes(theme)) return
    
    this.currentTheme = theme
    localStorage.setItem('theme', theme)
    
    const appliedTheme = theme === 'system' ? this.systemTheme : theme
    this.applyTheme(appliedTheme)
    
    // Notify listeners
    this.listeners.forEach(listener => listener(appliedTheme))
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    
    // Update CSS custom properties
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--bg-primary', '#0a0a0a')
      document.documentElement.style.setProperty('--bg-secondary', '#1a1a1a')
      document.documentElement.style.setProperty('--bg-tertiary', '#2a2a2a')
      document.documentElement.style.setProperty('--text-primary', '#ffffff')
      document.documentElement.style.setProperty('--text-secondary', '#b0b0b0')
      document.documentElement.style.setProperty('--accent', '#3b82f6')
      document.documentElement.style.setProperty('--accent-hover', '#2563eb')
      document.documentElement.style.setProperty('--border', '#3a3a3a')
      document.documentElement.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.3)')
      document.documentElement.style.setProperty('--success', '#10b981')
      document.documentElement.style.setProperty('--error', '#ef4444')
      document.documentElement.style.setProperty('--warning', '#f59e0b')
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#ffffff')
      document.documentElement.style.setProperty('--bg-secondary', '#f8fafc')
      document.documentElement.style.setProperty('--bg-tertiary', '#f1f5f9')
      document.documentElement.style.setProperty('--text-primary', '#0f172a')
      document.documentElement.style.setProperty('--text-secondary', '#64748b')
      document.documentElement.style.setProperty('--accent', '#3b82f6')
      document.documentElement.style.setProperty('--accent-hover', '#2563eb')
      document.documentElement.style.setProperty('--border', '#e2e8f0')
      document.documentElement.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
      document.documentElement.style.setProperty('--success', '#10b981')
      document.documentElement.style.setProperty('--error', '#ef4444')
      document.documentElement.style.setProperty('--warning', '#f59e0b')
    }
  }

  getCurrentTheme() {
    return this.currentTheme === 'system' ? this.systemTheme : this.currentTheme
  }

  toggleTheme() {
    const current = this.getCurrentTheme()
    this.setTheme(current === 'light' ? 'dark' : 'light')
  }

  onThemeChange(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

// Global theme manager instance
const themeManager = new ThemeManager()
export default themeManager