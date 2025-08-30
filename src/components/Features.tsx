import React from 'react';
import { Upload, Languages, Download, Zap, Shield, Scan, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const features = [
  {
    icon: Upload,
    title: 'Drag & Drop',
    description: 'Simply drag and drop your image files for instant OCR processing.'
  },
  {
    icon: Scan,
    title: 'Advanced OCR',
    description: 'Extract text from images using state-of-the-art OCR powered by Tesseract.js.'
  },
  {
    icon: Image,
    title: 'Multiple Formats',
    description: 'Support for all major image formats: PNG, JPG, GIF, BMP, TIFF, WebP with image preview capabilities.'
  },
  {
    icon: Languages,
    title: 'Multi-Language',
    description: 'Recognize text in multiple languages including English, with high accuracy text detection.'
  },
  {
    icon: Download,
    title: 'Clean Text Output',
    description: 'Download your extracted text as clean, formatted plain text files with original filenames preserved.'
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Watch progress in real-time with detailed status updates and percentage completion indicators.'
  },
  {
    icon: Shield,
    title: 'Complete Privacy',
    description: 'All OCR processing happens locally in your browser. Your images never leave your device.'
  }
];

export function Features() {
  return (
    <section className="py-12">
      <div className="text-center space-y-4 mb-12">
        <h2>Why choose anytext?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Extract text from images quickly and accurately with our powerful OCR technology, completely private and secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border border-border/50 hover:border-border transition-colors">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}