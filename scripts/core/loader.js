/**
 * Image Loader Utility
 * Handles loading images from files, URLs, and clipboard
 */
export class ImageLoader {
  static async fromFile(file) {
    if (!this.validateFile(file)) {
      throw new Error('Invalid file type or size')
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => resolve({
          image: img,
          file: file,
          metadata: this.extractMetadata(file)
        })
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target.result
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  static async fromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve({
        image: img,
        url: url,
        metadata: { source: 'url' }
      })
      img.onerror = () => reject(new Error('Failed to load image from URL'))
      img.src = url
    })
  }

  static async fromClipboard() {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            const file = new File([blob], 'clipboard-image.png', { type: blob.type })
            return this.fromFile(file)
          }
        }
      }
      throw new Error('No image found in clipboard')
    } catch (error) {
      throw new Error('Failed to read from clipboard')
    }
  }

  static validateFile(file) {
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 
      'image/webp', 'image/gif', 'image/bmp'
    ]
    const maxSize = 50 * 1024 * 1024 // 50MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Unsupported file type')
    }

    if (file.size > maxSize) {
      throw new Error('File too large (max 50MB)')
    }

    return true
  }

  static extractMetadata(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}