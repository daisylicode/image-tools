# Free Image Tools Online

A free, privacy-focused online image processing toolkit that works entirely in your browser. No uploads required - all processing happens locally.

## Features

- 🖼️ **Crop Image** - Crop images to desired dimensions with aspect ratio options
- 🔗 **Merge Images** - Combine multiple images into one with customizable layouts
- 🧹 **Remove Object** - Remove unwanted objects from images (legitimate use only)
- ⚫ **Black Image** - Create solid black images with custom dimensions
- 🗜️ **Compress Image** - Reduce file size while maintaining quality
- 📏 **Resize Image** - Change image dimensions with aspect ratio lock

## Key Features

- 🔒 **Privacy First** - All processing happens in your browser
- ⚡ **Fast & Free** - No registration required
- 📱 **Mobile Friendly** - Works on all devices
- 🎯 **Easy to Use** - Simple drag-and-drop interface
- 🌙 **Dark Mode** - Eye-friendly dark theme available

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/freeimagetools.online.git
cd freeimagetools.online
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
# or use the convenience script
./dev.sh
```

4. Build for production
```bash
npm run build
# or use the comprehensive build script
./build.sh
```

5. Deploy to GitHub Pages
```bash
./deploy.sh
```

## Project Structure

```
freeimagetools.online/
├── public/                 # Static assets
│   ├── assets/            # Images, icons
│   ├── sitemap.xml        # SEO sitemap
│   ├── robots.txt         # Search engine instructions
│   └── manifest.json      # PWA manifest
├── src/
│   ├── styles/            # CSS styles
│   ├── scripts/           # JavaScript modules
│   │   ├── utils/         # Utility functions
│   │   └── components/    # Web components
│   ├── tools/             # Individual tool pages
│   │   ├── crop/          # Image cropper
│   │   ├── merge/         # Image merger
│   │   ├── remove-object/ # Object removal
│   │   ├── black-image/   # Black image generator
│   │   ├── compress/      # Image compressor
│   │   └── resize/        # Image resizer
│   └── index.html         # Homepage
├── package.json
├── vite.config.js         # Vite configuration
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run generate-sitemap` - Generate sitemap.xml

### Convenience Scripts

- `./dev.sh` - Start development server with status messages
- `./build.sh` - Comprehensive build process with deployment preparation
- `./deploy.sh` - Deploy to GitHub Pages

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Vite
- **Image Processing**: Canvas API, Web Workers
- **Styling**: CSS Custom Properties, Responsive Design
- **Components**: Web Components (Custom Elements)
- **SEO**: Meta tags, JSON-LD, Sitemap

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Legal Notice

**Important**: This toolkit is designed for legitimate image editing purposes only. Users must:

1. Only edit images they own or have permission to modify
2. Respect copyright and intellectual property rights
3. Use the object removal tool responsibly for legitimate purposes
4. Not use the tools to create misleading or harmful content

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or issues, please:
1. Check the FAQ section on the website
2. Search existing issues
3. Create a new issue with detailed information

## Acknowledgments

- Built with modern web standards
- Privacy-focused design
- Open source and free to use

---

**Note**: This is a client-side only application. No images are uploaded to any server. All processing happens locally in your browser.