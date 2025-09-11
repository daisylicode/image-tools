/**
 * Download Utilities
 * Handles downloading processed images and file operations
 */
export class DownloadUtils {
  static downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  static downloadCanvas(canvas, filename, type = 'image/png', quality = 0.9) {
    canvas.toBlob((blob) => {
      this.downloadFile(blob, filename)
    }, type, quality)
  }

  static downloadImage(img, filename, type = 'image/png', quality = 0.9) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    this.downloadCanvas(canvas, filename, type, quality)
  }

  static async copyToClipboard(blob) {
    try {
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error('Clipboard API not supported')
      }

      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  static async shareFile(blob, filename, title = 'Processed Image') {
    try {
      if (!navigator.share) {
        throw new Error('Web Share API not supported')
      }

      const file = new File([blob], filename, { type: blob.type })
      await navigator.share({
        title: title,
        text: 'Check out this processed image!',
        files: [file]
      })
      return true
    } catch (error) {
      console.error('Failed to share file:', error)
      return false
    }
  }

  static generateFilename(originalName, suffix, extension) {
    if (!originalName) {
      return `image_${suffix}.${extension}`
    }
    
    const nameWithoutExt = originalName.split('.').slice(0, -1).join('.')
    return `${nameWithoutExt}_${suffix}.${extension}`
  }

  static getFileExtension(mimeType) {
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/bmp': 'bmp'
    }
    return mimeToExt[mimeType] || 'png'
  }

  static async saveToSystem(blob, filename) {
    try {
      // Check if File System Access API is available
      if ('showSaveFilePicker' in window) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'Image files',
              accept: {
                'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
              }
            }
          ]
        })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
        return true
      }
    } catch (error) {
      console.error('Failed to save using File System Access API:', error)
    }

    // Fallback to regular download
    this.downloadFile(blob, filename)
    return true
  }

  static dataURLToBlob(dataURL) {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  static async canvasToBlob(canvas, type = 'image/png', quality = 0.9) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality)
    })
  }

  static async downloadMultipleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const { blob, filename } = files[i]
      // Add small delay between downloads to avoid browser blocking
      await new Promise(resolve => setTimeout(resolve, i * 100))
      this.downloadFile(blob, filename)
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