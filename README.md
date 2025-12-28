# 📄 PDF to Markdown Converter

> **100% Private • Client-Side Processing • Open Source**

A beautiful, privacy-focused web application that converts PDF documents to Markdown format entirely in your browser. No server uploads, no tracking, no data collection.

![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow.svg)
![Privacy](https://img.shields.io/badge/privacy-100%25-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

## ✨ Features

- 🔒 **100% Private**: All processing happens in your browser - files never leave your device
- ⚡ **Fast & Efficient**: Instant conversion powered by PDF.js
- 🎨 **Beautiful UI**: Modern, clean interface with live markdown preview
- 📝 **Live Editor**: Edit converted markdown with real-time preview
- 💾 **Export Options**: Copy to clipboard or download as .md file
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessible**: WCAG compliant with keyboard navigation support
- 🌙 **Modern Design**: Elegant dark theme with smooth animations
- 🚀 **Zero Dependencies**: Pure vanilla JavaScript (except PDF.js and Marked.js)
- 🔓 **Open Source**: AGPL-3.0 licensed - fork, modify, and improve!

## 🎯 Use Cases

- Convert research papers and academic PDFs to markdown
- Extract text from scanned documents for note-taking
- Create markdown documentation from PDF manuals
- Archive important documents in an editable format
- Process invoices, receipts, and legal documents privately
- Prepare content for static site generators (Jekyll, Hugo, etc.)

## 🚀 Quick Start

### Option 1: Use Online (Recommended)

Simply visit the hosted version (add your URL here) and start converting!

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/otechai/pdf-to-markdown.git
   cd pdf-to-markdown
   ```

2. **Open in browser**
   ```bash
   # Just open index.html in your browser, or use a local server:
   python -m http.server 8000
   # Or with Node.js:
   npx serve
   ```

3. **Start converting**
   - Open `http://localhost:8000` in your browser
   - Drag and drop your PDF or click to browse
   - Edit and download your markdown!

### Option 3: Use as a Chrome Extension

You can package this as a Chrome extension for offline use:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project folder
4. The app is now available offline!

## 📁 Project Structure

```
pdf-to-markdown/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js             # Application logic and PDF processing
├── README.md          # This file
└── LICENSE            # AGPL-3.0 License
```

## 🛠️ Technology Stack

- **[PDF.js](https://mozilla.github.io/pdf.js/)** - PDF parsing and text extraction
- **[Marked.js](https://marked.js.org/)** - Markdown rendering for live preview
- **Vanilla JavaScript** - No frameworks, pure JS
- **Modern CSS** - Responsive design with flexbox and grid
- **HTML5** - Semantic markup

## 🔧 Configuration

You can customize the application by modifying the `CONFIG` object in `app.js`:

```javascript
const CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024,  // Maximum PDF size (50MB)
  ACCEPTED_FILE_TYPE: 'application/pdf',
  COPY_FEEDBACK_DURATION: 2000,      // Clipboard feedback duration (ms)
};
```

## 🎨 Customization

### Changing the Theme

Edit the CSS variables in `styles.css`:

```css
/* Example: Change to a blue theme */
body {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%);
}
```

### Adjusting PDF Processing

Modify the `formatAsMarkdown()` function in `app.js` to customize markdown output:

```javascript
// Example: Change heading detection threshold
if (trimmed.length < 80 && trimmed.length > 5) {  // Changed from 60 to 80
  return `## ${trimmed}`;
}
```

## 🔒 Privacy & Security

This application is built with privacy as the top priority:

- ✅ **No Server Communication**: All processing happens in your browser
- ✅ **No Tracking**: No analytics, cookies, or third-party scripts
- ✅ **No Data Storage**: Files are processed in memory only
- ✅ **Open Source**: Full transparency - review the code yourself
- ✅ **HTTPS Ready**: Secure deployment out of the box

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and structure
- Add comments for complex logic
- Test with various PDF types (text-based, scanned, complex layouts)
- Ensure responsive design works on all screen sizes
- Maintain accessibility standards

## 🐛 Known Limitations

- **Scanned PDFs**: Image-based PDFs without text layers cannot be converted (OCR not included)
- **Complex Layouts**: Multi-column layouts may not preserve formatting perfectly
- **Tables**: Complex table structures might require manual adjustment
- **Fonts & Styling**: Visual formatting is lost (bold, italic detection is limited)
- **Images**: Embedded images are not extracted (text only)

## 🗺️ Roadmap

Future improvements planned:

- [ ] OCR support for scanned PDFs
- [ ] Better table detection and formatting
- [ ] Image extraction and embedding
- [ ] Batch processing (multiple PDFs)
- [ ] Custom markdown formatting presets
- [ ] Export to other formats (HTML, DOCX)
- [ ] Dark/Light theme toggle
- [ ] Browser extension versions
- [ ] Progressive Web App (PWA) support

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

This means:
- ✅ You can use, modify, and distribute this software
- ✅ You must disclose the source code
- ✅ You must license derivative works under AGPL-3.0
- ✅ If you run a modified version as a web service, you must make the source available

See the [LICENSE](LICENSE) file for full details.

## 👨‍💻 Author

**Otmane Echaibi**

- Email: [sudotoo@protonmail.com](mailto:sudotoo@protonmail.com)
- GitHub: [@otmaneechaibi](https://github.com/otmaneechaibi)

## 💖 Support

If you find this project useful, consider supporting its development:

- ⭐ Star this repository
- 🐛 Report bugs and request features
- 🤝 Contribute code improvements
- ☕ [Buy me a coffee](https://buymeacoffee.com/otmane)

## 🙏 Acknowledgments

- **Mozilla Foundation** for PDF.js
- **Christopher Jeffrey** for Marked.js
- **Open Source Community** for making the web better

## 📞 Support & Questions

- **Issues**: [GitHub Issues](https://github.com/otechai/pdf-to-markdown/issues)
- **Email**: [sudotoo@protonmail.com](mailto:sudotoo@protonmail.com)
- **Discussions**: [GitHub Discussions](https://github.com/otechai/pdf-to-markdown/discussions)

---

<div align="center">

**Making the internet a better place, one conversion at a time** 🌐

[Website](https://your-website.com) • [Demo](https://your-demo.com) • [Report Bug](https://github.com/otechai/pdf-to-markdown/issues) • [Request Feature](https://github.com/otechai/pdf-to-markdown/issues)

</div>
