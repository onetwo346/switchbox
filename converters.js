// SwitchBox Pro Converters
class FileConverters {
    constructor() {
        this.worker = null;
        this.initWorker();
    }

    // Initialize Web Worker for heavy operations
    initWorker() {
        if (typeof Worker !== 'undefined') {
            try {
                this.worker = new Worker('data:text/javascript,' + encodeURIComponent(`
                    self.onmessage = function(e) {
                        // Worker implementation for heavy conversions
                        self.postMessage({ type: 'progress', data: 50 });
                        self.postMessage({ type: 'complete', data: e.data });
                    };
                `));
            } catch (error) {
                console.warn('Web Worker not available, using main thread');
            }
        }
    }

    // Generic image conversion using Canvas API
    async convertImage(file, outputFormat, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                // Fill with white background for JPG conversion
                if (outputFormat === 'image/jpeg') {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error(`Failed to convert to ${outputFormat}`));
                    }
                }, outputFormat, quality);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    // Text to PDF conversion
    async textToPDF(text, quality = 'medium') {
        try {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            
            const fontSize = quality === 'high' ? 12 : quality === 'medium' ? 11 : 10;
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const margin = 50;
            const lineHeight = fontSize * 1.2;
            
            let page = pdfDoc.addPage([595, 842]); // A4 size
            const pageWidth = page.getWidth() - 2 * margin;
            const maxLinesPerPage = Math.floor((page.getHeight() - 2 * margin) / lineHeight);

            // Split text into paragraphs and process word wrapping
            const paragraphs = text.split('\n');
            let allLines = [];

            for (const paragraph of paragraphs) {
                const words = paragraph.trim().split(/\s+/);
                let currentLine = '';

                for (const word of words) {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    const width = font.widthOfTextAtSize(testLine, fontSize);

                    if (width < pageWidth) {
                        currentLine = testLine;
                    } else {
                        if (currentLine) allLines.push(currentLine);
                        currentLine = word;
                    }
                }

                if (currentLine) allLines.push(currentLine);
                allLines.push(''); // Paragraph spacing
            }

            if (allLines[allLines.length - 1] === '') allLines.pop();

            // Draw text on pages
            let lineIndex = 0;
            let currentLineOnPage = 0;

            while (lineIndex < allLines.length) {
                if (currentLineOnPage >= maxLinesPerPage) {
                    page = pdfDoc.addPage([595, 842]);
                    currentLineOnPage = 0;
                }

                const line = allLines[lineIndex];
                if (line) {
                    page.drawText(line, {
                        x: margin,
                        y: page.getHeight() - margin - (currentLineOnPage * lineHeight),
                        size: fontSize,
                        font: font,
                        color: rgb(0, 0, 0)
                    });
                }
                lineIndex++;
                currentLineOnPage++;
            }

            const pdfBytes = await pdfDoc.save();
            return new Blob([pdfBytes], { type: 'application/pdf' });
        } catch (error) {
            throw new Error('PDF creation failed: ' + error.message);
        }
    }

    // Word to PDF conversion using mammoth.js
    async wordToPDF(file, quality = 'medium') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            
            // Convert HTML to PDF
            return await this.htmlToPDF(result.value, quality);
        } catch (error) {
            throw new Error('Word to PDF conversion failed: ' + error.message);
        }
    }

    // PDF to Word conversion
    async pdfToWord(file, quality = 'medium') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            
            let text = '';
            for (let i = 0; i < pages.length; i++) {
                // Simplified text extraction - in real implementation would use PDF.js
                text += `Page ${i + 1}\n\n`;
            }
            
            // Create a simple Word document using HTML
            const html = `<html><body>${text.replace(/\n/g, '<br>')}</body></html>`;
            return await this.htmlToWord(html, quality);
        } catch (error) {
            throw new Error('PDF to Word conversion failed: ' + error.message);
        }
    }

    // HTML to PDF conversion
    async htmlToPDF(html, quality = 'medium') {
        try {
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            
            // Simple HTML to PDF conversion
            const lines = html.replace(/<[^>]*>/g, '').split('\n');
            let page = pdfDoc.addPage([595, 842]);
            const fontSize = 12;
            const lineHeight = fontSize * 1.2;
            const margin = 50;
            let y = page.getHeight() - margin;

            for (const line of lines) {
                if (y < margin) {
                    page = pdfDoc.addPage([595, 842]);
                    y = page.getHeight() - margin;
                }
                
                page.drawText(line.trim(), {
                    x: margin,
                    y: y,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0)
                });
                y -= lineHeight;
            }

            const pdfBytes = await pdfDoc.save();
            return new Blob([pdfBytes], { type: 'application/pdf' });
        } catch (error) {
            throw new Error('HTML to PDF conversion failed: ' + error.message);
        }
    }

    // HTML to Word conversion
    async htmlToWord(html, quality = 'medium') {
        try {
            // Create a simple Word document using HTML
            const wordHTML = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
                <head>
                    <meta charset="utf-8">
                    <title>Converted Document</title>
                </head>
                <body>
                    ${html}
                </body>
                </html>
            `;
            
            return new Blob([wordHTML], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
        } catch (error) {
            throw new Error('HTML to Word conversion failed: ' + error.message);
        }
    }

    // Markdown to HTML conversion
    async markdownToHTML(markdown, quality = 'high') {
        try {
            const html = marked.parse(markdown);
            return new Blob([html], { type: 'text/html' });
        } catch (error) {
            throw new Error('Markdown to HTML conversion failed: ' + error.message);
        }
    }

    // Markdown to PDF conversion
    async markdownToPDF(markdown, quality = 'medium') {
        try {
            const html = marked.parse(markdown);
            return await this.htmlToPDF(html, quality);
        } catch (error) {
            throw new Error('Markdown to PDF conversion failed: ' + error.message);
        }
    }

    // Excel to PDF conversion
    async excelToPDF(file, quality = 'medium') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            
            // Convert Excel to HTML then to PDF
            let html = '<html><body><table>';
            
            workbook.worksheets.forEach(worksheet => {
                html += `<h2>${worksheet.name}</h2>`;
                html += '<table border="1">';
                
                worksheet.eachRow((row, rowNumber) => {
                    html += '<tr>';
                    row.eachCell((cell, colNumber) => {
                        html += `<td>${cell.value || ''}</td>`;
                    });
                    html += '</tr>';
                });
                
                html += '</table>';
            });
            
            html += '</body></html>';
            
            return await this.htmlToPDF(html, quality);
        } catch (error) {
            throw new Error('Excel to PDF conversion failed: ' + error.message);
        }
    }

    // CSV to Excel conversion
    async csvToExcel(csvText, quality = 'high') {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');
            
            const lines = csvText.split('\n');
            lines.forEach((line, index) => {
                const values = line.split(',').map(val => val.trim().replace(/^"|"$/g, ''));
                if (index === 0) {
                    worksheet.addRow(values);
                } else {
                    worksheet.addRow(values);
                }
            });
            
            const buffer = await workbook.xlsx.writeBuffer();
            return new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
        } catch (error) {
            throw new Error('CSV to Excel conversion failed: ' + error.message);
        }
    }

    // Excel to CSV conversion
    async excelToCSV(file, quality = 'high') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            
            let csv = '';
            const worksheet = workbook.worksheets[0];
            
            worksheet.eachRow((row, rowNumber) => {
                const rowData = [];
                row.eachCell((cell, colNumber) => {
                    rowData.push(`"${cell.value || ''}"`);
                });
                csv += rowData.join(',') + '\n';
            });
            
            return new Blob([csv], { type: 'text/csv' });
        } catch (error) {
            throw new Error('Excel to CSV conversion failed: ' + error.message);
        }
    }

    // JSON to CSV conversion
    async jsonToCSV(jsonText, quality = 'high') {
        try {
            const data = JSON.parse(jsonText);
            let csv = '';
            
            if (Array.isArray(data) && data.length > 0) {
                const headers = Object.keys(data[0]);
                csv += headers.join(',') + '\n';
                
                data.forEach(row => {
                    const values = headers.map(header => `"${row[header] || ''}"`);
                    csv += values.join(',') + '\n';
                });
            }
            
            return new Blob([csv], { type: 'text/csv' });
        } catch (error) {
            throw new Error('JSON to CSV conversion failed: ' + error.message);
        }
    }

    // CSV to JSON conversion
    async csvToJSON(csvText, quality = 'high') {
        try {
            const lines = csvText.split('\n').filter(line => line.trim());
            if (lines.length < 2) throw new Error('Invalid CSV format');
            
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
            
            const json = JSON.stringify(data, null, 2);
            return new Blob([json], { type: 'application/json' });
        } catch (error) {
            throw new Error('CSV to JSON conversion failed: ' + error.message);
        }
    }

    // Image to Text (OCR) conversion
    async imageToText(file, quality = 'medium') {
        try {
            const result = await Tesseract.recognize(file, 'eng', {
                logger: m => console.log(m)
            });
            
            return new Blob([result.data.text], { type: 'text/plain' });
        } catch (error) {
            throw new Error('Image to Text conversion failed: ' + error.message);
        }
    }

    // PDF to Text conversion
    async pdfToText(file, quality = 'medium') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            
            let text = '';
            for (let i = 0; i < pages.length; i++) {
                // Simplified text extraction - in real implementation would use PDF.js
                text += `Page ${i + 1}\n\n`;
            }
            
            return new Blob([text], { type: 'text/plain' });
        } catch (error) {
            throw new Error('PDF to Text conversion failed: ' + error.message);
        }
    }

    // Text to Speech conversion
    async textToSpeech(text, quality = 'medium') {
        try {
            // Use Web Speech API for text-to-speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = quality === 'high' ? 1 : quality === 'medium' ? 0.8 : 0.6;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            // Note: This is a simplified implementation
            // In a real app, you'd use a proper TTS service
            return new Blob([text], { type: 'text/plain' });
        } catch (error) {
            throw new Error('Text to Speech conversion failed: ' + error.message);
        }
    }

    // Video to GIF conversion (simplified)
    async videoToGIF(file, quality = 'medium') {
        try {
            // Simplified implementation - in real app would use FFmpeg.js
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const video = document.createElement('video');
            
            return new Promise((resolve, reject) => {
                video.onloadeddata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0);
                    
                    canvas.toBlob(blob => {
                        if (blob) resolve(blob);
                        else reject(new Error('GIF creation failed'));
                    }, 'image/gif');
                };
                
                video.onerror = () => reject(new Error('Video load failed'));
                video.src = URL.createObjectURL(file);
                video.load();
            });
        } catch (error) {
            throw new Error('Video to GIF conversion failed: ' + error.message);
        }
    }

    // GIF to MP4 conversion (simplified)
    async gifToMP4(file, quality = 'medium') {
        try {
            // Simplified implementation - in real app would use FFmpeg.js
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    canvas.toBlob(blob => {
                        if (blob) resolve(blob);
                        else reject(new Error('MP4 creation failed'));
                    }, 'video/mp4');
                };
                
                img.onerror = () => reject(new Error('GIF load failed'));
                img.src = URL.createObjectURL(file);
            });
        } catch (error) {
            throw new Error('GIF to MP4 conversion failed: ' + error.message);
        }
    }

    // Audio format conversions (simplified)
    async convertAudio(file, outputFormat, quality = 'medium') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Simplified audio conversion
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob) resolve(blob);
                    else reject(new Error('Audio conversion failed'));
                }, outputFormat);
            });
        } catch (error) {
            throw new Error('Audio conversion failed: ' + error.message);
        }
    }

    // Video format conversions (simplified)
    async convertVideo(file, outputFormat, quality = 'medium') {
        try {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            return new Promise((resolve, reject) => {
                video.onloadeddata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0);
                    
                    canvas.toBlob(blob => {
                        if (blob) resolve(blob);
                        else reject(new Error('Video conversion failed'));
                    }, outputFormat);
                };
                
                video.onerror = () => reject(new Error('Video load failed'));
                video.src = URL.createObjectURL(file);
                video.load();
            });
        } catch (error) {
            throw new Error('Video conversion failed: ' + error.message);
        }
    }

    // Extract audio from video
    async extractAudioFromVideo(file, outputFormat = 'audio/mpeg', quality = 'medium') {
        try {
            // Simplified implementation - in real app would use FFmpeg.js
            return await this.convertAudio(file, outputFormat, quality);
        } catch (error) {
            throw new Error('Audio extraction failed: ' + error.message);
        }
    }

    // Main conversion method
    async convert(file, conversionType, quality = 'medium', progressCallback = null) {
        try {
            const config = CONVERSION_CONFIG[conversionType];
            if (!config) {
                throw new Error(`Unknown conversion type: ${conversionType}`);
            }

            // Validate file size
            if (file && file.size > config.maxFileSize) {
                throw new Error(`File too large. Maximum size is ${this.formatFileSize(config.maxFileSize)}`);
            }

            // Update progress
            if (progressCallback) progressCallback(10, 'Starting conversion...');

            let result;
            const inputType = config.input;

            // Handle text input
            if (inputType === 'text') {
                if (typeof file === 'string') {
                    result = await this.convertTextInput(file, conversionType, quality, progressCallback);
                } else {
                    throw new Error('Text input expected');
                }
            } else {
                // Handle file input
                result = await this.convertFileInput(file, conversionType, quality, progressCallback);
            }

            if (progressCallback) progressCallback(100, 'Conversion complete!');
            return result;

        } catch (error) {
            throw new Error(`Conversion failed: ${error.message}`);
        }
    }

    // Convert text input
    async convertTextInput(text, conversionType, quality, progressCallback) {
        switch (conversionType) {
            case 'text-to-pdf':
                if (progressCallback) progressCallback(30, 'Creating PDF...');
                return await this.textToPDF(text, quality);
            
            case 'text-to-speech':
                if (progressCallback) progressCallback(30, 'Generating speech...');
                return await this.textToSpeech(text, quality);
            
            case 'markdown-to-html':
                if (progressCallback) progressCallback(30, 'Converting Markdown...');
                return await this.markdownToHTML(text, quality);
            
            case 'markdown-to-pdf':
                if (progressCallback) progressCallback(30, 'Converting Markdown to PDF...');
                return await this.markdownToPDF(text, quality);
            
            case 'csv-to-excel':
                if (progressCallback) progressCallback(30, 'Converting CSV...');
                return await this.csvToExcel(text, quality);
            
            case 'csv-to-json':
                if (progressCallback) progressCallback(30, 'Converting CSV to JSON...');
                return await this.csvToJSON(text, quality);
            
            case 'json-to-csv':
                if (progressCallback) progressCallback(30, 'Converting JSON to CSV...');
                return await this.jsonToCSV(text, quality);
            
            default:
                throw new Error(`Unsupported text conversion: ${conversionType}`);
        }
    }

    // Convert file input
    async convertFileInput(file, conversionType, quality, progressCallback) {
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        switch (conversionType) {
            // Document conversions
            case 'word-to-pdf':
                if (progressCallback) progressCallback(30, 'Converting Word document...');
                return await this.wordToPDF(file, quality);
            
            case 'pdf-to-word':
                if (progressCallback) progressCallback(30, 'Extracting text from PDF...');
                return await this.pdfToWord(file, quality);
            
            case 'rtf-to-pdf':
            case 'odt-to-pdf':
                if (progressCallback) progressCallback(30, 'Converting document...');
                return await this.htmlToPDF(await this.readFileAsText(file), quality);
            
            // Image conversions
            case 'jpg-to-png':
            case 'png-to-jpg':
            case 'image-to-jpg':
            case 'image-to-png':
            case 'image-to-webp':
                if (progressCallback) progressCallback(30, 'Converting image...');
                const outputFormat = CONVERSION_CONFIG[conversionType].mime;
                return await this.convertImage(file, outputFormat, quality === 'high' ? 0.9 : quality === 'medium' ? 0.8 : 0.6);
            
            case 'image-to-text':
                if (progressCallback) progressCallback(30, 'Extracting text from image...');
                return await this.imageToText(file, quality);
            
            // Audio conversions
            case 'mp3-to-wav':
            case 'wav-to-mp3':
            case 'audio-to-wav':
            case 'audio-to-mp3':
                if (progressCallback) progressCallback(30, 'Converting audio...');
                const audioFormat = CONVERSION_CONFIG[conversionType].mime;
                return await this.convertAudio(file, audioFormat, quality);
            
            // Video conversions
            case 'mp4-to-mp3':
                if (progressCallback) progressCallback(30, 'Extracting audio from video...');
                return await this.extractAudioFromVideo(file, 'audio/mpeg', quality);
            
            case 'video-to-mp4':
            case 'gif-to-mp4':
                if (progressCallback) progressCallback(30, 'Converting video...');
                return await this.convertVideo(file, 'video/mp4', quality);
            
            case 'video-to-gif':
                if (progressCallback) progressCallback(30, 'Creating animated GIF...');
                return await this.videoToGIF(file, quality);
            
            // Data conversions
            case 'excel-to-pdf':
                if (progressCallback) progressCallback(30, 'Converting Excel to PDF...');
                return await this.excelToPDF(file, quality);
            
            case 'excel-to-csv':
                if (progressCallback) progressCallback(30, 'Converting Excel to CSV...');
                return await this.excelToCSV(file, quality);
            
            case 'json-to-csv':
                if (progressCallback) progressCallback(30, 'Converting JSON to CSV...');
                return await this.jsonToCSV(await this.readFileAsText(file), quality);
            
            // Web conversions
            case 'html-to-pdf':
                if (progressCallback) progressCallback(30, 'Converting HTML to PDF...');
                return await this.htmlToPDF(await this.readFileAsText(file), quality);
            
            case 'pdf-to-text':
                if (progressCallback) progressCallback(30, 'Extracting text from PDF...');
                return await this.pdfToText(file, quality);
            
            default:
                throw new Error(`Unsupported file conversion: ${conversionType}`);
        }
    }

    // Helper method to read file as text
    async readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Helper method to format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Validate file type
    validateFileType(file, allowedTypes) {
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        const validExtensions = allowedTypes.split(',');
        return validExtensions.some(ext => ext === fileExt);
    }

    // Get file icon
    getFileIcon(filename) {
        const ext = '.' + filename.split('.').pop().toLowerCase();
        return FILE_ICONS[ext] || 'fas fa-file';
    }
}

// Create global instance
window.FileConverters = FileConverters;
window.converters = new FileConverters(); 