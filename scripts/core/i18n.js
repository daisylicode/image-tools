/**
 * Internationalization (i18n) Support
 * Handles multiple languages and text translations
 */
export class I18n {
  static currentLang = 'en'
  static fallbackLang = 'en'
  static translations = {
    en: {
      // Common
      'common.upload': 'Upload Image',
      'common.download': 'Download',
      'common.processing': 'Processing...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.loading': 'Loading...',
      'common.select': 'Select',
      'common.dragDrop': 'Drag & Drop image here or click to browse',
      'common.or': 'or',
      'common.paste': 'Paste from clipboard',
      'common.retry': 'Retry',
      'common.close': 'Close',
      'common.copy': 'Copy',
      'common.share': 'Share',
      'common.siteName': 'Free Image Tools',
      'common.changeLanguage': 'Change Language',
      'common.reset': 'Reset',
      'common.preview': 'Preview',
      
      // Navigation
      'nav.home': 'Home',
      'nav.crop': 'Crop',
      'nav.merge': 'Merge',
      'nav.removeObject': 'Remove',
      'nav.blackImage': 'Black',
      'nav.compress': 'Compress',
      'nav.resize': 'Resize',
      
      // Tools
      'tools.crop': 'Crop Image',
      'tools.merge': 'Merge Images',
      'tools.removeObject': 'Remove Object',
      'tools.blackImage': 'Black Image',
      'tools.compress': 'Compress Image',
      'tools.resize': 'Resize Image',
      
      // Crop Tool
      'crop.pageTitle': 'Crop Image Online - Free Image Cropping Tool',
      'crop.metaDescription': 'Free online image cropping tool. Crop images to exact dimensions with aspect ratio presets. No registration required.',
      'crop.keywords': 'crop image, image cropper, online crop tool, free crop image, resize crop',
      'crop.title': 'Crop Image',
      'crop.description': 'Crop your image to desired dimensions with precise control',
      'crop.settingsTitle': 'Crop Settings',
      'crop.width': 'Width (px)',
      'crop.height': 'Height (px)',
      'crop.aspectRatio': 'Aspect Ratio',
      'crop.freeform': 'Free',
      'crop.square': 'Square',
      'crop.landscape': 'Landscape (16:9)',
      'crop.portrait': 'Portrait (9:16)',
      'crop.original': 'Original',
      'crop.maintainRatio': 'Maintain Aspect Ratio',
      'crop.auto': 'Auto',
      'crop.applyCrop': 'Apply Crop',
      'crop.uploadPrompt': 'Upload an image to start cropping',
      'crop.originalSize': 'Original Size',
      'crop.croppedSize': 'Cropped Size',
      
      // Merge Tool
      'merge.title': 'Merge Images',
      'merge.description': 'Combine multiple images into one',
      'merge.addImage': 'Add Image',
      'merge.direction': 'Direction',
      'merge.horizontal': 'Horizontal',
      'merge.vertical': 'Vertical',
      'merge.spacing': 'Spacing',
      'merge.backgroundColor': 'Background Color',
      'merge.alignment': 'Alignment',
      'merge.top': 'Top',
      'merge.center': 'Center',
      'merge.bottom': 'Bottom',
      'merge.left': 'Left',
      'merge.right': 'Right',
      
      // Remove Object Tool
      'removeObject.title': 'Remove Object',
      'removeObject.description': 'Remove unwanted objects from your image',
      'removeObject.legalNotice': 'Legal Notice: Only remove objects from images you own or have permission to edit.',
      'removeObject.selectArea': 'Select area to remove',
      'removeObject.brushSize': 'Brush Size',
      'removeObject.inpaint': 'Inpaint',
      'removeObject.preview': 'Preview',
      
      // Black Image Tool
      'blackImage.title': 'Create Black Image',
      'blackImage.description': 'Create a solid black image with custom dimensions',
      'blackImage.width': 'Width (px)',
      'blackImage.height': 'Height (px)',
      'blackImage.create': 'Create Image',
      'blackImage.format': 'Format',
      
      // Compress Tool
      'compress.title': 'Compress Image',
      'compress.description': 'Reduce image file size while maintaining quality',
      'compress.quality': 'Quality',
      'compress.maxWidth': 'Max Width',
      'compress.maxHeight': 'Max Height',
      'compress.originalSize': 'Original Size',
      'compress.compressedSize': 'Compressed Size',
      'compress.savings': 'Savings',
      'compress.compare': 'Compare',
      
      // Resize Tool
      'resize.title': 'Resize Image',
      'resize.description': 'Change image dimensions',
      'resize.width': 'Width (px)',
      'resize.height': 'Height (px)',
      'resize.maintainAspectRatio': 'Maintain Aspect Ratio',
      'resize.percentage': 'Percentage',
      'resize.pixels': 'Pixels',
      'resize.dimensions': 'Dimensions',
      
      // Errors
      'error.invalidFile': 'Please select a valid image file',
      'error.fileTooLarge': 'File size exceeds the maximum limit of 50MB',
      'error.processingFailed': 'Failed to process image',
      'error.unsupportedFormat': 'Unsupported image format',
      'error.networkError': 'Network error occurred',
      'error.clipboardError': 'Failed to read from clipboard',
      'error.downloadError': 'Failed to download image',
      
      // Legal
      'legal.disclaimer': 'All image processing happens in your browser. Your images are never uploaded to any server.',
      'legal.copyright': 'Only use these tools on images you own or have permission to edit.',
      'legal.privacy': 'Privacy First: Your images are processed locally and never leave your device.',
      
      // Home Page
      'home.heroTitle': 'Free Image Tools Online',
      'home.heroDescription': 'Transform your images with powerful, browser-based tools. No registration required. Complete privacy guaranteed.',
      'home.featurePrivate': '100% Private',
      'home.featureFast': 'Lightning Fast',
      'home.featureFree': 'Completely Free',
      'home.toolsTitle': 'Image Processing Tools',
      'home.cropDescription': 'Crop your images to perfect dimensions with aspect ratio presets',
      'home.cropFeature1': 'Freeform crop',
      'home.cropFeature2': 'Aspect ratios',
      'home.cropFeature3': 'Preview',
      'home.mergeDescription': 'Combine multiple images into one with customizable layouts',
      'home.mergeFeature1': 'Horizontal/Vertical',
      'home.mergeFeature2': 'Custom spacing',
      'home.mergeFeature3': 'Background color',
      'home.removeObjectDescription': 'Remove unwanted objects from your photos with AI-powered inpainting',
      'home.removeObjectFeature1': 'Smart removal',
      'home.removeObjectFeature2': 'Brush tool',
      'home.removeObjectFeature3': 'Preview',
      'home.blackImageDescription': 'Create solid black images with custom dimensions',
      'home.blackImageFeature1': 'Custom sizes',
      'home.blackImageFeature2': 'Multiple formats',
      'home.blackImageFeature3': 'Instant download',
      'home.compressDescription': 'Reduce image file size while maintaining quality',
      'home.compressFeature1': 'Quality control',
      'home.compressFeature2': 'Size comparison',
      'home.compressFeature3': 'Batch processing',
      'home.resizeDescription': 'Change image dimensions with aspect ratio control',
      'home.resizeFeature1': 'Pixels or percentage',
      'home.resizeFeature2': 'Lock aspect ratio',
      'home.resizeFeature3': 'Multiple formats',
      'home.featuresTitle': 'Why Choose Our Tools?',
      'home.featurePrivacyTitle': 'Complete Privacy',
      'home.featurePrivacyDesc': 'All processing happens in your browser. Your images never leave your device.',
      'home.featureSpeedTitle': 'Lightning Fast',
      'home.featureSpeedDesc': 'Powered by modern web technologies for instant processing without waiting.',
      'home.featureMobileTitle': 'Mobile Friendly',
      'home.featureMobileDesc': 'Works perfectly on all devices - desktop, tablet, and mobile.',
      'home.featureFreeTitle': 'Always Free',
      'home.featureFreeDesc': 'No hidden costs, no registration required. Always free to use.',
      'home.featureQualityTitle': 'Professional Quality',
      'home.featureQualityDesc': 'High-quality algorithms ensure your images look their best.',
      'home.featureMultiLangTitle': 'Multi-language',
      'home.featureMultiLangDesc': 'Available in multiple languages with more coming soon.',
      'home.howItWorksTitle': 'How It Works',
      'home.step1Title': 'Choose a Tool',
      'home.step1Desc': 'Select the image processing tool you need from our collection.',
      'home.step2Title': 'Upload Your Image',
      'home.step2Desc': 'Upload your image or drag and drop it into the tool.',
      'home.step3Title': 'Adjust Settings',
      'home.step3Desc': 'Customize the processing options to your needs.',
      'home.step4Title': 'Download Result',
      'home.step4Desc': 'Download your processed image instantly.',
      'home.formatsTitle': 'Supported Formats',
      'home.formatJpegDesc': 'Best for photos and complex images',
      'home.formatPngDesc': 'Supports transparency and lossless compression',
      'home.formatWebpDesc': 'Modern format with superior compression',
      'home.formatGifDesc': 'Supports animation and transparency',
      
      // SEO
      'seo.pageTitle': 'Free Image Tools Online - Crop, Merge, Compress, Resize Images',
      'seo.metaDescription': 'Free online image processing tools. Crop, merge, compress, resize images and remove objects directly in your browser.',
      'seo.keywords': 'image tools, crop image, merge images, compress image, resize image, remove object, online, free'
    },
    zh: {
      // Common
      'common.upload': '上传图片',
      'common.download': '下载',
      'common.processing': '处理中...',
      'common.error': '错误',
      'common.success': '成功',
      'common.cancel': '取消',
      'common.save': '保存',
      'common.loading': '加载中...',
      'common.select': '选择',
      'common.dragDrop': '拖拽图片到此处或点击浏览',
      'common.or': '或',
      'common.paste': '从剪贴板粘贴',
      'common.retry': '重试',
      'common.close': '关闭',
      'common.copy': '复制',
      'common.share': '分享',
      'common.siteName': '免费图片工具',
      'common.changeLanguage': '切换语言',
      'common.reset': '重置',
      'common.preview': '预览',
      
      // Navigation
      'nav.home': '首页',
      'nav.crop': '裁剪',
      'nav.merge': '合并',
      'nav.removeObject': '移除',
      'nav.blackImage': '纯黑',
      'nav.compress': '压缩',
      'nav.resize': '调整大小',
      
      // Tools
      'tools.crop': '裁剪图片',
      'tools.merge': '合并图片',
      'tools.removeObject': '移除对象',
      'tools.blackImage': '纯黑图片',
      'tools.compress': '压缩图片',
      'tools.resize': '调整大小',
      
      // Crop Tool
      'crop.pageTitle': '在线裁剪图片 - 免费图片裁剪工具',
      'crop.metaDescription': '免费在线图片裁剪工具。使用宽高比预设将图片裁剪为精确尺寸。无需注册。',
      'crop.keywords': '裁剪图片, 图片裁剪器, 在线裁剪工具, 免费裁剪图片, 调整裁剪',
      'crop.title': '裁剪图片',
      'crop.description': '将图片裁剪为指定尺寸，精确控制',
      'crop.settingsTitle': '裁剪设置',
      'crop.width': '宽度 (像素)',
      'crop.height': '高度 (像素)',
      'crop.aspectRatio': '宽高比',
      'crop.freeform': '自由',
      'crop.square': '正方形',
      'crop.landscape': '横向 (16:9)',
      'crop.portrait': '纵向 (9:16)',
      'crop.original': '原始比例',
      'crop.maintainRatio': '保持宽高比',
      'crop.auto': '自动',
      'crop.applyCrop': '应用裁剪',
      'crop.uploadPrompt': '上传图片开始裁剪',
      'crop.originalSize': '原始尺寸',
      'crop.croppedSize': '裁剪后尺寸',
      
      // Merge Tool
      'merge.title': '合并图片',
      'merge.description': '将多张图片合并为一张',
      'merge.addImage': '添加图片',
      'merge.direction': '方向',
      'merge.horizontal': '横向',
      'merge.vertical': '纵向',
      'merge.spacing': '间距',
      'merge.backgroundColor': '背景颜色',
      'merge.alignment': '对齐',
      'merge.top': '顶部',
      'merge.center': '居中',
      'merge.bottom': '底部',
      'merge.left': '左侧',
      'merge.right': '右侧',
      
      // Remove Object Tool
      'removeObject.title': '移除对象',
      'removeObject.description': '从图片中移除不需要的对象',
      'removeObject.legalNotice': '法律声明：只能从您拥有或有权编辑的图片中移除对象。',
      'removeObject.selectArea': '选择要移除的区域',
      'removeObject.brushSize': '画笔大小',
      'removeObject.inpaint': '修复',
      'removeObject.preview': '预览',
      
      // Black Image Tool
      'blackImage.title': '创建纯黑图片',
      'blackImage.description': '创建指定尺寸的纯黑图片',
      'blackImage.width': '宽度 (像素)',
      'blackImage.height': '高度 (像素)',
      'blackImage.create': '创建图片',
      'blackImage.format': '格式',
      
      // Compress Tool
      'compress.title': '压缩图片',
      'compress.description': '在保持质量的同时减小图片文件大小',
      'compress.quality': '质量',
      'compress.maxWidth': '最大宽度',
      'compress.maxHeight': '最大高度',
      'compress.originalSize': '原始大小',
      'compress.compressedSize': '压缩后大小',
      'compress.savings': '节省空间',
      'compress.compare': '比较',
      
      // Resize Tool
      'resize.title': '调整图片大小',
      'resize.description': '更改图片尺寸',
      'resize.width': '宽度 (像素)',
      'resize.height': '高度 (像素)',
      'resize.maintainAspectRatio': '保持宽高比',
      'resize.percentage': '百分比',
      'resize.pixels': '像素',
      'resize.dimensions': '尺寸',
      
      // Errors
      'error.invalidFile': '请选择有效的图片文件',
      'error.fileTooLarge': '文件大小超过50MB限制',
      'error.processingFailed': '图片处理失败',
      'error.unsupportedFormat': '不支持的图片格式',
      'error.networkError': '网络错误',
      'error.clipboardError': '无法读取剪贴板',
      'error.downloadError': '下载失败',
      
      // Legal
      'legal.disclaimer': '所有图片处理都在您的浏览器中完成。您的图片永远不会上传到任何服务器。',
      'legal.copyright': '只能在这些工具中使用您拥有或有权编辑的图片。',
      'legal.privacy': '隐私优先：您的图片在本地处理，永远不会离开您的设备。',
      
      // Home Page
      'home.heroTitle': '免费在线图片工具',
      'home.heroDescription': '使用强大的浏览器端工具转换您的图片。无需注册。完全隐私保护。',
      'home.featurePrivate': '100% 隐私',
      'home.featureFast': '极速处理',
      'home.featureFree': '完全免费',
      'home.toolsTitle': '图片处理工具',
      'home.cropDescription': '将图片裁剪为完美尺寸，支持宽高比预设',
      'home.cropFeature1': '自由裁剪',
      'home.cropFeature2': '宽高比',
      'home.cropFeature3': '预览',
      'home.mergeDescription': '将多张图片合并为一张，支持自定义布局',
      'home.mergeFeature1': '横向/纵向',
      'home.mergeFeature2': '自定义间距',
      'home.mergeFeature3': '背景颜色',
      'home.removeObjectDescription': '使用AI智能修复技术从照片中移除不需要的对象',
      'home.removeObjectFeature1': '智能移除',
      'home.removeObjectFeature2': '画笔工具',
      'home.removeObjectFeature3': '预览',
      'home.blackImageDescription': '创建指定尺寸的纯黑图片',
      'home.blackImageFeature1': '自定义尺寸',
      'home.blackImageFeature2': '多种格式',
      'home.blackImageFeature3': '即时下载',
      'home.compressDescription': '在保持质量的同时减小图片文件大小',
      'home.compressFeature1': '质量控制',
      'home.compressFeature2': '大小对比',
      'home.compressFeature3': '批量处理',
      'home.resizeDescription': '更改图片尺寸，支持宽高比控制',
      'home.resizeFeature1': '像素或百分比',
      'home.resizeFeature2': '锁定宽高比',
      'home.resizeFeature3': '多种格式',
      'home.featuresTitle': '为什么选择我们的工具？',
      'home.featurePrivacyTitle': '完全隐私',
      'home.featurePrivacyDesc': '所有处理都在您的浏览器中完成。您的图片永远不会离开您的设备。',
      'home.featureSpeedTitle': '极速处理',
      'home.featureSpeedDesc': '采用现代网络技术，实现即时处理，无需等待。',
      'home.featureMobileTitle': '移动友好',
      'home.featureMobileDesc': '在所有设备上完美运行 - 桌面、平板和手机。',
      'home.featureFreeTitle': '永远免费',
      'home.featureFreeDesc': '无隐藏费用，无需注册。永远免费使用。',
      'home.featureQualityTitle': '专业品质',
      'home.featureQualityDesc': '高质量算法确保您的图片呈现最佳效果。',
      'home.featureMultiLangTitle': '多语言',
      'home.featureMultiLangDesc': '支持多种语言，更多语言即将推出。',
      'home.howItWorksTitle': '使用方法',
      'home.step1Title': '选择工具',
      'home.step1Desc': '从我们的工具集合中选择您需要的图片处理工具。',
      'home.step2Title': '上传图片',
      'home.step2Desc': '上传您的图片或将其拖拽到工具中。',
      'home.step3Title': '调整设置',
      'home.step3Desc': '根据需要自定义处理选项。',
      'home.step4Title': '下载结果',
      'home.step4Desc': '立即下载处理后的图片。',
      'home.formatsTitle': '支持的格式',
      'home.formatJpegDesc': '最适合照片和复杂图片',
      'home.formatPngDesc': '支持透明度和无损压缩',
      'home.formatWebpDesc': '现代格式，具有卓越的压缩性能',
      'home.formatGifDesc': '支持动画和透明度',
      
      // SEO
      'seo.pageTitle': '免费在线图片工具 - 裁剪、合并、压缩、调整图片大小',
      'seo.metaDescription': '免费在线图片处理工具。在浏览器中直接裁剪、合并、压缩、调整图片大小和移除对象。',
      'seo.keywords': '图片工具, 裁剪图片, 合并图片, 压缩图片, 调整图片大小, 移除对象, 在线, 免费'
    }
  }

