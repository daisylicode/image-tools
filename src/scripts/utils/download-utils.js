// Download Utilities
export class DownloadUtils {
    static downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static downloadCanvas(canvas, filename, type = 'image/png', quality = 0.9) {
        canvas.toBlob((blob) => {
            this.downloadFile(blob, filename);
        }, type, quality);
    }

    static downloadImage(img, filename, type = 'image/png', quality = 0.9) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        this.downloadCanvas(canvas, filename, type, quality);
    }

    static generateFilename(originalName, suffix, extension) {
        const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
        return `${nameWithoutExt}_${suffix}.${extension}`;
    }

    static copyToClipboard(blob) {
        return new Promise((resolve, reject) => {
            if (!navigator.clipboard || !navigator.clipboard.write) {
                reject(new Error('Clipboard API not supported'));
                return;
            }

            const item = new ClipboardItem({ [blob.type]: blob });
            navigator.clipboard.write([item])
                .then(() => resolve())
                .catch(reject);
        });
    }

    static shareFile(blob, filename) {
        return new Promise((resolve, reject) => {
            if (!navigator.share) {
                reject(new Error('Web Share API not supported'));
                return;
            }

            const file = new File([blob], filename, { type: blob.type });
            navigator.share({
                title: 'Check out this image!',
                text: 'I processed this image using Free Image Tools',
                files: [file]
            })
            .then(() => resolve())
            .catch(reject);
        });
    }
}