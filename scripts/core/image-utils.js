/**
 * Image Processing Utilities
 * High-level image processing functions
 */
export class ImageUtils {
  static async loadImage(source) {
    if (source instanceof File) {
      return await import('./loader.js').then(m => m.ImageLoader.fromFile(source))
    } else if (typeof source === 'string') {
      return await import('./loader.js').then(m => m.ImageLoader.fromUrl(source))
    } else {
      throw new Error('Invalid image source')
    }
  }

  static async processImage(imageData, operation, options = {}) {
    const { image } = imageData
    
    switch (operation) {
      case 'crop':
        return this.cropImage(image, options)
      case 'resize':
        return this.resizeImage(image, options)
      case 'compress':
        return this.compressImage(image, options)
      case 'merge':
        return this.mergeImages([image], options)
      case 'black-image':
        return this.createBlackImage(options)
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  static async cropImage(img, options) {
    const { x = 0, y = 0, width = img.width, height = img.height } = options
    const CanvasUtils = await import('./canvas-utils.js').then(m => m.CanvasUtils)
    return CanvasUtils.cropImage(img, x, y, width, height)
  }

  static async resizeImage(img, options) {
    const { width, height, maintainAspectRatio = true } = options
    const CanvasUtils = await import('./canvas-utils.js').then(m => m.CanvasUtils)
    return CanvasUtils.resizeImage(img, width, height, maintainAspectRatio)
  }

  static async compressImage(img, options) {
    const { quality = 0.8, maxWidth = 1920, maxHeight = 1080 } = options
    const CanvasUtils = await import('./canvas-utils.js').then(m => m.CanvasUtils)
    return CanvasUtils.compressImage(img, quality, maxWidth, maxHeight)
  }

  static async mergeImages(images, options) {
    const CanvasUtils = await import('./canvas-utils.js').then(m => m.CanvasUtils)
    return CanvasUtils.mergeImages(images, options)
  }

  static async createBlackImage(options) {
    const { width = 800, height = 600 } = options
    const CanvasUtils = await import('./canvas-utils.js').then(m => m.CanvasUtils)
    return CanvasUtils.createBlackImage(width, height)
  }

  static async getEXIFData(file) {
    const EXIFReader = await import('./exif.js').then(m => m.EXIFReader)
    return EXIFReader.readEXIF(file)
  }

  static async formatFileSize(bytes) {
    const ImageLoader = await import('./loader.js').then(m => m.ImageLoader)
    return ImageLoader.formatFileSize(bytes)
  }

  static validateImageFile(file) {
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

  static async loadImageFromClipboard() {
    const ImageLoader = await import('./loader.js').then(m => m.ImageLoader)
    return ImageLoader.fromClipboard()
  }

  static calculateOptimalSize(img, maxWidth = 1920, maxHeight = 1080) {
    let width = img.width
    let height = img.height

    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  }

  static async applyEXIFOrientation(img, file) {
    try {
      const exif = await this.getEXIFData(file)
      const orientation = exif?.Orientation || 1
      
      if (orientation === 1) return img

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      
      const EXIFReader = await import('./exif.js').then(m => m.EXIFReader)
      EXIFReader.correctOrientation(canvas, orientation)
      
      ctx.drawImage(img, 0, 0)
      return canvas
    } catch (error) {
      console.warn('Failed to apply EXIF orientation:', error)
      return img
    }
  }
}