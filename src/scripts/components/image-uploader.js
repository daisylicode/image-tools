// Image Uploader Component
class ImageUploaderComponent extends HTMLElement {
    constructor() {
        super();
        this.onImageUpload = null;
        this.accept = 'image/*';
        this.multiple = false;
        this.maxFiles = 10;
        this.dragOver = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const acceptAttr = this.accept ? `accept="${this.accept}"` : '';
        const multipleAttr = this.multiple ? 'multiple' : '';

        this.innerHTML = `
            <div class="image-uploader" id="imageUploader">
                <input type="file" id="fileInput" ${acceptAttr} ${multipleAttr}>
                <div class="uploader-content">
                    <div class="uploader-icon">📁</div>
                    <p class="uploader-text">Drag & Drop image here or click to browse</p>
                    <p class="uploader-subtext">Supports: JPG, PNG, WebP, GIF, BMP (Max 50MB)</p>
                    <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                        Choose File
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const uploader = this.querySelector('#imageUploader');
        const fileInput = this.querySelector('#fileInput');

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop
        uploader.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dragOver = true;
            uploader.classList.add('drag-over');
        });

        uploader.addEventListener('dragleave', () => {
            this.dragOver = false;
            uploader.classList.remove('drag-over');
        });

        uploader.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dragOver = false;
            uploader.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        // Paste from clipboard
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData.items;
            for (let item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    this.handleFiles([file]);
                    break;
                }
            }
        });
    }

    async handleFiles(files) {
        const validFiles = [];
        
        for (let file of files) {
            try {
                // Validate file
                if (!file.type.startsWith('image/')) {
                    throw new Error('Invalid file type');
                }
                
                if (file.size > 50 * 1024 * 1024) { // 50MB
                    throw new Error('File too large');
                }
                
                validFiles.push(file);
                
                if (!this.multiple && validFiles.length >= this.maxFiles) {
                    break;
                }
            } catch (error) {
                this.showError(error.message);
            }
        }

        if (validFiles.length > 0) {
            await this.processFiles(validFiles);
        }
    }

    async processFiles(files) {
        try {
            const images = [];
            
            for (let file of files) {
                const img = await this.loadImage(file);
                images.push({ file, img });
            }

            if (this.onImageUpload) {
                this.onImageUpload(images);
            }

            this.showPreview(images);
        } catch (error) {
            this.showError('Failed to process images');
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
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

    showPreview(images) {
        const uploader = this.querySelector('#imageUploader');
        
        if (images.length === 1) {
            const img = images[0].img;
            const preview = document.createElement('img');
            preview.src = img.src;
            preview.className = 'uploaded-image';
            preview.alt = 'Uploaded image';
            
            uploader.innerHTML = '';
            uploader.appendChild(preview);
            
            // Add remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger';
            removeBtn.textContent = 'Remove';
            removeBtn.style.marginTop = '1rem';
            removeBtn.onclick = () => {
                this.render();
                this.setupEventListeners();
            };
            uploader.appendChild(removeBtn);
        } else {
            // Multiple images preview
            const previewContainer = document.createElement('div');
            previewContainer.className = 'image-preview';
            
            images.forEach(({ img, file }, index) => {
                const container = document.createElement('div');
                container.className = 'preview-container';
                
                const preview = document.createElement('img');
                preview.src = img.src;
                preview.className = 'preview-image';
                preview.alt = `Image ${index + 1}`;
                
                const info = document.createElement('p');
                info.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                info.style.marginTop = '0.5rem';
                
                container.appendChild(preview);
                container.appendChild(info);
                previewContainer.appendChild(container);
            });
            
            uploader.innerHTML = '';
            uploader.appendChild(previewContainer);
        }
    }

    showError(message) {
        const uploader = this.querySelector('#imageUploader');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--danger-color)';
        errorDiv.style.marginTop = '1rem';
        errorDiv.textContent = message;
        
        uploader.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    reset() {
        this.render();
        this.setupEventListeners();
    }
}

customElements.define('image-uploader', ImageUploaderComponent);