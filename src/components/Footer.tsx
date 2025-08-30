import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for better file conversion</span>
          </div>
          
          <div className="flex items-center space-x-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/50 text-center text-muted-foreground">
          <p>&copy; 2025 anytext. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}