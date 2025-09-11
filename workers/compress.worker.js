/**
 * Image Compression Worker
 * Handles image compression in a separate thread
 */

// Import scripts for image processing
importScripts('https://cdnjs.cloudflare.com/ajax/libs/compressor.js/1.2.1/compressor.min.js')

self.onmessage = async function(e) {
  const { type, data, taskId } = e.data
  
  try {
    let result
    
    switch (type) {
      case 'compress':
        result = await compressImage(data)
        break
      default:
        throw new Error(`Unknown task type: ${type}`)
    }
    
    self.postMessage({
      success: true,
      data: result,
      taskId
    })
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
      taskId
    })
  }
}

async function compressImage(options) {
  const { imageData, quality = 0.8, maxWidth = null, maxHeight = null, format = 'jpeg' } = options
  
  return new Promise((resolve, reject) => {
    // Create image from data URL
    const img = new Image()
    img.onload = function() {
      // Calculate new dimensions
      let { width, height } = img
      
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      // Create canvas for compression
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Get compressed blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'))
            return
          }
          
          // Convert blob to data URL for transfer
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              compressedData: reader.result,
              originalSize: imageData.length,
              compressedSize: blob.size,
              width,
              height,
              format,
              quality
            })
          }
          reader.readAsDataURL(blob)
        },
        `image/${format}`,
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}

// Alternative compression implementation without external library
async function compressImageNative(options) {
  const { imageData, quality = 0.8, maxWidth = null, maxHeight = null, format = 'jpeg' } = options
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      let { width, height } = img
      
      // Calculate new dimensions
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'))
            return
          }
          
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              compressedData: reader.result,
              originalSize: imageData.length,
              compressedSize: blob.size,
              width,
              height,
              format,
              quality
            })
          }
          reader.readAsDataURL(blob)
        },
        `image/${format}`,
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}