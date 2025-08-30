import React, { useState, useCallback } from 'react';
import { Upload, File, Download, FileText, RotateCcw, Eye, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { createWorker } from 'tesseract.js';

interface ConvertedFile {
  name: string;
  originalType: string;
  content: string;
  isImage: boolean;
  imageUrl: string;
}

export function FileConverter() {
  const [isDragging, setIsDragging] = useState(false);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);

  const supportedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
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

  const processImageWithOCR = async (file: File): Promise<string> => {
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        setProcessingStatus(m.status);
        if (m.progress) {
          setProcessingProgress(Math.round(m.progress * 100));
        }
      },
    });

    try {
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      return text;
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  };



  const processFile = async (file: File) => {
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
          const extractedText = await processImageWithOCR(file);
          const processedContent = extractedText.trim() || 'No text detected in the image.';
          
          setConvertedFile({
            name: file.name,
            originalType: file.type || 'unknown',
            content: processedContent,
            isImage: true,
            imageUrl
          });
          
          toast.success(`Successfully extracted text from ${file.name}`);
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
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

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
                </div>

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
                <div className="flex space-x-2">
                  <Badge variant="outline">{convertedFile.originalType}</Badge>
                  <Badge variant="outline">→</Badge>
                  <Badge>text</Badge>
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
    </div>
  );
}