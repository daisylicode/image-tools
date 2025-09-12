/**
 * Header Component
 * 公共的header组件，可以被所有页面引用
 */

export class HeaderComponent {
    constructor() {
        this.currentPage = this.getCurrentPage()
    }

    /**
     * 获取当前页面标识
     */
    getCurrentPage() {
        const path = window.location.pathname
        if (path === '/') return 'index'
        if (path.includes('/tools/crop/')) return 'crop'
        if (path.includes('/tools/merge/')) return 'merge'
        if (path.includes('/tools/remove-object/')) return 'remove-object'
        if (path.includes('/tools/black-image/')) return 'black-image'
        if (path.includes('/tools/compress/')) return 'compress'
        if (path.includes('/tools/resize/')) return 'resize'
        return 'index'
    }

    /**
     * 渲染header HTML
     */
    render() {
        return `
            <header class="header">
                <div class="header-container">
                    <a href="/" class="logo">
                        <img src="/assets/logo.svg" alt="Free Image Tools" class="logo-img">
                        <span class="logo-text" data-i18n="common.siteName">Free Image Tools</span>
                    </a>
                    
                    <nav class="nav">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <a href="/" class="nav-link ${this.currentPage === 'index' ? 'active' : ''}" data-page="index" data-i18n="nav.home">Home</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/crop/" class="nav-link ${this.currentPage === 'crop' ? 'active' : ''}" data-page="crop" data-i18n="nav.crop">Crop</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/merge/" class="nav-link ${this.currentPage === 'merge' ? 'active' : ''}" data-page="merge" data-i18n="nav.merge">Merge</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/remove-object/" class="nav-link ${this.currentPage === 'remove-object' ? 'active' : ''}" data-page="remove-object" data-i18n="nav.removeObject">Remove</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/black-image/" class="nav-link ${this.currentPage === 'black-image' ? 'active' : ''}" data-page="black-image" data-i18n="nav.blackImage">Black</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/compress/" class="nav-link ${this.currentPage === 'compress' ? 'active' : ''}" data-page="compress" data-i18n="nav.compress">Compress</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/resize/" class="nav-link ${this.currentPage === 'resize' ? 'active' : ''}" data-page="resize" data-i18n="nav.resize">Resize</a>
                            </li>
                        </ul>
                    </nav>
                    
                    <div class="header-actions">
                        <button class="lang-toggle" id="langToggle" title="Change Language" data-i18n-title="common.changeLanguage">
                            🌐
                        </button>
                        <button class="mobile-menu-toggle" id="mobileMenuToggle">
                            <span class="hamburger"></span>
                            <span class="hamburger"></span>
                            <span class="hamburger"></span>
                        </button>
                    </div>
                </div>
            </header>
        `
    }

    /**
     * 将header插入到指定元素中
     */
    mount(selector = 'body') {
        const target = document.querySelector(selector)
        if (target) {
            // 在目标元素的开头插入header
            target.insertAdjacentHTML('afterbegin', this.render())
            this.setupEventListeners()
            // 更新i18n文本内容
            this.updateI18nContent()
        }
    }

    /**
     * 替换现有的header
     */
    replace(selector = 'header') {
        const existingHeader = document.querySelector(selector)
        if (existingHeader) {
            existingHeader.outerHTML = this.render()
            this.setupEventListeners()
            // 更新i18n文本内容
            this.updateI18nContent()
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 语言切换按钮
        const langToggle = document.querySelector('#langToggle')
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.showLanguageSelector()
            })
        }

        // 移动端菜单切换
        const mobileMenuToggle = document.querySelector('#mobileMenuToggle')
        const navList = document.querySelector('.nav-list')
        
        if (mobileMenuToggle && navList) {
            mobileMenuToggle.addEventListener('click', () => {
                navList.classList.toggle('active')
                mobileMenuToggle.classList.toggle('active')
            })
        }

        // 监听语言切换事件
        window.addEventListener('languageChange', () => {
            this.updateLanguage()
        })
    }

    /**
     * 显示语言选择器
     */
    async showLanguageSelector() {
        try {
            const { I18n } = await import('/scripts/core/i18n.js')
            const languages = I18n.getAvailableLanguages()
            const currentLang = I18n.getCurrentLanguage()
            
            const selector = document.createElement('div')
            selector.className = 'language-selector'
            selector.innerHTML = `
                <div class="language-dropdown">
                    ${languages.map(lang => `
                        <button class="lang-option ${lang.code === currentLang ? 'active' : ''}" 
                                data-lang="${lang.code}">
                            ${lang.name}
                        </button>
                    `).join('')}
                </div>
            `
            
            const langToggle = document.querySelector('#langToggle')
            const rect = langToggle.getBoundingClientRect()
            
            selector.style.position = 'absolute'
            selector.style.top = `${rect.bottom + 5}px`
            selector.style.right = `${window.innerWidth - rect.right}px`
            selector.style.zIndex = '1000'
            
            document.body.appendChild(selector)
            
            // 处理语言选择
            selector.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.getAttribute('data-lang')
                    I18n.setLanguage(lang)
                    document.body.removeChild(selector)
                })
            })
            
            // 点击外部关闭
            setTimeout(() => {
                document.addEventListener('click', function closeSelector(e) {
                    if (!selector.contains(e.target)) {
                        if (selector.parentNode) {
                            document.body.removeChild(selector)
                        }
                        document.removeEventListener('click', closeSelector)
                    }
                })
            }, 100)
        } catch (error) {
            console.error('Failed to load language selector:', error)
        }
    }

    /**
     * 更新i18n内容
     */
    async updateI18nContent() {
        try {
            const { I18n } = await import('/scripts/core/i18n.js')
            I18n.updatePage()
        } catch (error) {
            console.error('Failed to update i18n content:', error)
        }
    }

    /**
     * 更新语言
     */
    updateLanguage() {
        // 重新渲染header以更新文本
        this.replace('header')
    }
}

// 默认导出
export default HeaderComponent
