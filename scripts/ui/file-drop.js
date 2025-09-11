/**
 * File Drop Zone Component
 * Handles drag & drop file uploads with visual feedback
 */
export class FileDropZone extends HTMLElement {
  constructor() {
    super()
    this.isDragging = false
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    this.maxSize = 50 * 1024 * 1024 // 50MB
    this.onFilesDropped = null
    this.onFileSelected = null
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  render() {
    const text = this.getAttribute('text') || 'Drag & Drop image here or click to browse'
    const multiple = this.hasAttribute('multiple')
    
    this.innerHTML = `
      <div class="file-drop-zone">
        <div class="file-drop-content">
          <div class="file-drop-icon">📁</div>
          <div class="file-drop-text">
            <p class="file-drop-main-text">${text}</p>
            <p class="file-drop-sub-text">Supports JPG, PNG, WebP, GIF (Max 50MB)</p>
          </div>
          <input type="file" 
                 class="file-drop-input" 
                 accept="${this.allowedTypes.join(',')}"
                 ${multiple ? 'multiple' : ''}>
        </div>
        <div class="file-drop-preview"></div>
      </div>
    `
  }

  setupEventListeners() {
    const zone = this.querySelector('.file-drop-zone')
    const input = this.querySelector('.file-drop-input')
    
    // Drag and drop events
    zone.addEventListener('dragover', (e) => {
      e.preventDefault()
      this.handleDragOver(e)
    })
    
    zone.addEventListener('dragenter', (e) => {
      e.preventDefault()
      this.handleDragEnter(e)
    })
    
    zone.addEventListener('dragleave', (e) => {
      e.preventDefault()
      this.handleDragLeave(e)
    })
    
    zone.addEventListener('drop', (e) => {
      e.preventDefault()
      this.handleDrop(e)
    })
    
    // Click to browse
    zone.addEventListener('click', (e) => {
      if (e.target !== input) {
        input.click()
      }
    })
    
    // File selection
    input.addEventListener('change', (e) => {
      this.handleFileSelect(e.target.files)
    })
    
    // Paste from clipboard
    document.addEventListener('paste', (e) => {
      this.handlePaste(e)
    })
  }

  handleDragOver(e) {
    this.isDragging = true
    this.updateVisualState()
  }

  handleDragEnter(e) {
    this.isDragging = true
    this.updateVisualState()
  }

  handleDragLeave(e) {
    // Only consider it a leave if we're leaving the entire zone
    const rect = this.getBoundingClientRect()
    if (e.clientX < rect.left || e.clientX > rect.right || 
        e.clientY < rect.top || e.clientY > rect.bottom) {
      this.isDragging = false
      this.updateVisualState()
    }
  }

  handleDrop(e) {
    this.isDragging = false
    this.updateVisualState()
    
    const files = Array.from(e.dataTransfer.files)
    this.processFiles(files)
  }

  handleFileSelect(files) {
    const fileArray = Array.from(files)
    this.processFiles(fileArray)
  }

  handlePaste(e) {
    const items = Array.from(e.clipboardData.items)
    const imageItems = items.filter(item => item.type.startsWith('image/'))
    
    if (imageItems.length > 0) {
      const files = imageItems.map(item => item.getAsFile())
      this.processFiles(files)
    }
  }

  processFiles(files) {
    const validFiles = files.filter(file => this.validateFile(file))
    
    if (validFiles.length === 0) {
      this.showError('No valid image files found')
      return
    }
    
    // Show preview for single file
    if (validFiles.length === 1) {
      this.showPreview(validFiles[0])
    }
    
    // Trigger callbacks
    if (this.onFilesDropped) {
      this.onFilesDropped(validFiles)
    }
    
    if (this.onFileSelected && validFiles.length === 1) {
      this.onFileSelected(validFiles[0])
    }
  }

  validateFile(file) {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      this.showError(`Unsupported file type: ${file.type}`)
      return false
    }
    
    // Check file size
    if (file.size > this.maxSize) {
      this.showError(`File too large: ${this.formatFileSize(file.size)} (Max 50MB)`)
      return false
    }
    
    return true
  }

  showPreview(file) {
    const preview = this.querySelector('.file-drop-preview')
    const reader = new FileReader()
    
    reader.onload = (e) => {
      preview.innerHTML = `
        <div class="file-drop-preview-item">
          <img src="${e.target.result}" alt="Preview">
          <div class="file-drop-preview-info">
            <span class="file-drop-preview-name">${file.name}</span>
            <span class="file-drop-preview-size">${this.formatFileSize(file.size)}</span>
          </div>
        </div>
      `
    }
    
    reader.readAsDataURL(file)
  }

  updateVisualState() {
    const zone = this.querySelector('.file-drop-zone')
    
    if (this.isDragging) {
      zone.classList.add('dragging')
    } else {
      zone.classList.remove('dragging')
    }
  }

  async showError(message) {
    const toastManager = window.toastManager || (await import('@ui/toasts.js')).default
    toastManager.error(message, 3000)
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  reset() {
    const preview = this.querySelector('.file-drop-preview')
    preview.innerHTML = ''
    const input = this.querySelector('.file-drop-input')
    input.value = ''
  }

  // Public API
  setOnFilesDropped(callback) {
    this.onFilesDropped = callback
  }

  setOnFileSelected(callback) {
    this.onFileSelected = callback
  }

  setAllowedTypes(types) {
    this.allowedTypes = types
    this.render()
    this.setupEventListeners()
  }

  setMaxSize(size) {
    this.maxSize = size
  }
}

// Define custom element
customElements.define('file-drop-zone', FileDropZone)

export default FileDropZone