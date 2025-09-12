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
        // 替换现有的header
        this.header.replace('header')
        
        // 替换现有的footer
        this.footer.replace('footer')
        
        // 如果页面中没有header或footer，则添加它们
        if (!document.querySelector('header')) {
            this.header.mount('body')
        }
        
        if (!document.querySelector('footer')) {
            this.footer.mount('body')
        }
        
        // 监听语言切换事件
        this.setupLanguageListener()
    }
    
    /**
     * 设置语言切换监听器
     */
    setupLanguageListener() {
        window.addEventListener('languageChange', () => {
            // 重新初始化header和footer以更新语言
            this.header.replace('header')
            this.footer.replace('footer')
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
