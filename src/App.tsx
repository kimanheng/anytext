import React from 'react';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { FileConverter } from './components/FileConverter';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-6xl tracking-tight">
                Extract text from <span className="text-primary">any image</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Convert images to clean, readable text using advanced OCR technology. 
                Fast, accurate, and completely private - all processing happens in your browser.
              </p>
            </div>

            <FileConverter />
            
            <Features />
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}