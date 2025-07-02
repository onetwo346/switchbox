// SwitchBox Pro Configuration
const CONVERSION_CONFIG = {
    // Document Conversions
    'word-to-pdf': {
        category: 'documents',
        title: 'Word to PDF',
        subtitle: 'Convert DOC/DOCX to PDF',
        icon: 'fas fa-file-word',
        input: '.doc,.docx',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert Microsoft Word documents to PDF format',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 50 * 1024 * 1024 // 50MB
    },
    'pdf-to-word': {
        category: 'documents',
        title: 'PDF to Word',
        subtitle: 'Convert PDF to DOCX',
        icon: 'fas fa-file-pdf',
        input: '.pdf',
        output: '.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Extract text from PDF and convert to Word document',
        quality: ['high', 'medium'],
        maxFileSize: 25 * 1024 * 1024 // 25MB
    },
    'text-to-pdf': {
        category: 'documents',
        title: 'Text to PDF',
        subtitle: 'Convert text to PDF',
        icon: 'fas fa-file-alt',
        input: 'text',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert plain text to PDF document',
        quality: ['high', 'medium'],
        maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    'rtf-to-pdf': {
        category: 'documents',
        title: 'RTF to PDF',
        subtitle: 'Convert RTF to PDF',
        icon: 'fas fa-file-alt',
        input: '.rtf',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert Rich Text Format to PDF',
        quality: ['high', 'medium'],
        maxFileSize: 20 * 1024 * 1024 // 20MB
    },
    'odt-to-pdf': {
        category: 'documents',
        title: 'ODT to PDF',
        subtitle: 'Convert ODT to PDF',
        icon: 'fas fa-file-alt',
        input: '.odt',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert OpenDocument Text to PDF',
        quality: ['high', 'medium'],
        maxFileSize: 30 * 1024 * 1024 // 30MB
    },

    // Image Conversions
    'jpg-to-png': {
        category: 'images',
        title: 'JPG to PNG',
        subtitle: 'Convert JPG to PNG',
        icon: 'fas fa-image',
        input: '.jpg,.jpeg',
        output: '.png',
        mime: 'image/png',
        description: 'Convert JPEG images to PNG format',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 20 * 1024 * 1024 // 20MB
    },
    'png-to-jpg': {
        category: 'images',
        title: 'PNG to JPG',
        subtitle: 'Convert PNG to JPG',
        icon: 'fas fa-image',
        input: '.png',
        output: '.jpg',
        mime: 'image/jpeg',
        description: 'Convert PNG images to JPEG format',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 20 * 1024 * 1024 // 20MB
    },
    'image-to-jpg': {
        category: 'images',
        title: 'Image to JPG',
        subtitle: 'Convert any image to JPG',
        icon: 'fas fa-image',
        input: '.png,.webp,.gif,.bmp,.tiff,.svg',
        output: '.jpg',
        mime: 'image/jpeg',
        description: 'Convert various image formats to JPEG',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 25 * 1024 * 1024 // 25MB
    },
    'image-to-png': {
        category: 'images',
        title: 'Image to PNG',
        subtitle: 'Convert any image to PNG',
        icon: 'fas fa-image',
        input: '.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.svg',
        output: '.png',
        mime: 'image/png',
        description: 'Convert various image formats to PNG',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 25 * 1024 * 1024 // 25MB
    },
    'image-to-webp': {
        category: 'images',
        title: 'Image to WebP',
        subtitle: 'Convert to WebP format',
        icon: 'fas fa-image',
        input: '.jpg,.jpeg,.png,.gif,.bmp,.tiff',
        output: '.webp',
        mime: 'image/webp',
        description: 'Convert images to modern WebP format',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 25 * 1024 * 1024 // 25MB
    },
    'image-to-text': {
        category: 'images',
        title: 'Image to Text',
        subtitle: 'Extract text from images',
        icon: 'fas fa-font',
        input: '.jpg,.jpeg,.png,.gif,.bmp,.tiff',
        output: '.txt',
        mime: 'text/plain',
        description: 'Extract text from images using OCR',
        quality: ['high', 'medium'],
        maxFileSize: 15 * 1024 * 1024 // 15MB
    },

    // Audio Conversions
    'mp3-to-wav': {
        category: 'audio',
        title: 'MP3 to WAV',
        subtitle: 'Convert MP3 to WAV',
        icon: 'fas fa-music',
        input: '.mp3',
        output: '.wav',
        mime: 'audio/wav',
        description: 'Convert MP3 audio to WAV format',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 100 * 1024 * 1024 // 100MB
    },
    'wav-to-mp3': {
        category: 'audio',
        title: 'WAV to MP3',
        subtitle: 'Convert WAV to MP3',
        icon: 'fas fa-music',
        input: '.wav',
        output: '.mp3',
        mime: 'audio/mpeg',
        description: 'Convert WAV audio to MP3 format',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 200 * 1024 * 1024 // 200MB
    },
    'audio-to-wav': {
        category: 'audio',
        title: 'Audio to WAV',
        subtitle: 'Convert any audio to WAV',
        icon: 'fas fa-music',
        input: '.mp3,.aac,.ogg,.m4a,.flac',
        output: '.wav',
        mime: 'audio/wav',
        description: 'Convert various audio formats to WAV',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 150 * 1024 * 1024 // 150MB
    },
    'audio-to-mp3': {
        category: 'audio',
        title: 'Audio to MP3',
        subtitle: 'Convert any audio to MP3',
        icon: 'fas fa-music',
        input: '.wav,.aac,.ogg,.m4a,.flac',
        output: '.mp3',
        mime: 'audio/mpeg',
        description: 'Convert various audio formats to MP3',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 150 * 1024 * 1024 // 150MB
    },
    'text-to-speech': {
        category: 'audio',
        title: 'Text to Speech',
        subtitle: 'Convert text to audio',
        icon: 'fas fa-volume-up',
        input: 'text',
        output: '.mp3',
        mime: 'audio/mpeg',
        description: 'Convert text to speech audio',
        quality: ['high', 'medium'],
        maxFileSize: 5 * 1024 * 1024 // 5MB text
    },

    // Video Conversions
    'mp4-to-mp3': {
        category: 'video',
        title: 'MP4 to MP3',
        subtitle: 'Extract audio from video',
        icon: 'fas fa-video',
        input: '.mp4,.avi,.mov,.mkv,.wmv,.flv',
        output: '.mp3',
        mime: 'audio/mpeg',
        description: 'Extract audio from video files',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 500 * 1024 * 1024 // 500MB
    },
    'video-to-mp4': {
        category: 'video',
        title: 'Video to MP4',
        subtitle: 'Convert any video to MP4',
        icon: 'fas fa-video',
        input: '.avi,.mov,.mkv,.wmv,.flv,.webm',
        output: '.mp4',
        mime: 'video/mp4',
        description: 'Convert various video formats to MP4',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 1 * 1024 * 1024 * 1024 // 1GB
    },
    'video-to-gif': {
        category: 'video',
        title: 'Video to GIF',
        subtitle: 'Convert video to animated GIF',
        icon: 'fas fa-gift',
        input: '.mp4,.avi,.mov,.mkv,.wmv,.flv',
        output: '.gif',
        mime: 'image/gif',
        description: 'Convert video to animated GIF',
        quality: ['high', 'medium', 'low'],
        maxFileSize: 200 * 1024 * 1024 // 200MB
    },
    'gif-to-mp4': {
        category: 'video',
        title: 'GIF to MP4',
        subtitle: 'Convert GIF to MP4',
        icon: 'fas fa-gift',
        input: '.gif',
        output: '.mp4',
        mime: 'video/mp4',
        description: 'Convert animated GIF to MP4 video',
        quality: ['high', 'medium'],
        maxFileSize: 50 * 1024 * 1024 // 50MB
    },

    // Data Conversions
    'excel-to-pdf': {
        category: 'data',
        title: 'Excel to PDF',
        subtitle: 'Convert Excel to PDF',
        icon: 'fas fa-file-excel',
        input: '.xls,.xlsx',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert Excel spreadsheets to PDF',
        quality: ['high', 'medium'],
        maxFileSize: 30 * 1024 * 1024 // 30MB
    },
    'csv-to-excel': {
        category: 'data',
        title: 'CSV to Excel',
        subtitle: 'Convert CSV to Excel',
        icon: 'fas fa-file-csv',
        input: '.csv',
        output: '.xlsx',
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        description: 'Convert CSV files to Excel format',
        quality: ['high'],
        maxFileSize: 20 * 1024 * 1024 // 20MB
    },
    'excel-to-csv': {
        category: 'data',
        title: 'Excel to CSV',
        subtitle: 'Convert Excel to CSV',
        icon: 'fas fa-file-excel',
        input: '.xls,.xlsx',
        output: '.csv',
        mime: 'text/csv',
        description: 'Convert Excel spreadsheets to CSV',
        quality: ['high'],
        maxFileSize: 30 * 1024 * 1024 // 30MB
    },
    'json-to-csv': {
        category: 'data',
        title: 'JSON to CSV',
        subtitle: 'Convert JSON to CSV',
        icon: 'fas fa-file-code',
        input: '.json',
        output: '.csv',
        mime: 'text/csv',
        description: 'Convert JSON data to CSV format',
        quality: ['high'],
        maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    'csv-to-json': {
        category: 'data',
        title: 'CSV to JSON',
        subtitle: 'Convert CSV to JSON',
        icon: 'fas fa-file-csv',
        input: '.csv',
        output: '.json',
        mime: 'application/json',
        description: 'Convert CSV files to JSON format',
        quality: ['high'],
        maxFileSize: 20 * 1024 * 1024 // 20MB
    },

    // Web Conversions
    'html-to-pdf': {
        category: 'web',
        title: 'HTML to PDF',
        subtitle: 'Convert HTML to PDF',
        icon: 'fas fa-file-code',
        input: '.html,.htm',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert HTML files to PDF',
        quality: ['high', 'medium'],
        maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    'markdown-to-html': {
        category: 'web',
        title: 'Markdown to HTML',
        subtitle: 'Convert Markdown to HTML',
        icon: 'fas fa-file-code',
        input: '.md,.markdown',
        output: '.html',
        mime: 'text/html',
        description: 'Convert Markdown files to HTML',
        quality: ['high'],
        maxFileSize: 5 * 1024 * 1024 // 5MB
    },
    'markdown-to-pdf': {
        category: 'web',
        title: 'Markdown to PDF',
        subtitle: 'Convert Markdown to PDF',
        icon: 'fas fa-file-code',
        input: '.md,.markdown',
        output: '.pdf',
        mime: 'application/pdf',
        description: 'Convert Markdown files to PDF',
        quality: ['high', 'medium'],
        maxFileSize: 5 * 1024 * 1024 // 5MB
    },
    'pdf-to-text': {
        category: 'web',
        title: 'PDF to Text',
        subtitle: 'Extract text from PDF',
        icon: 'fas fa-file-pdf',
        input: '.pdf',
        output: '.txt',
        mime: 'text/plain',
        description: 'Extract text content from PDF files',
        quality: ['high', 'medium'],
        maxFileSize: 25 * 1024 * 1024 // 25MB
    }
};

// Category definitions
const CATEGORIES = {
    documents: {
        name: 'Documents',
        icon: 'fas fa-file-alt',
        description: 'Convert between document formats'
    },
    images: {
        name: 'Images',
        icon: 'fas fa-image',
        description: 'Convert and process images'
    },
    audio: {
        name: 'Audio',
        icon: 'fas fa-music',
        description: 'Convert audio files and text-to-speech'
    },
    video: {
        name: 'Video',
        icon: 'fas fa-video',
        description: 'Convert video formats and extract audio'
    },
    data: {
        name: 'Data',
        icon: 'fas fa-table',
        description: 'Convert spreadsheet and data formats'
    },
    web: {
        name: 'Web',
        icon: 'fas fa-globe',
        description: 'Convert web formats and markup'
    }
};

// File type icons mapping
const FILE_ICONS = {
    // Documents
    '.pdf': 'fas fa-file-pdf',
    '.doc': 'fas fa-file-word',
    '.docx': 'fas fa-file-word',
    '.txt': 'fas fa-file-alt',
    '.rtf': 'fas fa-file-alt',
    '.odt': 'fas fa-file-alt',
    
    // Images
    '.jpg': 'fas fa-file-image',
    '.jpeg': 'fas fa-file-image',
    '.png': 'fas fa-file-image',
    '.gif': 'fas fa-file-image',
    '.bmp': 'fas fa-file-image',
    '.tiff': 'fas fa-file-image',
    '.webp': 'fas fa-file-image',
    '.svg': 'fas fa-file-image',
    
    // Audio
    '.mp3': 'fas fa-file-audio',
    '.wav': 'fas fa-file-audio',
    '.aac': 'fas fa-file-audio',
    '.ogg': 'fas fa-file-audio',
    '.m4a': 'fas fa-file-audio',
    '.flac': 'fas fa-file-audio',
    
    // Video
    '.mp4': 'fas fa-file-video',
    '.avi': 'fas fa-file-video',
    '.mov': 'fas fa-file-video',
    '.mkv': 'fas fa-file-video',
    '.wmv': 'fas fa-file-video',
    '.flv': 'fas fa-file-video',
    '.webm': 'fas fa-file-video',
    
    // Data
    '.xls': 'fas fa-file-excel',
    '.xlsx': 'fas fa-file-excel',
    '.csv': 'fas fa-file-csv',
    '.json': 'fas fa-file-code',
    '.xml': 'fas fa-file-code',
    
    // Web
    '.html': 'fas fa-file-code',
    '.htm': 'fas fa-file-code',
    '.md': 'fas fa-file-code',
    '.markdown': 'fas fa-file-code'
};

// Default settings
const DEFAULT_SETTINGS = {
    quality: 'medium',
    autoDownload: false,
    darkMode: true,
    maxConcurrentFiles: 5,
    showFileSize: true,
    showProgress: true
};

// Export configuration
window.CONVERSION_CONFIG = CONVERSION_CONFIG;
window.CATEGORIES = CATEGORIES;
window.FILE_ICONS = FILE_ICONS;
window.DEFAULT_SETTINGS = DEFAULT_SETTINGS; 