/**
 * Analytics Configuration
 * 在这里配置你的Google Analytics设置
 */

export const analyticsConfig = {
    // Google Analytics 4 测量ID
    // 格式: G-XXXXXXXXXX
    // 获取方式: https://analytics.google.com/ -> 管理 -> 数据流 -> 选择你的网站 -> 测量ID
    measurementId: 'G-8XCFS91HG8', // 在这里填入你的GA4测量ID
    
    // 是否启用Analytics（开发环境可以设为false）
    enabled: true,
    
    // 是否在控制台显示调试信息
    debug: false,
    
    // 是否跟踪页面浏览
    trackPageViews: true,
    
    // 是否跟踪工具使用
    trackToolUsage: true,
    
    // 是否跟踪文件操作
    trackFileOperations: true,
    
    // 是否跟踪语言切换
    trackLanguageChanges: true,
    
    // 是否跟踪错误
    trackErrors: true
}

// 示例配置（请替换为你的实际ID）
// export const analyticsConfig = {
//     measurementId: 'G-XXXXXXXXXX', // 替换为你的GA4测量ID
//     enabled: true,
//     debug: false,
//     trackPageViews: true,
//     trackToolUsage: true,
//     trackFileOperations: true,
//     trackLanguageChanges: true,
//     trackErrors: true
// }
