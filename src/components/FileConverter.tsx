import React, { useState, useCallback } from 'react';
import { Upload, File, Download, FileText, RotateCcw, Eye, Image, Settings, Sliders, Globe, FileImage, Palette, Cog } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import { createWorker, PSM } from 'tesseract.js';

interface ConvertedFile {
  name: string;
  originalType: string;
  content: string;
  isImage: boolean;
  imageUrl: string;
  confidence?: number;
  processingTime?: number;
}

interface OCRSettings {
  language: string;
  pageSegMode: number;
  enablePreprocessing: boolean;
  contrastBoost: number;
  blacklistChars: string;
  whitelistChars: string;
}

interface SupportedLanguage {
  code: string;
  name: string;
  script: string;
}

export function FileConverter() {
  const [isDragging, setIsDragging] = useState(false);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const [ocrSettings, setOCRSettings] = useState<OCRSettings>({
    language: 'eng+spa+fra+deu+ita',
    pageSegMode: PSM.AUTO,
    enablePreprocessing: true,
    contrastBoost: 1.2,
    blacklistChars: '',
    whitelistChars: ''
  });

  const supportedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
  ];

  const supportedLanguages: SupportedLanguage[] = [
    { code: 'eng', name: 'English', script: 'Latin' },
    { code: 'spa', name: 'Spanish', script: 'Latin' },
    { code: 'fra', name: 'French', script: 'Latin' },
    { code: 'deu', name: 'German', script: 'Latin' },
    { code: 'ita', name: 'Italian', script: 'Latin' },
    { code: 'por', name: 'Portuguese', script: 'Latin' },
    { code: 'rus', name: 'Russian', script: 'Cyrillic' },
    { code: 'ara', name: 'Arabic', script: 'Arabic' },
    { code: 'chi_sim', name: 'Chinese (Simplified)', script: 'Han' },
    { code: 'chi_tra', name: 'Chinese (Traditional)', script: 'Han' },
    { code: 'jpn', name: 'Japanese', script: 'Japanese' },
    { code: 'kor', name: 'Korean', script: 'Hangul' },
    { code: 'hin', name: 'Hindi', script: 'Devanagari' },
    { code: 'khm', name: 'Khmer', script: 'Khmer' },
    { code: 'tha', name: 'Thai', script: 'Thai' },
    { code: 'vie', name: 'Vietnamese', script: 'Latin' },
    { code: 'nld', name: 'Dutch', script: 'Latin' },
    { code: 'pol', name: 'Polish', script: 'Latin' },
    { code: 'tur', name: 'Turkish', script: 'Latin' },
    { code: 'heb', name: 'Hebrew', script: 'Hebrew' },
    { code: 'swe', name: 'Swedish', script: 'Latin' },
    { code: 'dan', name: 'Danish', script: 'Latin' },
    { code: 'nor', name: 'Norwegian', script: 'Latin' },
    { code: 'fin', name: 'Finnish', script: 'Latin' },
    { code: 'hun', name: 'Hungarian', script: 'Latin' },
    { code: 'ces', name: 'Czech', script: 'Latin' },
    { code: 'eng+spa+fra+deu+ita', name: 'Multi-language (Recommended)', script: 'Latin' },
    { code: 'eng+spa+fra+deu+ita+por+rus+ara+chi_sim+chi_tra+jpn+kor+hin+khm+tha+vie+nld+pol+tur+heb+swe+dan+nor+fin+hun+ces', name: 'All Supported Languages (Auto-detect)', script: 'Universal' }
  ];

  const pageSegmentationModes = [
    { value: PSM.AUTO, label: 'Auto (Recommended)' },
    { value: PSM.SINGLE_BLOCK, label: 'Single Block' },
    { value: PSM.SINGLE_COLUMN, label: 'Single Column' },
    { value: PSM.SINGLE_WORD, label: 'Single Word' },
    { value: PSM.SINGLE_LINE, label: 'Single Line' },
    { value: PSM.SINGLE_CHAR, label: 'Single Character' },
    { value: PSM.SPARSE_TEXT, label: 'Sparse Text' },
    { value: PSM.SPARSE_TEXT_OSD, label: 'Sparse Text + OSD' }
  ];

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const preprocessImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Apply preprocessing filters
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Contrast enhancement
        const contrast = ocrSettings.contrastBoost;
        const factor = (259 * (contrast * 100 + 255)) / (255 * (259 - contrast * 100));
        
        for (let i = 0; i < data.length; i += 4) {
          // Apply contrast
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));     // Red
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // Green
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // Blue
          
          // Convert to grayscale for better OCR
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob(resolve, 'image/png', 1.0);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageWithOCR = async (file: File): Promise<{ text: string; confidence: number; processingTime: number }> => {
    const startTime = Date.now();
    
    const selectedLanguage = supportedLanguages.find(lang => lang.code === ocrSettings.language);
    setProcessingStatus(`Initializing OCR worker for ${selectedLanguage?.name || ocrSettings.language}...`);
    const worker = await createWorker(ocrSettings.language, 1, {
      logger: (m) => {
        setProcessingStatus(m.status || 'Processing...');
        if (m.progress) {
          setProcessingProgress(Math.round(m.progress * 100));
        }
      },
      corePath: 'https://unpkg.com/tesseract.js-core@5.0.0/tesseract-core-simd.wasm.js',
      workerPath: 'https://unpkg.com/tesseract.js@5/dist/worker.min.js',
    });

    try {
      // Configure OCR parameters for maximum accuracy
      await worker.setParameters({
        tessedit_pageseg_mode: ocrSettings.pageSegMode.toString(),
        preserve_interword_spaces: '1',
        tessedit_char_blacklist: ocrSettings.blacklistChars,
        tessedit_char_whitelist: ocrSettings.whitelistChars,
        load_system_dawg: '0',
        load_freq_dawg: '0',
        load_unambig_dawg: '0',
        load_punc_dawg: '0',
        load_number_dawg: '0',
        load_bigram_dawg: '0',
        wordrec_enable_assoc: '0',
        classify_enable_learning: '0',
        classify_enable_adaptive_matcher: '0',
        textord_really_old_xheight: '1',
        textord_min_linesize: '2.5',
        edges_use_new_outline_complexity: '0',
        segment_penalty_dict_nonword: '16',
        segment_penalty_garbage: '16'
      });

      setProcessingStatus('Preprocessing image...');
      let imageToProcess: File | string = file;
      
      if (ocrSettings.enablePreprocessing) {
        try {
          const preprocessedBlob = await preprocessImage(file);
          if (preprocessedBlob) {
            imageToProcess = new File([preprocessedBlob], file.name, { type: 'image/png' });
          }
        } catch (preprocessError) {
          console.warn('Preprocessing failed, using original image:', preprocessError);
        }
      }

      setProcessingStatus('Recognizing text...');
      const result = await worker.recognize(imageToProcess);
      
      await worker.terminate();
      
      const processingTime = Date.now() - startTime;
      const confidence = result.data.confidence || 0;
      
      // Post-process text for better quality
      let text = result.data.text;
      
      // Remove excessive whitespace
      text = text.replace(/\s+/g, ' ');
      // Fix common OCR errors
      text = text.replace(/[|]/g, 'I');
      text = text.replace(/(?<=\w)0(?=\w)/g, 'O');
      text = text.replace(/(?<=\w)5(?=\w)/g, 'S');
      
      return { text: text.trim(), confidence, processingTime };
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  };



  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus('');
    
    try {
      if (!supportedTypes.includes(file.type)) {
        toast.error(`File type ${file.type || 'unknown'} is not supported. Please upload an image file (PNG, JPG, GIF, BMP, TIFF, WebP).`);
        setIsProcessing(false);
        return;
      }

      if (isImageFile(file.type)) {
        // Process image with OCR
        setProcessingStatus('Initializing OCR...');
        const imageUrl = URL.createObjectURL(file);
        
        try {
          const { text, confidence, processingTime } = await processImageWithOCR(file);
          const processedContent = text || 'No text detected in the image.';
          
          setConvertedFile({
            name: file.name,
            originalType: file.type || 'unknown',
            content: processedContent,
            isImage: true,
            imageUrl,
            confidence,
            processingTime
          });
          
          const confidencePercent = Math.round(confidence);
          const timeSeconds = (processingTime / 1000).toFixed(1);
          toast.success(`Text extracted successfully! Confidence: ${confidencePercent}% (${timeSeconds}s)`);
        } catch (ocrError) {
          console.error('OCR processing error:', ocrError);
          toast.error('Failed to extract text from image. Please try with a clearer image.');
          URL.revokeObjectURL(imageUrl);
          return;
        }
      }
    } catch (error) {
      toast.error('Failed to process file');
      console.error('File processing error:', error);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStatus('');
    }
  }, [ocrSettings, supportedTypes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [ocrSettings]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [ocrSettings]);

  const downloadFile = () => {
    if (!convertedFile) return;

    const fileName = convertedFile.name.replace(/\.[^/.]+$/, '') + '_extracted.txt';
    
    const blob = new Blob([convertedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${fileName}`);
  };

  const resetConverter = () => {
    if (convertedFile?.imageUrl) {
      URL.revokeObjectURL(convertedFile.imageUrl);
    }
    setConvertedFile(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingStatus('');
    setShowImagePreview(false);
  };

  return (
    <div className="space-y-6">
      {!convertedFile ? (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="p-8">
            <div
              className={`relative transition-colors ${
                isDragging ? 'bg-muted/50' : 'bg-background'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <h3>Drop your file here</h3>
                  <p className="text-muted-foreground">
                    Or click to browse image files
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5">
                    <Image className="w-3 h-3 mr-1" />
                    PNG, JPG, GIF, BMP, TIFF, WebP
                  </Badge>
                  {ocrSettings.language && (
                    <>
                      <Badge variant="secondary" className="border-blue-200 bg-blue-50">
                        <Globe className="w-3 h-3 mr-1" />
                        {supportedLanguages.find(lang => lang.code === ocrSettings.language)?.name || ocrSettings.language}
                      </Badge>
                      <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                        {supportedLanguages.find(lang => lang.code === ocrSettings.language)?.script || 'Script'}
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                  <Button 
                    variant="outline" 
                    className="relative overflow-hidden"
                    disabled={isProcessing}
                  >
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileSelect}
                      accept=".png,.jpg,.jpeg,.gif,.bmp,.tiff,.webp"
                    />
                    <File className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>{processingStatus || 'Processing file...'}</span>
                    </div>
                    {processingProgress > 0 && (
                      <div className="space-y-1">
                        <Progress value={processingProgress} className="w-full" />
                        <p className="text-center text-xs text-muted-foreground">
                          {processingProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center space-x-2">
                  <Image className="w-5 h-5" />
                  <span>{convertedFile.name}</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{convertedFile.originalType}</Badge>
                  <Badge variant="outline">→</Badge>
                  <Badge>text</Badge>
                  {convertedFile.confidence !== undefined && (
                    <Badge variant={convertedFile.confidence > 80 ? "default" : convertedFile.confidence > 60 ? "secondary" : "destructive"}>
                      {Math.round(convertedFile.confidence)}% confidence
                    </Badge>
                  )}
                  {convertedFile.processingTime !== undefined && (
                    <Badge variant="outline">
                      {(convertedFile.processingTime / 1000).toFixed(1)}s
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowImagePreview(!showImagePreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showImagePreview ? 'Hide' : 'View'} Image
                </Button>
                <Button variant="outline" size="sm" onClick={resetConverter}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New File
                </Button>
                <Button size="sm" onClick={downloadFile}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showImagePreview && convertedFile.imageUrl && (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h4 className="mb-3 flex items-center">
                    <Image className="w-4 h-4 mr-2" />
                    Original Image
                  </h4>
                  <div className="max-w-full max-h-96 overflow-hidden rounded border">
                    <img 
                      src={convertedFile.imageUrl} 
                      alt="Original uploaded image"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
              <Textarea
                value={convertedFile.content}
                readOnly
                className="min-h-96 font-mono resize-none"
                placeholder="Converted content will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Settings */}
      {showAdvancedSettings && (
        <Card className="bg-background">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Settings className="w-5 h-5 text-primary" />
                <span>Advanced Settings</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedSettings(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Fine-tune OCR parameters for optimal text extraction accuracy
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main Settings Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language-select" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language
                </Label>
                <Select
                  value={ocrSettings.language}
                  onValueChange={(value) => setOCRSettings({...ocrSettings, language: value})}
                >
                  <SelectTrigger id="language-select" className="h-10">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex justify-between items-center w-full">
                          <span className="pr-2">{lang.name}</span> 
                          <Badge variant="outline" className="ml-2 text-xs">
                            {lang.script}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page Segmentation Mode */}
              <div className="space-y-2">
                <Label htmlFor="psm-select" className="text-sm font-medium flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Page Mode
                </Label>
                <Select
                  value={ocrSettings.pageSegMode.toString()}
                  onValueChange={(value) => setOCRSettings({...ocrSettings, pageSegMode: parseInt(value)})}
                >
                  <SelectTrigger id="psm-select" className="h-10">
                    <SelectValue placeholder="Select PSM" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSegmentationModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value.toString()}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preprocessing Toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Preprocessing
                </Label>
                <div className="flex items-center space-x-4 h-10 px-3 bg-background">
                  <Switch
                    id="preprocessing"
                    checked={ocrSettings.enablePreprocessing}
                    onCheckedChange={(checked) => setOCRSettings({...ocrSettings, enablePreprocessing: checked})}
                  />
                  <Label htmlFor="preprocessing" className="text-sm cursor-pointer">
                    Enable Enhancement
                  </Label>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Cog className="w-4 h-4" />
                Advanced Options
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Contrast Boost */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Contrast: {ocrSettings.contrastBoost.toFixed(1)}x
                  </Label>
                  <Slider
                    value={[ocrSettings.contrastBoost]}
                    onValueChange={([value]) => setOCRSettings({...ocrSettings, contrastBoost: value})}
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Character Blacklist */}
                <div className="space-y-2">
                  <Label htmlFor="blacklist" className="text-sm font-medium">
                    Blacklist Chars
                  </Label>
                  <input
                    id="blacklist"
                    type="text"
                    value={ocrSettings.blacklistChars}
                    onChange={(e) => setOCRSettings({...ocrSettings, blacklistChars: e.target.value})}
                    placeholder="e.g., ~`!@#$%^&*"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                </div>

                {/* Character Whitelist */}
                <div className="space-y-2">
                  <Label htmlFor="whitelist" className="text-sm font-medium">
                    Whitelist Chars
                  </Label>
                  <input
                    id="whitelist"
                    type="text"
                    value={ocrSettings.whitelistChars}
                    onChange={(e) => setOCRSettings({...ocrSettings, whitelistChars: e.target.value})}
                    placeholder="Leave empty for all"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-muted/30 rounded-lg p-3 border">
              <div className="text-xs text-muted-foreground mb-1">Current Configuration:</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {supportedLanguages.find(l => l.code === ocrSettings.language)?.name || 'Unknown'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {pageSegmentationModes.find(m => m.value === ocrSettings.pageSegMode)?.label || 'Auto'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {ocrSettings.enablePreprocessing ? 'Enhanced' : 'Standard'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {ocrSettings.contrastBoost.toFixed(1)}x Contrast
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}