/**
 * Image Inpainting Worker
 * Handles object removal and image inpainting in a separate thread
 */

self.onmessage = async function(e) {
  const { type, data, taskId } = e.data
  
  try {
    let result
    
    switch (type) {
      case 'inpaint':
        result = await inpaintImage(data)
        break
      case 'removeObject':
        result = await removeObject(data)
        break
      case 'healSelection':
        result = await healSelection(data)
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

async function inpaintImage(options) {
  const { imageData, maskData, method = 'telea' } = options
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw original image
      ctx.drawImage(img, 0, 0)
      
      // Get image data
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Create mask from mask data
      const mask = createMaskFromData(maskData, canvas.width, canvas.height)
      
      // Apply inpainting
      const result = applyInpainting(imageDataObj, mask, method)
      
      // Put result back to canvas
      ctx.putImageData(result, 0, 0)
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Inpainting failed'))
            return
          }
          
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              inpaintedData: reader.result,
              width: canvas.width,
              height: canvas.height,
              method
            })
          }
          reader.readAsDataURL(blob)
        },
        'image/png',
        1.0
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}

function createMaskFromData(maskData, width, height) {
  const mask = new Uint8ClampedArray(width * height)
  
  // Convert mask data to binary mask
  for (let i = 0; i < maskData.length; i += 4) {
    const alpha = maskData[i + 3]
    const index = i / 4
    mask[index] = alpha > 0 ? 255 : 0
  }
  
  return mask
}

function applyInpainting(imageData, mask, method) {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  
  // Simple inpainting implementation
  // This is a basic implementation - in production, you'd use more sophisticated algorithms
  
  const result = new ImageData(width, height)
  const resultData = result.data
  
  // Copy original image data
  for (let i = 0; i < data.length; i++) {
    resultData[i] = data[i]
  }
  
  // Apply inpainting based on method
  switch (method) {
    case 'telea':
      return applyTeleaInpainting(resultData, mask, width, height)
    case 'navier-stokes':
      return applyNavierStokesInpainting(resultData, mask, width, height)
    default:
      return applySimpleInpainting(resultData, mask, width, height)
  }
}

function applySimpleInpainting(data, mask, width, height) {
  // Simple inpainting: average of neighboring pixels
  const result = new Uint8ClampedArray(data)
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4
      
      if (mask[y * width + x] > 0) {
        // Calculate average of neighboring pixels
        let r = 0, g = 0, b = 0, a = 0
        let count = 0
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            
            const nx = x + dx
            const ny = y + dy
            const nIndex = (ny * width + nx) * 4
            
            if (mask[ny * width + nx] === 0) {
              r += data[nIndex]
              g += data[nIndex + 1]
              b += data[nIndex + 2]
              a += data[nIndex + 3]
              count++
            }
          }
        }
        
        if (count > 0) {
          result[index] = r / count
          result[index + 1] = g / count
          result[index + 2] = b / count
          result[index + 3] = a / count
        }
      }
    }
  }
  
  return new ImageData(result, width, height)
}

function applyTeleaInpainting(data, mask, width, height) {
  // Simplified Telea inpainting algorithm
  // In practice, this would use a more sophisticated implementation
  
  const result = new Uint8ClampedArray(data)
  const inpaintRadius = 3
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      
      if (mask[y * width + x] > 0) {
        // Find nearest boundary pixel
        const nearest = findNearestBoundary(x, y, mask, width, height)
        
        if (nearest) {
          const distance = Math.sqrt(
            Math.pow(x - nearest.x, 2) + Math.pow(y - nearest.y, 2)
          )
          
          if (distance <= inpaintRadius) {
            // Weighted average based on distance
            const weight = 1 - (distance / inpaintRadius)
            const nIndex = (nearest.y * width + nearest.x) * 4
            
            result[index] = data[index] * (1 - weight) + data[nIndex] * weight
            result[index + 1] = data[index + 1] * (1 - weight) + data[nIndex + 1] * weight
            result[index + 2] = data[index + 2] * (1 - weight) + data[nIndex + 2] * weight
            result[index + 3] = data[index + 3] * (1 - weight) + data[nIndex + 3] * weight
          }
        }
      }
    }
  }
  
  return new ImageData(result, width, height)
}

function applyNavierStokesInpainting(data, mask, width, height) {
  // Simplified Navier-Stokes inpainting
  // This would typically use diffusion equations
  
  const result = new Uint8ClampedArray(data)
  const iterations = 10
  
  for (let iter = 0; iter < iterations; iter++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4
        
        if (mask[y * width + x] > 0) {
          // Laplacian smoothing
          for (let c = 0; c < 4; c++) {
            const center = result[index + c]
            const neighbors = [
              result[((y - 1) * width + x) * 4 + c],
              result[((y + 1) * width + x) * 4 + c],
              result[(y * width + (x - 1)) * 4 + c],
              result[(y * width + (x + 1)) * 4 + c]
            ]
            
            const avg = neighbors.reduce((a, b) => a + b, 0) / neighbors.length
            result[index + c] = center * 0.5 + avg * 0.5
          }
        }
      }
    }
  }
  
  return new ImageData(result, width, height)
}

function findNearestBoundary(x, y, mask, width, height) {
  let minDistance = Infinity
  let nearest = null
  
  for (let dy = -10; dy <= 10; dy++) {
    for (let dx = -10; dx <= 10; dx++) {
      const nx = x + dx
      const ny = y + dy
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (mask[ny * width + nx] === 0) {
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < minDistance) {
            minDistance = distance
            nearest = { x: nx, y: ny }
          }
        }
      }
    }
  }
  
  return nearest
}

async function removeObject(options) {
  const { imageData, selection, method = 'content-aware' } = options
  
  // For now, use the same inpainting method
  return await inpaintImage({
    imageData,
    maskData: selection,
    method
  })
}

async function healSelection(options) {
  const { imageData, selection, sourcePoint } = options
  
  // Healing brush simulation
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function() {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw original image
      ctx.drawImage(img, 0, 0)
      
      // Apply healing effect
      applyHealingBrush(ctx, selection, sourcePoint)
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Healing failed'))
            return
          }
          
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              healedData: reader.result,
              width: canvas.width,
              height: canvas.height
            })
          }
          reader.readAsDataURL(blob)
        },
        'image/png',
        1.0
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}

function applyHealingBrush(ctx, selection, sourcePoint) {
  // Simple healing brush implementation
  // In practice, this would use texture synthesis
  
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const data = imageData.data
  
  // Apply healing by blending with source area
  for (let i = 0; i < selection.length; i += 4) {
    const alpha = selection[i + 3]
    
    if (alpha > 0) {
      const index = i / 4
      const x = index % imageData.width
      const y = Math.floor(index / imageData.width)
      
      // Calculate source position
      const sx = Math.floor(sourcePoint.x + (x - selection.centerX))
      const sy = Math.floor(sourcePoint.y + (y - selection.centerY))
      
      if (sx >= 0 && sx < imageData.width && sy >= 0 && sy < imageData.height) {
        const sourceIndex = (sy * imageData.width + sx) * 4
        
        // Blend target with source
        const blend = alpha / 255
        data[i] = data[i] * (1 - blend) + data[sourceIndex] * blend
        data[i + 1] = data[i + 1] * (1 - blend) + data[sourceIndex + 1] * blend
        data[i + 2] = data[i + 2] * (1 - blend) + data[sourceIndex + 2] * blend
        data[i + 3] = data[i + 3] * (1 - blend) + data[sourceIndex + 3] * blend
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
}