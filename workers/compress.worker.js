/**
 * Image Compression Worker
 * Handles image compression in a separate thread
 */

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
    // Create image from data URL using OffscreenCanvas (if available) or fallback
    if (typeof OffscreenCanvas !== 'undefined') {
      // Use OffscreenCanvas for better performance in workers
      const img = new Image()
      img.onload = function() {
        try {
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
          
          // Create OffscreenCanvas for compression
          const canvas = new OffscreenCanvas(width, height)
          const ctx = canvas.getContext('2d')
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Draw image
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to blob
          canvas.convertToBlob({
            type: `image/${format}`,
            quality: quality
          }).then(blob => {
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
            reader.onerror = () => reject(new Error('Failed to read blob'))
            reader.readAsDataURL(blob)
          }).catch(err => {
            reject(new Error('Canvas conversion failed: ' + err.message))
          })
        } catch (error) {
          reject(new Error('Image processing failed: ' + error.message))
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageData
    } else {
      // Fallback: return error for browsers without OffscreenCanvas support
      reject(new Error('OffscreenCanvas not supported in this browser. Please use the main thread compression.'))
    }
  })
}
