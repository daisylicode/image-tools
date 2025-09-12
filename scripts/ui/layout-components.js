/**
 * Layout Components
 * 组合header和footer组件，提供统一的布局管理
 */

import { HeaderComponent } from './header-component.js'
import { FooterComponent } from './footer-component.js'

export class LayoutComponents {
    constructor() {
        this.header = new HeaderComponent()
        this.footer = new FooterComponent()
    }

    /**
     * 初始化布局组件
     * 自动检测并替换现有的header和footer
     */
    init() {
        // 插入header到header-container
        const headerContainer = document.getElementById('header-container')
        if (headerContainer) {
            headerContainer.innerHTML = this.header.render()
            this.header.setupEventListeners()
            this.header.updateI18nContent()
        }
        
        // 插入footer到footer-container
        const footerContainer = document.getElementById('footer-container')
        if (footerContainer) {
            footerContainer.innerHTML = this.footer.render()
            this.footer.updateI18nContent()
        }
        
        // 监听语言切换事件
        this.setupLanguageListener()
    }
    
    /**
     * 设置语言切换监听器
     */
    setupLanguageListener() {
        window.addEventListener('languageChange', () => {
            // 重新渲染header和footer以更新语言
            const headerContainer = document.getElementById('header-container')
            if (headerContainer) {
                headerContainer.innerHTML = this.header.render()
                this.header.setupEventListeners()
                this.header.updateI18nContent()
            }
            
            const footerContainer = document.getElementById('footer-container')
            if (footerContainer) {
                footerContainer.innerHTML = this.footer.render()
                this.footer.updateI18nContent()
            }
        })
    }

    /**
     * 只初始化header
     */
    initHeader() {
        this.header.replace('header')
        if (!document.querySelector('header')) {
            this.header.mount('body')
        }
    }

    /**
     * 只初始化footer
     */
    initFooter() {
        this.footer.replace('footer')
        if (!document.querySelector('footer')) {
            this.footer.mount('body')
        }
    }

    /**
     * 获取header HTML
     */
    getHeaderHTML() {
        return this.header.render()
    }

    /**
     * 获取footer HTML
     */
    getFooterHTML() {
        return this.footer.render()
    }
}

// 默认导出
export default LayoutComponents
