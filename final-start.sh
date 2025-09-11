#!/bin/bash

echo "🚀 Free Image Tools Online - 启动脚本"
echo "========================================"

# 进入dist目录
cd /Users/daisyli/code/git/go-sea/image-tools/freeimagetools.online/dist

# 检查端口是否被占用
if lsof -i :8888 >/dev/null 2>&1; then
    echo "⚠️  端口8888被占用，尝试使用端口9999..."
    PORT=9999
else
    PORT=8888
fi

echo "🌐 启动服务器在端口 $PORT"
echo ""
echo "📱 访问地址:"
echo "   主页: http://localhost:$PORT/home.html"
echo "   裁剪工具: http://localhost:$PORT/tools/crop/index.html"
echo "   合并工具: http://localhost:$PORT/tools/merge/index.html"
echo "   对象移除: http://localhost:$PORT/tools/remove-object/index.html"
echo "   纯黑图片: http://localhost:$PORT/tools/black-image/index.html"
echo "   压缩工具: http://localhost:$PORT/tools/compress/index.html"
echo "   缩放工具: http://localhost:$PORT/tools/resize/index.html"
echo ""
echo "🔧 按 Ctrl+C 停止服务器"
echo "🎯 点击主页上的工具卡片即可开始使用！"
echo ""

# 启动Python HTTP服务器
python3 -m http.server $PORT