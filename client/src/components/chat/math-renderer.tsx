import { useEffect, useRef, useState } from "react";

interface MathRendererProps {
  content: string;
}

export function MathRenderer({ content }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [katexLoaded, setKatexLoaded] = useState(false);

  useEffect(() => {
    // Load KaTeX if not already loaded
    if (typeof window !== 'undefined' && !window.katex) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      script.onload = () => {
        const autoRenderScript = document.createElement('script');
        autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
        autoRenderScript.onload = () => {
          setKatexLoaded(true);
        };
        document.head.appendChild(autoRenderScript);
      };
      document.head.appendChild(script);
    } else if (window.renderMathInElement) {
      setKatexLoaded(true);
    }
  }, []);

  // Render math after content or KaTeX loads
  useEffect(() => {
    if (katexLoaded && containerRef.current && window.renderMathInElement) {
      // Multiple rendering attempts to ensure all math is caught
      const renderMath = () => {
        if (containerRef.current) {
          window.renderMathInElement(containerRef.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false },
            ],
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            throwOnError: false
          });
        }
      };

      // Immediate render
      setTimeout(renderMath, 100);
      // Secondary render to catch any missed expressions
      setTimeout(renderMath, 500);
      // Final render to ensure everything is processed
      setTimeout(renderMath, 1000);
    }
  }, [katexLoaded, content]);

  // Process content to detect and format steps with proper HTML for KaTeX
  const processContentToHTML = (text: string) => {
    const lines = text.split('\n');
    let stepNumber = 1;
    let html = '';

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        html += '<br />';
        return;
      }
      
      // Detect step patterns (markdown headers like ## Step 1:)
      if (trimmedLine.startsWith('##') && (trimmedLine.includes('Step') || /\d+/.test(trimmedLine))) {
        const stepText = trimmedLine.replace(/^##\s*/, '').replace(/^(Step \d+|^\d+\.|\d+\)):?\s*/i, '').trim();
        html += `
          <div class="flex items-start space-x-3 my-4">
            <span class="step-number w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              ${stepNumber}
            </span>
            <div class="flex-1">
              <h3 class="text-sm font-medium text-foreground">${stepText}</h3>
            </div>
          </div>
        `;
        stepNumber++;
      } else if (trimmedLine.toLowerCase().includes('answer') || trimmedLine.toLowerCase().includes('solution')) {
        // Highlight final answers
        html += `
          <div class="bg-secondary/10 rounded-lg p-3 border border-secondary/20 my-3">
            <p class="text-sm font-medium text-foreground">${trimmedLine}</p>
          </div>
        `;
      } else {
        // Regular content - preserve LaTeX formatting
        html += `<p class="text-sm text-foreground my-1">${trimmedLine}</p>`;
      }
    });

    return html;
  };

  return (
    <div 
      ref={containerRef} 
      data-testid="math-content"
      dangerouslySetInnerHTML={{ __html: processContentToHTML(content) }}
    />
  );
}

// Extend Window interface for KaTeX
declare global {
  interface Window {
    katex: any;
    renderMathInElement: any;
  }
}
