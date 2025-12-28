/**
 * PDF to Markdown Converter
 * Author: Otmane Echaibi (sudotoo@protonmail.com)
 * Description: 100% client-side PDF to Markdown converter
 * License: Open Source - Making the internet a better place
 * 
 * This application processes PDFs entirely in the browser.
 * No data is ever sent to any server.
 */

// ========================================
// 1. Configuration & Constants
// ========================================

const CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  ACCEPTED_FILE_TYPE: 'application/pdf',
  PDF_WORKER_URL: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  COPY_FEEDBACK_DURATION: 2000, // milliseconds
};

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.PDF_WORKER_URL;

// ========================================
// 2. DOM Element References
// ========================================

const elements = {
  // Sections
  uploadSection: document.getElementById('uploadSection'),
  loading: document.getElementById('loading'),
  results: document.getElementById('results'),
  
  // Upload area
  uploadArea: document.getElementById('uploadArea'),
  fileInput: document.getElementById('fileInput'),
  error: document.getElementById('error'),
  
  // Results area
  fileName: document.getElementById('fileName'),
  fileStats: document.getElementById('fileStats'),
  markdownEditor: document.getElementById('markdownEditor'),
  preview: document.getElementById('preview'),
  
  // Buttons
  copyBtn: document.getElementById('copyBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  newFileBtn: document.getElementById('newFileBtn'),
  
  // Footer
  currentYear: document.getElementById('currentYear'),
};

// ========================================
// 3. Application State
// ========================================

let appState = {
  currentFileName: '',
  processingStartTime: null,
};

// ========================================
// 4. Initialization
// ========================================

/**
 * Initialize the application
 */
function initializeApp() {
  setupEventListeners();
  setCurrentYear();
  
  // Log privacy message to console
  console.log('%c🔒 Privacy First', 'color: #4ade80; font-size: 16px; font-weight: bold;');
  console.log('%cAll PDF processing happens in your browser. No data is ever uploaded to any server.', 'color: #d8b4fe; font-size: 12px;');
  console.log('%cBuilt with ❤️ by Otmane Echaibi', 'color: #a855f7; font-size: 12px;');
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }
}

// ========================================
// 5. Event Listeners Setup
// ========================================

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Upload area click
  elements.uploadArea.addEventListener('click', handleUploadAreaClick);
  
  // Keyboard accessibility for upload area
  elements.uploadArea.addEventListener('keydown', handleUploadAreaKeydown);
  
  // File input change
  elements.fileInput.addEventListener('change', handleFileInputChange);
  
  // Drag and drop events
  elements.uploadArea.addEventListener('dragover', handleDragOver);
  elements.uploadArea.addEventListener('dragleave', handleDragLeave);
  elements.uploadArea.addEventListener('drop', handleDrop);
  
  // Prevent default drag behavior on document
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, preventDefaults, false);
  });
  
  // Editor input for live preview
  elements.markdownEditor.addEventListener('input', debounce(updatePreview, 300));
  
  // Button clicks
  elements.copyBtn.addEventListener('click', handleCopyClick);
  elements.downloadBtn.addEventListener('click', handleDownloadClick);
  elements.newFileBtn.addEventListener('click', handleNewFileClick);
}

/**
 * Prevent default behavior for drag events
 */
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// ========================================
// 6. Event Handlers
// ========================================

/**
 * Handle upload area click
 */
function handleUploadAreaClick() {
  elements.fileInput.click();
}

/**
 * Handle keyboard navigation on upload area
 */
function handleUploadAreaKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    elements.fileInput.click();
  }
}

/**
 * Handle file input change
 */
function handleFileInputChange(e) {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
}

/**
 * Handle drag over event
 */
function handleDragOver(e) {
  e.preventDefault();
  elements.uploadArea.classList.add('dragover');
}

/**
 * Handle drag leave event
 */
function handleDragLeave() {
  elements.uploadArea.classList.remove('dragover');
}

/**
 * Handle drop event
 */
function handleDrop(e) {
  e.preventDefault();
  elements.uploadArea.classList.remove('dragover');
  
  const file = e.dataTransfer.files[0];
  if (file) {
    handleFile(file);
  }
}

/**
 * Handle copy button click
 */
