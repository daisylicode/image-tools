/**
 * Toast Notification System
 * Shows non-intrusive notifications for user feedback
 */
export class ToastManager {
  constructor() {
    this.container = null
    this.toasts = []
    this.init()
  }

  init() {
    // Create toast container
    this.container = document.createElement('div')
    this.container.className = 'toast-container'
    this.container.setAttribute('role', 'status')
    this.container.setAttribute('aria-live', 'polite')
    document.body.appendChild(this.container)
  }

  show(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random()
    const toast = this.createToast(id, message, type)
    
    this.toasts.push({ id, element: toast, timeout: null })
    this.container.appendChild(toast)
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)
    
    // Auto-remove
    const timeout = setTimeout(() => {
      this.remove(id)
    }, duration)
    
    // Store timeout reference
    const toastObj = this.toasts.find(t => t.id === id)
    if (toastObj) {
      toastObj.timeout = timeout
    }
    
    return id
  }

  createToast(id, message, type) {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.setAttribute('data-toast-id', id)
    
    const icon = this.getIcon(type)
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">
        ×
      </button>
    `
    
    // Add click to dismiss
    toast.addEventListener('click', () => {
      this.remove(id)
    })
    
    return toast
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }
    return icons[type] || icons.info
  }

  remove(id) {
    const toastObj = this.toasts.find(t => t.id === id)
    if (!toastObj) return
    
    // Clear timeout
    if (toastObj.timeout) {
      clearTimeout(toastObj.timeout)
    }
    
    // Animate out
    toastObj.element.classList.remove('show')
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (toastObj.element.parentNode) {
        toastObj.element.parentNode.removeChild(toastObj.element)
      }
    }, 300)
    
    // Remove from array
    this.toasts = this.toasts.filter(t => t.id !== id)
  }

  success(message, duration) {
    return this.show(message, 'success', duration)
  }

  error(message, duration) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration) {
    return this.show(message, 'info', duration)
  }

  clear() {
    this.toasts.forEach(toast => {
      if (toast.timeout) {
        clearTimeout(toast.timeout)
      }
      if (toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element)
      }
    })
    this.toasts = []
  }
}

// Global toast manager instance
const toastManager = new ToastManager()
export default toastManager