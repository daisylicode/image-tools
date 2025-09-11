/**
 * EXIF Data Reader
 * Extracts EXIF metadata from images
 */
export class EXIFReader {
  static async readEXIF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const view = new DataView(e.target.result)
          const exif = this.parseEXIF(view)
          resolve(exif)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  static parseEXIF(view) {
    if (view.getUint16(0, false) !== 0xFFD8) {
      return null // Not a JPEG
    }

    const length = view.byteLength
    let offset = 2

    while (offset < length) {
      if (view.getUint16(offset, false) === 0xFFE1) {
        // APP1 marker (EXIF)
        const exifLength = view.getUint16(offset + 2, false)
        if (view.getUint32(offset + 4, false) === 0x45786966) {
          // 'Exif' string
          return this.parseEXIFBlock(view, offset + 8, exifLength - 8)
        }
        offset += exifLength + 2
      } else {
        offset += 2
      }
    }

    return null
  }

  static parseEXIFBlock(view, offset, length) {
    if (view.getUint16(offset, false) !== 0x0000) {
      return null
    }

    const littleEndian = view.getUint16(offset + 2, false) === 0x4949
    const ifdOffset = view.getUint32(offset + 4, littleEndian)
    
    return this.parseIFD(view, offset + ifdOffset, littleEndian)
  }

  static parseIFD(view, offset, littleEndian) {
    const entryCount = view.getUint16(offset, littleEndian)
    const entries = {}

    for (let i = 0; i < entryCount; i++) {
      const entryOffset = offset + 2 + (i * 12)
      const tag = view.getUint16(entryOffset, littleEndian)
      const type = view.getUint16(entryOffset + 2, littleEndian)
      const count = view.getUint32(entryOffset + 4, littleEndian)
      const valueOffset = view.getUint32(entryOffset + 8, littleEndian)

      let value
      if (type === 3 && count === 1) {
        // SHORT
        value = view.getUint16(entryOffset + 8, littleEndian)
      } else if (type === 4 && count === 1) {
        // LONG
        value = view.getUint32(entryOffset + 8, littleEndian)
      } else if (type === 5 && count === 1) {
        // RATIONAL
        const numerator = view.getUint32(valueOffset, littleEndian)
        const denominator = view.getUint32(valueOffset + 4, littleEndian)
        value = numerator / denominator
      } else if (type === 2) {
        // ASCII
        const bytes = new Uint8Array(view.buffer, valueOffset, count - 1)
        value = String.fromCharCode(...bytes)
      }

      const tagName = this.getEXIFTagName(tag)
      if (tagName) {
        entries[tagName] = value
      }
    }

    return entries
  }

  static getEXIFTagName(tag) {
    const tags = {
      0x010F: 'Make',
      0x0110: 'Model',
      0x0112: 'Orientation',
      0x829A: 'ExposureTime',
      0x829D: 'FNumber',
      0x8827: 'ISO',
      0x9003: 'DateTimeOriginal',
      0xA402: 'ExposureMode',
      0xA403: 'WhiteBalance',
      0xA406: 'SceneType'
    }
    return tags[tag]
  }

  static getOrientation(exif) {
    return exif?.Orientation || 1
  }

  static correctOrientation(canvas, orientation) {
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    switch (orientation) {
      case 2:
        // Flip horizontal
        ctx.translate(width, 0)
        ctx.scale(-1, 1)
        break
      case 3:
        // 180° rotate
        ctx.translate(width, height)
        ctx.rotate(Math.PI)
        break
      case 4:
        // Flip vertical
        ctx.translate(0, height)
        ctx.scale(1, -1)
        break
      case 5:
        // 90° rotate + flip horizontal
        ctx.rotate(0.5 * Math.PI)
        ctx.scale(1, -1)
        break
      case 6:
        // 90° rotate
        ctx.rotate(0.5 * Math.PI)
        ctx.translate(0, -height)
        break
      case 7:
        // -90° rotate + flip horizontal
        ctx.rotate(-0.5 * Math.PI)
        ctx.translate(-width, height)
        ctx.scale(1, -1)
        break
      case 8:
        // -90° rotate
        ctx.rotate(-0.5 * Math.PI)
        ctx.translate(-width, 0)
        break
    }
  }
}