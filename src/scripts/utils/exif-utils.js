// EXIF Utilities
export class ExifUtils {
    static async getExifData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const view = new DataView(e.target.result);
                    const exif = this.parseExif(view);
                    resolve(exif);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    static parseExif(view) {
        if (view.getUint16(0, false) !== 0xFFD8) {
            return null; // Not a JPEG
        }

        const length = view.byteLength;
        let offset = 2;

        while (offset < length) {
            if (view.getUint16(offset, false) === 0xFFE1) {
                // APP1 marker (EXIF)
                const exifLength = view.getUint16(offset + 2, false);
                if (view.getUint32(offset + 4, false) === 0x45786966) {
                    // 'Exif' string
                    return this.parseExifBlock(view, offset + 8, exifLength - 8);
                }
                offset += exifLength + 2;
            } else {
                offset += 2;
            }
        }

        return null;
    }

    static parseExifBlock(view, offset, length) {
        if (view.getUint16(offset, false) !== 0x0000) {
            return null;
        }

        const littleEndian = view.getUint16(offset + 2, false) === 0x4949;
        const ifdOffset = view.getUint32(offset + 4, littleEndian);
        
        return this.parseIfd(view, offset + ifdOffset, littleEndian);
    }

    static parseIfd(view, offset, littleEndian) {
        const entryCount = view.getUint16(offset, littleEndian);
        const entries = {};

        for (let i = 0; i < entryCount; i++) {
            const entryOffset = offset + 2 + (i * 12);
            const tag = view.getUint16(entryOffset, littleEndian);
            const type = view.getUint16(entryOffset + 2, littleEndian);
            const count = view.getUint32(entryOffset + 4, littleEndian);
            const valueOffset = view.getUint32(entryOffset + 8, littleEndian);

            let value;
            if (type === 3 && count === 1) {
                // SHORT
                value = view.getUint16(entryOffset + 8, littleEndian);
            } else if (type === 4 && count === 1) {
                // LONG
                value = view.getUint32(entryOffset + 8, littleEndian);
            } else if (type === 5 && count === 1) {
                // RATIONAL
                const numerator = view.getUint32(valueOffset, littleEndian);
                const denominator = view.getUint32(valueOffset + 4, littleEndian);
                value = numerator / denominator;
            } else if (type === 2) {
                // ASCII
                const bytes = new Uint8Array(view.buffer, valueOffset, count - 1);
                value = String.fromCharCode(...bytes);
            }

            const tagName = this.getExifTagName(tag);
            if (tagName) {
                entries[tagName] = value;
            }
        }

        return entries;
    }

    static getExifTagName(tag) {
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
        };
        return tags[tag];
    }

    static getOrientation(exif) {
        return exif?.Orientation || 1;
    }

    static correctImageOrientation(img, orientation) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        switch (orientation) {
            case 2:
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                break;
            case 3:
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.translate(canvas.width, canvas.height);
                ctx.rotate(Math.PI);
                break;
            case 4:
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.translate(0, canvas.height);
                ctx.scale(1, -1);
                break;
            case 5:
                canvas.width = img.height;
                canvas.height = img.width;
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
            case 6:
                canvas.width = img.height;
                canvas.height = img.width;
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -canvas.height);
                break;
            case 7:
                canvas.width = img.height;
                canvas.height = img.width;
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(canvas.width, -canvas.height);
                ctx.scale(-1, 1);
                break;
            case 8:
                canvas.width = img.height;
                canvas.height = img.width;
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-canvas.width, 0);
                break;
            default:
                canvas.width = img.width;
                canvas.height = img.height;
                break;
        }

        ctx.drawImage(img, 0, 0);
        return canvas;
    }
}