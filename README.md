
  # anytext 📸➡️📝

**Extract text from any image with powerful OCR technology**

anytext is a modern, privacy-focused web application that uses advanced Optical Character Recognition (OCR) to extract text from images. Built with React and powered by Tesseract.js, it processes everything locally in your browser—your images never leave your device.

<div align="center">
  <img src="public/favicon.png" alt="anytext logo" width="120" height="120">
</div>

## ✨ Features

- **🖱️ Drag & Drop Interface** - Simply drag images into the browser for instant processing
- **🔍 Advanced OCR** - State-of-the-art text recognition powered by Tesseract.js
- **🌐 Multiple Image Formats** - Support for PNG, JPG, GIF, BMP, TIFF, and WebP
- **🌍 Multi-Language Support** - Support for 25+ languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and more
- **⚙️ Advanced OCR Settings** - Customizable parameters for maximum accuracy including page segmentation modes, character filtering, and preprocessing options
- **🔍 Image Preprocessing** - Automatic contrast enhancement and grayscale conversion for improved text recognition
- **📊 Confidence Scoring** - Real-time accuracy metrics and processing performance indicators
- **📱 Real-Time Progress** - Watch OCR processing with live status updates and progress indicators
- **💾 Clean Downloads** - Export extracted text as formatted .txt files
- **🔒 Complete Privacy** - All processing happens locally in your browser
- **👁️ Image Preview** - View original images alongside extracted text
- **🎨 Modern UI** - Beautiful, responsive interface built with Radix UI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kimanheng/anytext.git
   cd anytext
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Production Build

```bash
npm run build
```

## 📖 How to Use

1. **Upload an Image**
   - Drag and drop an image file onto the upload area, or
   - Click "Choose File" to browse and select an image

2. **Watch the Magic**
   - The app will process your image using OCR technology
   - Real-time progress updates show processing status

3. **Review & Download**
   - View the extracted text in the results panel
   - Toggle image preview to compare with original
   - Download the text as a .txt file
   - Click "New File" to process another image

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **OCR Engine**: Tesseract.js
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Language**: TypeScript

## 🔒 Privacy & Security

anytext prioritizes your privacy:

- ✅ **100% Local Processing** - All OCR happens in your browser
- ✅ **No Server Uploads** - Images never leave your device
- ✅ **No Data Collection** - We don't store or track your files
- ✅ **Offline Capable** - Works without internet after initial load

## 🎯 Supported File Types

| Format | Extension | Notes |
|--------|-----------|-------|
| PNG | `.png` | Best for screenshots and diagrams |
| JPEG | `.jpg`, `.jpeg` | Good for photos and scanned documents |
| GIF | `.gif` | Supports static images |
| BMP | `.bmp` | Windows bitmap format |
| TIFF | `.tiff`, `.tif` | High-quality scanned documents |
| WebP | `.webp` | Modern web format |

## 🚀 OCR Optimization Features

### Multi-Language Support
- **25+ Languages**: English, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Chinese (Simplified & Traditional), Japanese, Korean, Hindi, Thai, Vietnamese, Dutch, Polish, Turkish, Hebrew, Swedish, Danish, Norwegian, Finnish, Hungarian, Czech
- **Multi-language Mode**: Automatically detect and process text in multiple languages simultaneously
- **Script Detection**: Support for Latin, Cyrillic, Arabic, Han, Japanese, Hangul, Devanagari, Thai, and Hebrew scripts

### Advanced OCR Parameters
- **Page Segmentation Modes**: Choose from Auto, Single Block, Single Column, Single Word, Single Line, Single Character, Sparse Text modes
- **Character Filtering**: Blacklist unwanted characters or whitelist only specific ones
- **Performance Tuning**: Optimized parameters for maximum accuracy and speed

### Image Preprocessing
- **Automatic Enhancement**: Contrast boost and grayscale conversion for better text recognition
- **Configurable Contrast**: Adjustable contrast levels from 0.5x to 3.0x
- **Smart Processing**: Fallback to original image if preprocessing fails

### Quality Metrics
- **Confidence Scoring**: Real-time accuracy percentage for each OCR operation
- **Processing Time**: Performance metrics showing processing duration
- **Visual Indicators**: Color-coded confidence badges (green > 80%, yellow > 60%, red ≤ 60%)

## 🎨 Screenshots

### Main Interface
> Clean, intuitive drag-and-drop interface for easy file uploads

### Processing View
> Real-time progress tracking with detailed status updates

### Results Panel
> Extracted text with image preview and download options

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 Roadmap

- [ ] **Batch Processing** - Process multiple images at once
- [ ] **Additional Languages** - Expand OCR language support
- [ ] **Text Formatting** - Preserve formatting from original documents  
- [ ] **PDF Support** - Extract text from PDF files
- [ ] **API Integration** - Optional cloud processing for enhanced accuracy
- [ ] **Text Editing** - In-app text editing before download
- [ ] **Export Formats** - Support for Word, PDF, and other formats

## 🐛 Issues & Support

Found a bug or have a feature request?

- **Bug Reports**: [Open an issue](https://github.com/kimanheng/anytext/issues/new?template=bug_report.md)
- **Feature Requests**: [Request a feature](https://github.com/kimanheng/anytext/issues/new?template=feature_request.md)
- **Questions**: [Start a discussion](https://github.com/kimanheng/anytext/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tesseract.js** - Powerful OCR engine that makes this possible
- **Radix UI** - Beautiful, accessible UI components
- **Vite** - Lightning-fast build tool
- **The Open Source Community** - For the amazing tools and libraries

---

<div align="center">

**Made with ❤️ by Kiman Heng**

[⭐ Star this repo](https://github.com/kimanheng/anytext) • [🐛 Report Bug](https://github.com/kimanheng/anytext/issues) • [✨ Request Feature](https://github.com/kimanheng/anytext/issues)

</div>
  