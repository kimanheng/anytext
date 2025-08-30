import React from 'react';
import { Github } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/favicon.png" 
                alt="anytext - OCR Tool Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <h1 className="text-xl font-semibold">anytext</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">Beta</Badge>
              </div>
            </div>
            <p className="text-muted-foreground hidden sm:block">
              Extract text from images with OCR
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <a 
                href="https://github.com/kimanheng/anytext" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}