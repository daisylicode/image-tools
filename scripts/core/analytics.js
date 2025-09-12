/**
 * Google Analytics 4 (GA4) Integration
 * 通用Analytics组件，支持所有页面
 */

class Analytics {
    constructor() {
        this.measurementId = null
        this.isInitialized = false
        this.isEnabled = false
    }

    /**
     * 初始化Google Analytics
     * @param {string} measurementId - GA4测量ID (格式: G-XXXXXXXXXX)
     */
    init(measurementId) {
        if (!measurementId) {
            console.warn('Analytics: No measurement ID provided')
            return
        }

        this.measurementId = measurementId
        this.isEnabled = true

        // 异步加载Google Analytics脚本，避免阻塞其他组件
        setTimeout(() => {
            this.loadScript()
            this.initGA4()
            this.isInitialized = true
            console.log('Analytics initialized with ID:', measurementId)
        }, 100)
    }

    /**
     * 加载Google Analytics脚本
     */
    loadScript() {
        // 检查是否已经加载
        if (document.querySelector('script[src*="googletagmanager.com"]')) {
            return
        }

        // 创建script标签
        const script = document.createElement('script')
        script.async = true
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`
        document.head.appendChild(script)
    }

    /**
     * 初始化GA4配置
     */
    initGA4() {
        // 创建gtag函数
        window.dataLayer = window.dataLayer || []
        function gtag(){dataLayer.push(arguments)}
        window.gtag = gtag

        // 配置GA4
        gtag('js', new Date())
        gtag('config', this.measurementId, {
            page_title: document.title,
            page_location: window.location.href
        })
    }

    /**
     * 跟踪页面浏览
     * @param {string} pagePath - 页面路径
     * @param {string} pageTitle - 页面标题
     */
    trackPageView(pagePath = null, pageTitle = null) {
        if (!this.isEnabled || !window.gtag) return

        const path = pagePath || window.location.pathname
        const title = pageTitle || document.title

        window.gtag('config', this.measurementId, {
            page_path: path,
            page_title: title
        })

        console.log('Analytics: Page view tracked', { path, title })
    }

    /**
     * 跟踪事件
     * @param {string} eventName - 事件名称
     * @param {Object} parameters - 事件参数
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.isEnabled || !window.gtag) return

        window.gtag('event', eventName, parameters)
        console.log('Analytics: Event tracked', { eventName, parameters })
    }

    /**
     * 跟踪工具使用
     * @param {string} toolName - 工具名称
     * @param {string} action - 操作类型
     * @param {Object} additionalParams - 额外参数
     */
    trackToolUsage(toolName, action, additionalParams = {}) {
        this.trackEvent('tool_usage', {
            tool_name: toolName,
            action: action,
            ...additionalParams
        })
    }

    /**
     * 跟踪文件上传
     * @param {string} toolName - 工具名称
     * @param {string} fileType - 文件类型
     * @param {number} fileSize - 文件大小（字节）
     */
    trackFileUpload(toolName, fileType, fileSize) {
        this.trackEvent('file_upload', {
            tool_name: toolName,
            file_type: fileType,
            file_size: fileSize
        })
    }

    /**
     * 跟踪文件下载
     * @param {string} toolName - 工具名称
     * @param {string} fileType - 文件类型
     * @param {number} fileSize - 文件大小（字节）
     */
    trackFileDownload(toolName, fileType, fileSize) {
        this.trackEvent('file_download', {
            tool_name: toolName,
            file_type: fileType,
            file_size: fileSize
        })
    }

    /**
     * 跟踪语言切换
     * @param {string} fromLang - 原语言
     * @param {string} toLang - 目标语言
     */
    trackLanguageChange(fromLang, toLang) {
        this.trackEvent('language_change', {
            from_language: fromLang,
            to_language: toLang
        })
    }

    /**
     * 跟踪错误
     * @param {string} errorMessage - 错误信息
     * @param {string} toolName - 工具名称
     * @param {Object} additionalParams - 额外参数
     */
    trackError(errorMessage, toolName = null, additionalParams = {}) {
        this.trackEvent('error', {
            error_message: errorMessage,
            tool_name: toolName,
            ...additionalParams
        })
    }

    /**
     * 检查Analytics是否已初始化
     */
    isReady() {
        return this.isInitialized && this.isEnabled && typeof window.gtag === 'function'
    }

    /**
     * 禁用Analytics（用于隐私模式等）
     */
    disable() {
        this.isEnabled = false
        console.log('Analytics disabled')
    }

    /**
     * 启用Analytics
     */
    enable() {
        this.isEnabled = true
        console.log('Analytics enabled')
    }
}

// 创建全局实例
const analytics = new Analytics()

// 导出实例和类
export default analytics
export { Analytics }