async function handleCopyClick() {
  try {
    const markdown = elements.markdownEditor.value;
    
    // Use modern Clipboard API
    await navigator.clipboard.writeText(markdown);
    
    // Show feedback
    const originalHTML = elements.copyBtn.innerHTML;
    elements.copyBtn.innerHTML = '<span aria-hidden="true">✅</span> Copied!';
    elements.copyBtn.disabled = true;
    
    setTimeout(() => {
      elements.copyBtn.innerHTML = originalHTML;
      elements.copyBtn.disabled = false;
    }, CONFIG.COPY_FEEDBACK_DURATION);
    
  } catch (err) {
    console.error('Failed to copy:', err);
    showError('Failed to copy to clipboard. Please try selecting and copying manually.');
  }
}

/**
 * Handle download button click
 */
function handleDownloadClick() {
  try {
    const markdown = elements.markdownEditor.value;
    const fileName = appState.currentFileName || 'document';
    
    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error('Failed to download:', err);
    showError('Failed to download file. Please try again.');
  }
}

/**
 * Handle new file button click
 */
function handleNewFileClick() {
  if (confirm('Start over with a new file? Your current work will be lost.')) {
    resetApp();
  }
}

// ========================================
// 7. File Processing
// ========================================

/**
 * Handle uploaded file
 * @param {File} file - The uploaded PDF file
 */
async function handleFile(file) {
  // Validate file type
  if (file.type !== CONFIG.ACCEPTED_FILE_TYPE) {
    showError('Invalid file type. Please select a PDF file.');
    return;
  }
  
  // Validate file size
  if (file.size > CONFIG.MAX_FILE_SIZE) {
    showError(`File size exceeds 50MB. Your file is ${formatFileSize(file.size)}.`);
    return;
  }
  
  // Reset error state
  hideError();
  
  // Store filename (without extension)
  appState.currentFileName = file.name.replace('.pdf', '');
  appState.processingStartTime = Date.now();
  
  // Show loading state
  showLoading();
  
  try {
    // Extract text from PDF
    const markdown = await extractTextFromPDF(file);
    
    // Calculate processing time
    const processingTime = ((Date.now() - appState.processingStartTime) / 1000).toFixed(2);
    console.log(`✅ PDF processed in ${processingTime} seconds`);
    
    // Show results
    showResults(markdown);
    
  } catch (err) {
    console.error('PDF processing error:', err);
    
    // Show user-friendly error message
    let errorMessage = 'Failed to process PDF. ';
    
    if (err.name === 'InvalidPDFException') {
      errorMessage += 'The file appears to be corrupted or not a valid PDF.';
    } else if (err.name === 'PasswordException') {
      errorMessage += 'This PDF is password-protected and cannot be processed.';
    } else {
      errorMessage += 'Please try another file or ensure the PDF is not corrupted.';
    }
    
    showError(errorMessage);
    hideLoading();
  }
}

/**
 * Extract text from PDF file
 * @param {File} file - PDF file to process
 * @returns {Promise<string>} Extracted markdown text
 */
async function extractTextFromPDF(file) {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`📄 Processing ${pdf.numPages} pages...`);
    
    let fullText = '';
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text with layout preservation
      const pageText = extractPageText(textContent);
      fullText += pageText;
      
      // Add page separator (except for last page)
      if (pageNum < pdf.numPages) {
        fullText += '\n\n---\n\n';
      }
      
      // Log progress for large files
      if (pageNum % 10 === 0 || pageNum === pdf.numPages) {
        console.log(`📄 Processed ${pageNum}/${pdf.numPages} pages`);
      }
    }
    
    // Format extracted text as markdown
    return formatAsMarkdown(fullText);
    
  } catch (err) {
    console.error('Error extracting PDF text:', err);
    throw err;
  }
}

/**
 * Extract text from a PDF page with layout preservation
 * @param {Object} textContent - PDF.js text content object
 * @returns {string} Extracted text
 */
function extractPageText(textContent) {
  let lastY = null;
  let line = '';
  let pageText = '';
  
  // Process each text item
  textContent.items.forEach((item) => {
    const y = item.transform[5]; // Y coordinate
    const str = item.str;
    
    // Detect line breaks based on Y coordinate changes
    if (lastY !== null && Math.abs(y - lastY) > 5) {
      // New line detected
      if (line.trim()) {
        pageText += line.trim() + '\n\n';
      }
      line = '';
    }
    
    // Add text to current line
    line += str + ' ';
    lastY = y;
  });
  
  // Add final line
  if (line.trim()) {
    pageText += line.trim() + '\n\n';
  }
  
  return pageText;
}

