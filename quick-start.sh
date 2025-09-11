#!/bin/bash

echo "🚀 启动 Free Image Tools Online"
echo "================================"

# 进入正确的目录
cd /Users/daisyli/code/git/go-sea/image-tools/freeimagetools.online/dist

# 检查端口是否被占用
if lsof -i :8888 >/dev/null 2>&1; then
    echo "⚠️  端口8888被占用，尝试使用端口9999..."
    PORT=9999
else
    PORT=8888
fi

echo "🌐 启动服务器在端口 $PORT"
echo "📱 请在浏览器中访问: http://localhost:$PORT"
echo "🔧 按 Ctrl+C 停止服务器"
echo ""

# 启动Python HTTP服务器
python3 -m http.server $PORT