  static init() {
    // Try to detect browser language
    const browserLang = navigator.language || navigator.userLanguage
    const langCode = browserLang.split('-')[0]
    
    // Try to load saved language
    const savedLang = localStorage.getItem('language')
    
    // Use saved language, browser language, or fallback to English
    this.currentLang = savedLang || (this.translations[langCode] ? langCode : this.fallbackLang)
    
    this.updatePage()
  }

  static setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang
      localStorage.setItem('language', lang)
      this.updatePage()
      
      // Dispatch language change event
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }))
    }
  }

  static t(key, params = {}) {
    let text = this.translations[this.currentLang]?.[key] || 
               this.translations[this.fallbackLang]?.[key] || 
               key
    
    // Replace parameters in text
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param])
    })
    
    return text
  }

  static updatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n')
      element.textContent = this.t(key)
    })

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder')
      element.placeholder = this.t(key)
    })

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title')
      element.title = this.t(key)
    })

    // Update HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html')
      element.innerHTML = this.t(key)
    })

    // Update content attributes (for meta tags)
    document.querySelectorAll('[data-i18n-content]').forEach(element => {
      const key = element.getAttribute('data-i18n-content')
      element.setAttribute('content', this.t(key))
    })

    // Update document title
    const titleElement = document.querySelector('title[data-i18n]')
    if (titleElement) {
      const key = titleElement.getAttribute('data-i18n')
      document.title = this.t(key)
    }

    // Update document direction for RTL languages
    document.documentElement.lang = this.currentLang
    document.documentElement.dir = this.getDirection(this.currentLang)
  }

  static getDirection(lang) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    return rtlLanguages.includes(lang) ? 'rtl' : 'ltr'
  }

  static getAvailableLanguages() {
    return Object.keys(this.translations).map(lang => ({
      code: lang,
      name: this.getLanguageName(lang)
    }))
  }

  static getLanguageName(lang) {
    const names = {
      en: 'English',
      zh: '中文'
    }
    return names[lang] || lang
  }

  static getCurrentLanguage() {
    return this.currentLang
  }

  static addTranslations(lang, translations) {
    if (!this.translations[lang]) {
      this.translations[lang] = {}
    }
    Object.assign(this.translations[lang], translations)
  }
}