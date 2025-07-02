// SwitchBox Pro Main Application
class SwitchBoxApp {
    constructor() {
        this.selectedConversionType = null;
        this.selectedCategory = 'documents';
        this.files = [];
        this.settings = { ...DEFAULT_SETTINGS };
        this.isConverting = false;
        this.conversionQueue = [];
        
        this.init();
    }

    async init() {
        // Load settings
        this.loadSettings();
        
        // Initialize UI
        this.initializeUI();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
    }

    initializeUI() {
        this.renderCategoryTabs();
        this.renderConversionGrid();
        this.updateFileTypeHint();
        this.applyTheme();
    }

    renderCategoryTabs() {
        const categoryTabs = document.querySelector('.category-tabs');
        categoryTabs.innerHTML = '';

        Object.entries(CATEGORIES).forEach(([key, category]) => {
            const tab = document.createElement('button');
            tab.className = `category-tab ${key === this.selectedCategory ? 'active' : ''}`;
            tab.dataset.category = key;
            tab.innerHTML = `
                <i class="${category.icon}"></i>
                ${category.name}
            `;
            categoryTabs.appendChild(tab);
        });
    }

    renderConversionGrid() {
        const grid = document.getElementById('conversion-grid');
        grid.innerHTML = '';

        Object.entries(CONVERSION_CONFIG)
            .filter(([key, config]) => config.category === this.selectedCategory)
            .forEach(([key, config]) => {
                const btn = document.createElement('div');
                btn.className = 'conversion-btn';
                btn.dataset.type = key;
                btn.innerHTML = `
                    <i class="${config.icon}"></i>
                    <div class="btn-title">${config.title}</div>
                    <div class="btn-subtitle">${config.subtitle}</div>
                `;
                grid.appendChild(btn);
            });
    }

