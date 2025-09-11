// Image Utilities
export class ImageUtils {
    static loadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Invalid file type'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    static loadImageFromUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    }

    static getImageData(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    static canvasToBlob(canvas, type = 'image/png', quality = 0.9) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, type, quality);
        });
    }

    static getFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, GIF, or BMP.');
        }
        
        if (file.size > maxSize) {
            throw new Error('File too large. Maximum size is 50MB.');
        }
        
        return true;
    }

    static getCanvasSize(img, maxWidth = 1920, maxHeight = 1080) {
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

        return { width: Math.round(width), height: Math.round(height) };
    }
}