/**
 * Format extracted text as markdown
 * @param {string} text - Raw extracted text
 * @returns {string} Formatted markdown
 */
function formatAsMarkdown(text) {
  let markdown = text;
  
  // Split into paragraphs
  const paragraphs = markdown.split('\n\n').filter(p => p.trim());
  
  // Process each paragraph
  const formattedParagraphs = paragraphs.map((para, idx, arr) => {
    const trimmed = para.trim();
    
    // Detect potential headings
    // Short lines (< 60 chars) that aren't lists might be headings
    if (trimmed.length > 5 && 
        trimmed.length < 60 && 
        !trimmed.match(/^\d+\./) && 
        !trimmed.match(/^[•·▪▸■\-\*]/) &&
        idx < arr.length - 1 &&
        arr[idx + 1].length > trimmed.length) {
      return `## ${trimmed}`;
    }
    
    return trimmed;
  });
  
  markdown = formattedParagraphs.join('\n\n');
  
  // Format bullet points (various symbols)
  markdown = markdown.replace(/^([•·▪▸■])\s+(.+)$/gm, '- $2');
  
  // Format numbered lists
  markdown = markdown.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');
  
  // Clean up multiple blank lines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  return markdown.trim();
}

// ========================================
// 8. UI State Management
// ========================================

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.add('show');
  
  // Scroll error into view
  elements.error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hide error message
 */
function hideError() {
  elements.error.classList.remove('show');
}

/**
 * Show loading state
 */
function showLoading() {
  elements.uploadSection.style.display = 'none';
  elements.loading.classList.add('show');
}

/**
 * Hide loading state
 */
function hideLoading() {
  elements.loading.classList.remove('show');
}

/**
 * Show results section
 * @param {string} markdown - Converted markdown text
 */
function showResults(markdown) {
  hideLoading();
  
  // Update UI
  elements.results.classList.add('show');
  elements.fileName.textContent = `${appState.currentFileName}.md`;
  elements.markdownEditor.value = markdown;
  
  // Update preview
  updatePreview();
  
  // Scroll to results
  elements.results.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Reset application to initial state
 */
function resetApp() {
  // Hide results
  elements.results.classList.remove('show');
  
  // Show upload section
  elements.uploadSection.style.display = 'block';
  
  // Clear data
  elements.markdownEditor.value = '';
  elements.preview.innerHTML = '';
  elements.fileInput.value = '';
  
  // Reset state
  appState.currentFileName = '';
  appState.processingStartTime = null;
  
  // Hide any errors
  hideError();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// 9. Preview Updates
// ========================================

/**
 * Update markdown preview
 */
function updatePreview() {
  try {
    const markdown = elements.markdownEditor.value;
    
    // Render markdown using marked.js
    elements.preview.innerHTML = marked.parse(markdown);
    
    // Update character count
    updateFileStats(markdown);
    
  } catch (err) {
    console.error('Preview rendering error:', err);
    elements.preview.innerHTML = '<p style="color: #fecaca;">Error rendering preview. The markdown might contain invalid syntax.</p>';
  }
}

/**
 * Update file statistics display
 * @param {string} markdown - Current markdown content
 */
function updateFileStats(markdown) {
  const charCount = markdown.length;
  const wordCount = markdown.trim().split(/\s+/).filter(w => w.length > 0).length;
  const lineCount = markdown.split('\n').length;
  
  elements.fileStats.textContent = `(${formatNumber(charCount)} chars, ${formatNumber(wordCount)} words, ${formatNumber(lineCount)} lines)`;
}

// ========================================
// 10. Utility Functions
// ========================================

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// 11. Error Handling
// ========================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Don't show errors from external scripts
  if (event.filename && !event.filename.includes(window.location.hostname)) {
    return;
  }
  
  showError('An unexpected error occurred. Please refresh the page and try again.');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// ========================================
// 12. Application Start
// ========================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Log app info
console.log(`
╔════════════════════════════════════════════╗
║   PDF to Markdown Converter v1.0.0         ║
║   Author: Otmane Echaibi                   ║
║   100% Private • Client-Side Processing    ║
╚════════════════════════════════════════════╝
`);