    setupEventListeners() {
        // Category tab clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-tab')) {
                const tab = e.target.closest('.category-tab');
                this.selectCategory(tab.dataset.category);
            }
        });

        // Conversion button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.conversion-btn')) {
                const btn = e.target.closest('.conversion-btn');
                this.selectConversionType(btn.dataset.type);
            }
        });

        // File input change
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        // Drag and drop
        this.setupDragAndDrop();

        // Text input events
        document.getElementById('text-input').addEventListener('input', (e) => {
            this.updateTextStats(e.target.value);
        });

        // Settings
        document.getElementById('default-quality').addEventListener('change', (e) => {
            this.settings.quality = e.target.value;
            this.saveSettings();
        });

        document.getElementById('auto-download').addEventListener('change', (e) => {
            this.settings.autoDownload = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('dark-mode').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            this.applyTheme();
            this.saveSettings();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.showSettings();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showHelp();
                        break;
                }
            }
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        const uploadSection = document.querySelector('.upload-section');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadSection.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadSection.classList.remove('drag-over');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            this.handleFileSelect(files);
        });
    }

    selectCategory(category) {
        this.selectedCategory = category;
        this.selectedConversionType = null;
        
        // Update UI
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        this.renderConversionGrid();
        this.updateFileTypeHint();
        this.hideTextInput();
        this.showFileUpload();
    }

    selectConversionType(type) {
        this.selectedConversionType = type;
        
        // Update UI
        document.querySelectorAll('.conversion-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        this.updateFileTypeHint();
        this.updateFormatOptions();
        
        // Show appropriate input section
        const config = CONVERSION_CONFIG[type];
        if (config.input === 'text') {
            this.hideFileUpload();
            this.showTextInput();
        } else {
            this.hideTextInput();
            this.showFileUpload();
        }
        
        this.updateConvertButton();
    }

    updateFileTypeHint() {
        const hint = document.getElementById('file-type-hint');
        if (this.selectedConversionType) {
            const config = CONVERSION_CONFIG[this.selectedConversionType];
            hint.textContent = `Upload ${config.input} file(s)`;
        } else {
            hint.textContent = 'Select a conversion type first';
        }
    }

    updateFormatOptions() {
        const formatSelect = document.getElementById('format-select');
        formatSelect.innerHTML = '';
        
        if (this.selectedConversionType) {
            const config = CONVERSION_CONFIG[this.selectedConversionType];
            const option = document.createElement('option');
            option.value = config.output;
            option.textContent = config.output.toUpperCase();
            formatSelect.appendChild(option);
        }
    }

    handleFileSelect(fileList) {
        const files = Array.from(fileList);
        
        files.forEach(file => {
            if (this.validateFile(file)) {
                this.addFile(file);
            }
        });
        
        this.updateConvertButton();
    }

    validateFile(file) {
        if (!this.selectedConversionType) {
            this.showError('Please select a conversion type first');
            return false;
        }

        const config = CONVERSION_CONFIG[this.selectedConversionType];
        
        // Check file size
        if (file.size > config.maxFileSize) {
            this.showError(`File "${file.name}" is too large. Maximum size is ${this.formatFileSize(config.maxFileSize)}`);
            return false;
        }

        // Check file type
        if (config.input !== 'text') {
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();
            const validExtensions = config.input.split(',');
            
            if (!validExtensions.some(ext => ext === fileExt)) {
                this.showError(`File "${file.name}" is not a valid ${config.input} file`);
                return false;
            }
        }

        return true;
    }

    addFile(file) {
        const fileId = Date.now() + Math.random();
        this.files.push({ id: fileId, file: file });
        this.renderFileList();
    }

    removeFile(fileId) {
        this.files = this.files.filter(f => f.id !== fileId);
        this.renderFileList();
        this.updateConvertButton();
    }

    renderFileList() {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';

        this.files.forEach(({ id, file }) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="${converters.getFileIcon(file.name)}"></i>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${this.formatFileSize(file.size)}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-file" onclick="app.removeFile(${id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            fileList.appendChild(fileItem);
        });
    }

    updateConvertButton() {
        const convertBtn = document.getElementById('convert-btn');
        const hasFiles = this.files.length > 0;
        const hasText = document.getElementById('text-input').value.trim().length > 0;
        const isValid = this.selectedConversionType && (hasFiles || hasText);
        
        convertBtn.disabled = !isValid;
    }

    showTextInput() {
        document.getElementById('text-input-section').classList.remove('hidden');
        document.getElementById('text-input').focus();
    }

    hideTextInput() {
        document.getElementById('text-input-section').classList.add('hidden');
    }

    showFileUpload() {
        document.querySelector('.upload-section').classList.remove('hidden');
    }

    hideFileUpload() {
        document.querySelector('.upload-section').classList.add('hidden');
    }

    updateTextStats(text) {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        document.getElementById('word-count').textContent = `${words} words`;
        document.getElementById('char-count').textContent = `${chars} characters`;
        
        this.updateConvertButton();
    }

    async startConversion() {
        if (this.isConverting) return;
        
        this.isConverting = true;
        this.showProgress();
        
        try {
            const quality = document.getElementById('quality-select').value;
            const config = CONVERSION_CONFIG[this.selectedConversionType];
            
            if (config.input === 'text') {
                await this.convertText(quality);
            } else {
                await this.convertFiles(quality);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.isConverting = false;
            this.hideProgress();
        }
    }

    async convertText(quality) {
        const text = document.getElementById('text-input').value.trim();
        if (!text) {
            throw new Error('Please enter some text to convert');
        }

        const progressCallback = (progress, message) => {
            this.updateProgress(progress, message);
        };

        const result = await converters.convert(text, this.selectedConversionType, quality, progressCallback);
        const config = CONVERSION_CONFIG[this.selectedConversionType];
        this.showResults([{ name: 'converted' + config.output, blob: result }]);
    }

    async convertFiles(quality) {
        const results = [];
        
        for (let i = 0; i < this.files.length; i++) {
            const { file } = this.files[i];
            const progressCallback = (progress, message) => {
                const fileProgress = (i / this.files.length) * 100 + (progress / this.files.length);
                this.updateProgress(fileProgress, `Converting ${file.name}...`);
            };

            try {
                const result = await converters.convert(file, this.selectedConversionType, quality, progressCallback);
                const config = CONVERSION_CONFIG[this.selectedConversionType];
                const outputName = file.name.replace(/\.[^/.]+$/, '') + config.output;
                results.push({ name: outputName, blob: result });
            } catch (error) {
                this.showError(`Failed to convert ${file.name}: ${error.message}`);
            }
        }

        if (results.length > 0) {
            this.showResults(results);
            this.showSuccess(`Successfully converted ${results.length} file(s)`);
        }
    }

    showProgress() {
        document.getElementById('progress-section').classList.remove('hidden');
        this.updateProgress(0, 'Preparing conversion...');
    }

    hideProgress() {
        document.getElementById('progress-section').classList.add('hidden');
    }

    updateProgress(percentage, message) {
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        document.getElementById('progress-text').textContent = message;
        document.getElementById('progress-details').textContent = `${Math.round(percentage)}% complete`;
    }

    showResults(results) {
        const resultsSection = document.getElementById('results-section');
        const resultsGrid = document.getElementById('results-grid');
        
        resultsGrid.innerHTML = '';
        
        results.forEach(({ name, blob }) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <i class="result-icon fas fa-check-circle"></i>
                <div class="result-info">
                    <h4>${name}</h4>
                    <p>${this.formatFileSize(blob.size)}</p>
                </div>
                <button class="download-result" onclick="app.downloadFile('${name}', '${URL.createObjectURL(blob)}')">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            `;
            resultsGrid.appendChild(resultItem);
        });
        
        resultsSection.classList.remove('hidden');
        
        // Auto-download if enabled
        if (this.settings.autoDownload && results.length === 1) {
            this.downloadFile(results[0].name, URL.createObjectURL(results[0].blob));
        }
    }

    downloadFile(filename, url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    clearResults() {
        document.getElementById('results-section').classList.add('hidden');
    }

    cancelConversion() {
        this.isConverting = false;
        this.hideProgress();
        this.showError('Conversion cancelled');
    }

    showError(message) {
        // Create a simple error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showSuccess(message) {
        // Create a success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showSettings() {
        document.getElementById('settings-modal').classList.remove('hidden');
    }

    showHelp() {
        document.getElementById('help-modal').classList.remove('hidden');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    clearText() {
        document.getElementById('text-input').value = '';
        this.updateTextStats('');
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('text-input').value = text;
            this.updateTextStats(text);
        } catch (error) {
            this.showError('Failed to paste text from clipboard');
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('switchbox-settings');
        if (saved) {
            this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
        this.updateSettingsUI();
    }

    updateSettingsUI() {
        // Update quality select
        const qualitySelect = document.getElementById('quality-select');
        if (qualitySelect) {
            qualitySelect.value = this.settings.quality;
        }
        
        // Update settings modal
        const defaultQuality = document.getElementById('default-quality');
        if (defaultQuality) {
            defaultQuality.value = this.settings.quality;
        }
        
        const autoDownload = document.getElementById('auto-download');
        if (autoDownload) {
            autoDownload.checked = this.settings.autoDownload;
        }
        
        const darkMode = document.getElementById('dark-mode');
        if (darkMode) {
            darkMode.checked = this.settings.darkMode;
        }
    }

    saveSettings() {
        localStorage.setItem('switchbox-settings', JSON.stringify(this.settings));
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.settings.darkMode ? 'dark' : 'light');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Global functions for HTML onclick handlers
function showMainPage() {
    document.getElementById('intro-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
}

function showSettings() {
    app.showSettings();
}

function showHelp() {
    app.showHelp();
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

function startConversion() {
    app.startConversion();
}

function convertTextToPDF() {
    app.startConversion();
}

function clearText() {
    app.clearText();
}

function pasteText() {
    app.pasteText();
}

function clearResults() {
    app.clearResults();
}

function cancelConversion() {
    app.cancelConversion();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all external libraries are loaded
    setTimeout(() => {
        window.app = new SwitchBoxApp();
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && app.isConverting) {
        // Optionally pause conversion when tab is not visible
        console.log('Page hidden, conversion may be paused');
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', (e) => {
    if (app.isConverting) {
        e.preventDefault();
        e.returnValue = 'Conversion in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
}); 