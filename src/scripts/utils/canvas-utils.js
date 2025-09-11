// Canvas Utilities
export class CanvasUtils {
    static createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    static drawImageWithRotation(canvas, ctx, img, x, y, width, height, rotation = 0) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
    }

    static cropImage(img, x, y, width, height) {
        const canvas = this.createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        return canvas;
    }

    static resizeImage(img, width, height, maintainAspectRatio = true) {
        let finalWidth = width;
        let finalHeight = height;

        if (maintainAspectRatio) {
            const aspectRatio = img.width / img.height;
            if (width / height > aspectRatio) {
                finalWidth = height * aspectRatio;
            } else {
                finalHeight = width / aspectRatio;
            }
        }

        const canvas = this.createCanvas(finalWidth, finalHeight);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        return canvas;
    }

    static mergeImages(images, options = {}) {
        const {
            direction = 'horizontal',
            spacing = 0,
            backgroundColor = 'transparent',
            alignment = 'center'
        } = options;

        let totalWidth = 0;
        let totalHeight = 0;
        let maxWidth = 0;
        let maxHeight = 0;

        images.forEach(img => {
            maxWidth = Math.max(maxWidth, img.width);
            maxHeight = Math.max(maxHeight, img.height);
        });

        if (direction === 'horizontal') {
            totalWidth = images.reduce((sum, img) => sum + img.width, 0) + (images.length - 1) * spacing;
            totalHeight = maxHeight;
        } else {
            totalWidth = maxWidth;
            totalHeight = images.reduce((sum, img) => sum + img.height, 0) + (images.length - 1) * spacing;
        }

        const canvas = this.createCanvas(totalWidth, totalHeight);
        const ctx = canvas.getContext('2d');

        if (backgroundColor !== 'transparent') {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, totalWidth, totalHeight);
        }

        let currentX = 0;
        let currentY = 0;

        images.forEach(img => {
            let x = currentX;
            let y = currentY;

            if (direction === 'horizontal') {
                if (alignment === 'center') {
                    y = (maxHeight - img.height) / 2;
                } else if (alignment === 'bottom') {
                    y = maxHeight - img.height;
                }
                currentX += img.width + spacing;
            } else {
                if (alignment === 'center') {
                    x = (maxWidth - img.width) / 2;
                } else if (alignment === 'right') {
                    x = maxWidth - img.width;
                }
                currentY += img.height + spacing;
            }

            ctx.drawImage(img, x, y);
        });

        return canvas;
    }

    static compressImage(img, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
        // Calculate canvas size
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        width = Math.round(width);
        height = Math.round(height);
        const canvas = this.createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        return canvas;
    }

    static createBlackImage(width, height) {
        const canvas = this.createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        return canvas;
    }

    static applyFilter(canvas, filterType, options = {}) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        switch (filterType) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                break;
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                }
                break;
            case 'invert':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                break;
            case 'blur':
                // Simple box blur
                const tempData = new Uint8ClampedArray(data);
                const width = canvas.width;
                const height = canvas.height;
                const radius = options.radius || 2;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        let r = 0, g = 0, b = 0, a = 0;
                        let count = 0;
                        
                        for (let dy = -radius; dy <= radius; dy++) {
                            for (let dx = -radius; dx <= radius; dx++) {
                                const ny = y + dy;
                                const nx = x + dx;
                                
                                if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                                    const idx = (ny * width + nx) * 4;
                                    r += tempData[idx];
                                    g += tempData[idx + 1];
                                    b += tempData[idx + 2];
                                    a += tempData[idx + 3];
                                    count++;
                                }
                            }
                        }
                        
                        const idx = (y * width + x) * 4;
                        data[idx] = r / count;
                        data[idx + 1] = g / count;
                        data[idx + 2] = b / count;
                        data[idx + 3] = a / count;
                    }
                }
                break;
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }
}