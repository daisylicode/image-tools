#!/bin/bash

echo "🚀 Free Image Tools Online - 启动脚本"
echo "========================================="

# 检查是否有node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "🌐 启动预览服务器..."
    echo "📱 请在浏览器中访问: http://localhost:4173/"
    echo "🔧 按 Ctrl+C 停止服务器"
    echo ""
    
    # 启动预览服务器
    npm run preview
else
    echo "❌ 构建失败！"
    exit 1
fi