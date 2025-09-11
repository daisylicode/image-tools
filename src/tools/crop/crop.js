// Crop Tool Implementation
import { ImageUtils, CanvasUtils, DownloadUtils } from '/scripts/utils/index.js';
import { trackToolUsage, trackFileUpload, trackFileDownload } from '/scripts/analytics.js';

class CropTool {
    constructor() {
        this.originalImage = null;
        this.canvas = null;
        this.ctx = null;
        this.cropData = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            startX: 0,
            startY: 0,
            isDragging: false,
            isResizing: false,
            resizeHandle: null
        };
        this.aspectRatio = 'free';
        this.customRatios = {
            '1:1': 1,
            '16:9': 16/9,
            '9:16': 9/16,
            '4:3': 4/3,
            '3:2': 3/2
        };
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadImageFromURL();
    }

    setupElements() {
        this.imageUploader = document.getElementById('imageUploader');
        this.controlsPanel = document.getElementById('controlsPanel');
        this.previewContainer = document.getElementById('previewContainer');
        this.resultContainer = document.getElementById('resultContainer');
        this.canvas = document.getElementById('cropCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cropOverlay = document.getElementById('cropOverlay');
        this.aspectRatioSelect = document.getElementById('aspectRatio');
        this.cropWidthInput = document.getElementById('cropWidth');
        this.cropHeightInput = document.getElementById('cropHeight');
        this.maintainAspectRatioCheckbox = document.getElementById('maintainAspectRatio');
        this.cropBtn = document.getElementById('cropBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newImageBtn = document.getElementById('newImageBtn');
        this.resultImage = document.getElementById('resultImage');
        this.selectionInfo = document.getElementById('selectionInfo');
        this.originalInfo = document.getElementById('originalInfo');
    }

    setupEventListeners() {
        // Image uploader
        if (this.imageUploader) {
            this.imageUploader.onImageUpload = (images) => {
                this.handleImageUpload(images[0]);
            };
        }

        // Aspect ratio change
        this.aspectRatioSelect.addEventListener('change', () => {
            this.aspectRatio = this.aspectRatioSelect.value;
            this.updateCropArea();
        });

        // Dimension inputs
        this.cropWidthInput.addEventListener('input', () => {
            this.updateCropFromInputs();
        });

        this.cropHeightInput.addEventListener('input', () => {
            this.updateCropFromInputs();
        });

        // Maintain aspect ratio
        this.maintainAspectRatioCheckbox.addEventListener('change', () => {
            this.updateCropArea();
        });

        // Buttons
        this.cropBtn.addEventListener('click', () => {
            this.cropImage();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetCrop();
        });

        this.downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });

        this.newImageBtn.addEventListener('click', () => {
            this.resetAll();
        });

        // Canvas events
        this.setupCanvasEvents();
    }

    setupCanvasEvents() {
        let isDrawing = false;
        let startX, startY;

        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if clicking on resize handle
            const handle = this.getResizeHandle(x, y);
            if (handle) {
                this.cropData.isResizing = true;
                this.cropData.resizeHandle = handle;
                return;
            }

            // Check if clicking inside crop area
            if (this.isInsideCropArea(x, y)) {
                this.cropData.isDragging = true;
                this.cropData.startX = x - this.cropData.x;
                this.cropData.startY = y - this.cropData.y;
                return;
            }

            // Start new selection
            isDrawing = true;
            startX = x;
            startY = y;
            this.cropData.x = x;
            this.cropData.y = y;
            this.cropData.width = 0;
            this.cropData.height = 0;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (this.cropData.isResizing) {
                this.handleResize(x, y);
            } else if (this.cropData.isDragging) {
                this.handleDrag(x, y);
            } else if (isDrawing) {
                this.cropData.width = x - startX;
                this.cropData.height = y - startY;
                this.updateCropArea();
            }

            this.updateCursor(x, y);
        });

        this.canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            this.cropData.isDragging = false;
            this.cropData.isResizing = false;
            this.cropData.resizeHandle = null;
        });

        // Touch events for mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let isDrawing = false;
        let startX, startY;

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            isDrawing = true;
            startX = x;
            startY = y;
            this.cropData.x = x;
            this.cropData.y = y;
            this.cropData.width = 0;
            this.cropData.height = 0;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            this.cropData.width = x - startX;
            this.cropData.height = y - startY;
            this.updateCropArea();
        });

        this.canvas.addEventListener('touchend', () => {
            isDrawing = false;
        });
    }

    async handleImageUpload(imageData) {
        try {
            this.originalImage = imageData.img;
            this.originalFile = imageData.file;
            
            // Track file upload
            trackFileUpload(imageData.file);
            
            // Setup canvas
            this.setupCanvas();
            
            // Show controls and preview
            this.controlsPanel.style.display = 'block';
            this.previewContainer.style.display = 'block';
            this.resultContainer.style.display = 'none';
            
            // Initialize crop area
            this.initializeCropArea();
            
            // Update info
            this.updateInfo();
            
            // Enable crop button
            this.cropBtn.disabled = false;
            
            // Track tool usage
            trackToolUsage('crop', 'upload');
            
        } catch (error) {
            console.error('Error handling image upload:', error);
            this.showError('Failed to load image');
        }
    }

    setupCanvas() {
        const maxSize = 600;
        const { width, height } = ImageUtils.getCanvasSize(this.originalImage, maxSize, maxSize);
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Draw image on canvas
        this.ctx.drawImage(this.originalImage, 0, 0, width, height);
    }

    initializeCropArea() {
        const padding = 20;
        this.cropData.x = padding;
        this.cropData.y = padding;
        this.cropData.width = this.canvas.width - (padding * 2);
        this.cropData.height = this.canvas.height - (padding * 2);
        
        this.updateCropArea();
    }

    updateCropArea() {
        if (!this.originalImage) return;

        // Apply aspect ratio
        if (this.aspectRatio !== 'free' && this.maintainAspectRatioCheckbox.checked) {
            let ratio;
            if (this.aspectRatio === 'original') {
                ratio = this.originalImage.width / this.originalImage.height;
            } else {
                ratio = this.customRatios[this.aspectRatio];
            }
            
            if (ratio) {
                this.cropData.height = this.cropData.width / ratio;
            }
        }

        // Constrain to canvas bounds
        this.cropData.x = Math.max(0, Math.min(this.cropData.x, this.canvas.width - this.cropData.width));
        this.cropData.y = Math.max(0, Math.min(this.cropData.y, this.canvas.height - this.cropData.height));
        this.cropData.width = Math.max(10, Math.min(this.cropData.width, this.canvas.width - this.cropData.x));
        this.cropData.height = Math.max(10, Math.min(this.cropData.height, this.canvas.height - this.cropData.y));

        // Update overlay
        this.updateOverlay();
        
        // Update inputs
        this.updateInputs();
        
        // Update info
        this.updateInfo();
    }

    updateOverlay() {
        const scaleX = this.canvas.width / this.canvas.offsetWidth;
        const scaleY = this.canvas.height / this.canvas.offsetHeight;
        
        this.cropOverlay.style.left = `${this.cropData.x / scaleX}px`;
        this.cropOverlay.style.top = `${this.cropData.y / scaleY}px`;
        this.cropOverlay.style.width = `${this.cropData.width / scaleX}px`;
        this.cropOverlay.style.height = `${this.cropData.height / scaleY}px`;
        
        this.cropOverlay.classList.add('active');
    }

    updateInputs() {
        const scaleX = this.originalImage.width / this.canvas.width;
        const scaleY = this.originalImage.height / this.canvas.height;
        
        this.cropWidthInput.value = Math.round(this.cropData.width * scaleX);
        this.cropHeightInput.value = Math.round(this.cropData.height * scaleY);
    }

    updateInfo() {
        const scaleX = this.originalImage.width / this.canvas.width;
        const scaleY = this.originalImage.height / this.canvas.height;
        
        this.selectionInfo.textContent = `${Math.round(this.cropData.width * scaleX)} x ${Math.round(this.cropData.height * scaleY)}`;
        this.originalInfo.textContent = `${this.originalImage.width} x ${this.originalImage.height}`;
    }

    updateCropFromInputs() {
        const scaleX = this.canvas.width / this.originalImage.width;
        const scaleY = this.canvas.height / this.originalImage.height;
        
        this.cropData.width = parseInt(this.cropWidthInput.value) * scaleX;
        this.cropData.height = parseInt(this.cropHeightInput.value) * scaleY;
        
        this.updateCropArea();
    }

    getResizeHandle(x, y) {
        const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'right', 'bottom', 'left'];
        const threshold = 10;
        
        for (let handle of handles) {
            if (this.isNearHandle(x, y, handle, threshold)) {
                return handle;
            }
        }
        return null;
    }

    isNearHandle(x, y, handle, threshold) {
        const handleX = this.getHandlePosition(handle).x;
        const handleY = this.getHandlePosition(handle).y;
        
        return Math.abs(x - handleX) <= threshold && Math.abs(y - handleY) <= threshold;
    }

    getHandlePosition(handle) {
        switch (handle) {
            case 'top-left':
                return { x: this.cropData.x, y: this.cropData.y };
            case 'top-right':
                return { x: this.cropData.x + this.cropData.width, y: this.cropData.y };
            case 'bottom-left':
                return { x: this.cropData.x, y: this.cropData.y + this.cropData.height };
            case 'bottom-right':
                return { x: this.cropData.x + this.cropData.width, y: this.cropData.y + this.cropData.height };
            case 'top':
                return { x: this.cropData.x + this.cropData.width / 2, y: this.cropData.y };
            case 'right':
                return { x: this.cropData.x + this.cropData.width, y: this.cropData.y + this.cropData.height / 2 };
            case 'bottom':
                return { x: this.cropData.x + this.cropData.width / 2, y: this.cropData.y + this.cropData.height };
            case 'left':
                return { x: this.cropData.x, y: this.cropData.y + this.cropData.height / 2 };
            default:
                return { x: 0, y: 0 };
        }
    }

    handleResize(x, y) {
        const handle = this.cropData.resizeHandle;
        
        switch (handle) {
            case 'top-left':
                this.cropData.width += this.cropData.x - x;
                this.cropData.height += this.cropData.y - y;
                this.cropData.x = x;
                this.cropData.y = y;
                break;
            case 'top-right':
                this.cropData.width = x - this.cropData.x;
                this.cropData.height += this.cropData.y - y;
                this.cropData.y = y;
                break;
            case 'bottom-left':
                this.cropData.width += this.cropData.x - x;
                this.cropData.height = y - this.cropData.y;
                this.cropData.x = x;
                break;
            case 'bottom-right':
                this.cropData.width = x - this.cropData.x;
                this.cropData.height = y - this.cropData.y;
                break;
            case 'top':
                this.cropData.height += this.cropData.y - y;
                this.cropData.y = y;
                break;
            case 'right':
                this.cropData.width = x - this.cropData.x;
                break;
            case 'bottom':
                this.cropData.height = y - this.cropData.y;
                break;
            case 'left':
                this.cropData.width += this.cropData.x - x;
                this.cropData.x = x;
                break;
        }
        
        this.updateCropArea();
    }

    handleDrag(x, y) {
        this.cropData.x = x - this.cropData.startX;
        this.cropData.y = y - this.cropData.startY;
        this.updateCropArea();
    }

    isInsideCropArea(x, y) {
        return x >= this.cropData.x && x <= this.cropData.x + this.cropData.width &&
               y >= this.cropData.y && y <= this.cropData.y + this.cropData.height;
    }

    updateCursor(x, y) {
        const handle = this.getResizeHandle(x, y);
        
        if (handle) {
            switch (handle) {
                case 'top-left':
                case 'bottom-right':
                    this.canvas.style.cursor = 'nw-resize';
                    break;
                case 'top-right':
                case 'bottom-left':
                    this.canvas.style.cursor = 'ne-resize';
                    break;
                case 'top':
                case 'bottom':
                    this.canvas.style.cursor = 'n-resize';
                    break;
                case 'left':
                case 'right':
                    this.canvas.style.cursor = 'e-resize';
                    break;
            }
        } else if (this.isInsideCropArea(x, y)) {
            this.canvas.style.cursor = 'move';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }
    }

    async cropImage() {
        if (!this.originalImage) return;

        this.cropBtn.disabled = true;
        this.cropBtn.querySelector('.btn-text').style.display = 'none';
        this.cropBtn.querySelector('.loading').style.display = 'inline-block';

        try {
            const scaleX = this.originalImage.width / this.canvas.width;
            const scaleY = this.originalImage.height / this.canvas.height;
            
            const cropX = this.cropData.x * scaleX;
            const cropY = this.cropData.y * scaleY;
            const cropWidth = this.cropData.width * scaleX;
            const cropHeight = this.cropData.height * scaleY;

            const croppedCanvas = CanvasUtils.cropImage(this.originalImage, cropX, cropY, cropWidth, cropHeight);
            
            // Show result
            this.resultImage.src = croppedCanvas.toDataURL();
            this.resultContainer.style.display = 'block';
            this.previewContainer.style.display = 'none';
            
            // Track tool usage
            trackToolUsage('crop', 'process');
            
        } catch (error) {
            console.error('Error cropping image:', error);
            this.showError('Failed to crop image');
        } finally {
            this.cropBtn.disabled = false;
            this.cropBtn.querySelector('.btn-text').style.display = 'inline';
            this.cropBtn.querySelector('.loading').style.display = 'none';
        }
    }

    downloadImage() {
        if (!this.resultImage.src) return;

        const link = document.createElement('a');
        link.download = `cropped_${this.originalFile.name}`;
        link.href = this.resultImage.src;
        link.click();
        
        // Track download
        const blob = this.dataURLToBlob(this.resultImage.src);
        trackFileDownload(blob, 'crop');
        
        // Track tool usage
        trackToolUsage('crop', 'download');
    }

    dataURLToBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    resetCrop() {
        this.initializeCropArea();
    }

    resetAll() {
        this.originalImage = null;
        this.originalFile = null;
        this.controlsPanel.style.display = 'none';
        this.previewContainer.style.display = 'none';
        this.resultContainer.style.display = 'none';
        this.cropOverlay.classList.remove('active');
        
        if (this.imageUploader) {
            this.imageUploader.reset();
        }
    }

    showError(message) {
        // Simple error display - you could enhance this with a toast notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger-color);
            color: white;
            padding: 1rem;
            border-radius: var(--radius);
            z-index: 1000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 5000);
    }

    loadImageFromURL() {
        // Check if image URL is provided in query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const imageUrl = urlParams.get('image');
        
        if (imageUrl) {
            ImageUtils.loadImageFromUrl(imageUrl)
                .then(img => {
                    this.handleImageUpload({ img, file: { name: 'image.jpg' } });
                })
                .catch(error => {
                    console.error('Failed to load image from URL:', error);
                });
        }
    }
}

// Initialize crop tool when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CropTool();
});