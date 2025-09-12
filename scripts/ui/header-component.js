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
                        <span class="logo-text">Free Image Tools</span>
                    </a>
                    
                    <nav class="nav">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <a href="/" class="nav-link ${this.currentPage === 'index' ? 'active' : ''}" data-page="index">Home</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/crop/" class="nav-link ${this.currentPage === 'crop' ? 'active' : ''}" data-page="crop">Crop</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/merge/" class="nav-link ${this.currentPage === 'merge' ? 'active' : ''}" data-page="merge">Merge</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/remove-object/" class="nav-link ${this.currentPage === 'remove-object' ? 'active' : ''}" data-page="remove-object">Remove</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/black-image/" class="nav-link ${this.currentPage === 'black-image' ? 'active' : ''}" data-page="black-image">Black</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/compress/" class="nav-link ${this.currentPage === 'compress' ? 'active' : ''}" data-page="compress">Compress</a>
                            </li>
                            <li class="nav-item">
                                <a href="/tools/resize/" class="nav-link ${this.currentPage === 'resize' ? 'active' : ''}" data-page="resize">Resize</a>
                            </li>
                        </ul>
                    </nav>
                    
                    <div class="header-actions">
                        <button class="lang-toggle" id="langToggle" title="Change Language">
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
        }
    }

    /**
     * 替换现有的header
     */
    replace(selector = 'header') {
        const existingHeader = document.querySelector(selector)
        if (existingHeader) {
            existingHeader.outerHTML = this.render()
        }
    }
}

// 默认导出
export default HeaderComponent
