/**
 * Image Resize Worker
 * Handles image resizing operations in a separate thread
 */

self.onmessage = async function(e) {
  const { type, data, taskId } = e.data
  
  try {
    let result
    
    switch (type) {
      case 'resize':
        result = await resizeImage(data)
        break
      case 'thumbnail':
        result = await createThumbnail(data)
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

async function resizeImage(options) {
  const { 
    imageData, 
    width: targetWidth, 
    height: targetHeight, 
    maintainAspectRatio = true,
    quality = 0.9,
    format = 'jpeg'
  } = options
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      const originalWidth = img.width
      const originalHeight = img.height
      
      let newWidth = targetWidth
      let newHeight = targetHeight
      
      // Calculate dimensions maintaining aspect ratio
      if (maintainAspectRatio) {
        if (targetWidth && !targetHeight) {
          newHeight = (originalHeight * targetWidth) / originalWidth
        } else if (!targetWidth && targetHeight) {
          newWidth = (originalWidth * targetHeight) / originalHeight
        } else if (targetWidth && targetHeight) {
          const aspectRatio = originalWidth / originalHeight
          const targetRatio = targetWidth / targetHeight
          
          if (aspectRatio > targetRatio) {
            newHeight = (targetWidth / aspectRatio)
          } else {
            newWidth = (targetHeight * aspectRatio)
          }
        }
      }
      
      // Round to integers
      newWidth = Math.round(newWidth)
      newHeight = Math.round(newHeight)
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = newWidth
      canvas.height = newHeight
      
      // High quality resizing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Resize failed'))
            return
          }
          
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              resizedData: reader.result,
              originalWidth: originalWidth,
              originalHeight: originalHeight,
              newWidth: newWidth,
              newHeight: newHeight,
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

async function createThumbnail(options) {
  const { imageData, maxSize = 200, quality = 0.8 } = options
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      const originalWidth = img.width
      const originalHeight = img.height
      
      // Calculate thumbnail dimensions maintaining aspect ratio
      let thumbnailWidth, thumbnailHeight
      
      if (originalWidth > originalHeight) {
        thumbnailWidth = maxSize
        thumbnailHeight = (originalHeight * maxSize) / originalWidth
      } else {
        thumbnailHeight = maxSize
        thumbnailWidth = (originalWidth * maxSize) / originalHeight
      }
      
      // Round to integers
      thumbnailWidth = Math.round(thumbnailWidth)
      thumbnailHeight = Math.round(thumbnailHeight)
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = thumbnailWidth
      canvas.height = thumbnailHeight
      
      // High quality thumbnail
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Draw thumbnail
      ctx.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight)
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Thumbnail creation failed'))
            return
          }
          
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              thumbnailData: reader.result,
              originalWidth: originalWidth,
              originalHeight: originalHeight,
              thumbnailWidth: thumbnailWidth,
              thumbnailHeight: thumbnailHeight,
              quality
            })
          }
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}

// Batch resize for multiple images
async function batchResize(options) {
  const { images, width, height, maintainAspectRatio = true, quality = 0.9 } = options
  
  const results = []
  
  for (const image of images) {
    try {
      const result = await resizeImage({
        imageData: image.data,
        width,
        height,
        maintainAspectRatio,
        quality,
        format: image.format || 'jpeg'
      })
      results.push({
        name: image.name,
        ...result
      })
    } catch (error) {
      results.push({
        name: image.name,
        error: error.message
      })
    }
  }
  
  return {
    results,
    totalProcessed: images.length,
    successCount: results.filter(r => !r.error).length
  }
}