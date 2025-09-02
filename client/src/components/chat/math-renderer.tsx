import { useEffect, useRef } from "react";

interface MathRendererProps {
  content: string;
}

export function MathRenderer({ content }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load KaTeX if not already loaded
    if (!window.katex && !document.querySelector('link[href*="katex"]')) {
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
          // Set content first, then render math
          if (containerRef.current) {
            containerRef.current.innerHTML = processContentToHTML(content);
            renderMath();
          }
        };
        document.head.appendChild(autoRenderScript);
      };
      document.head.appendChild(script);
    } else if (window.renderMathInElement) {
      // Set content first, then render math
      if (containerRef.current) {
        containerRef.current.innerHTML = processContentToHTML(content);
        renderMath();
      }
    }
  }, [content]);

  const renderMath = () => {
    if (containerRef.current && window.renderMathInElement) {
      window.renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
        ],
      });
    }
  };

  // Process content to HTML while preserving LaTeX for KaTeX rendering
  const processContentToHTML = (text: string): string => {
    const lines = text.split('\n');
    let htmlContent = '';
    let stepNumber = 1;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        htmlContent += '<br>';
        return;
      }
      
      // Detect step patterns (markdown headers like ## Step 1:)
      if (trimmedLine.startsWith('##') && (trimmedLine.includes('Step') || /\d+/.test(trimmedLine))) {
        const stepText = trimmedLine.replace(/^##\s*/, '').replace(/^(Step \d+|^\d+\.|\d+\)):?\s*/i, '').trim();
        htmlContent += `
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
        htmlContent += `<div class="bg-secondary/10 rounded-lg p-3 border border-secondary/20 my-3"><p class="text-sm font-medium text-foreground">${trimmedLine}</p></div>`;
      } else {
        // Regular content - preserve LaTeX formatting
        htmlContent += `<p class="text-sm text-foreground my-1">${trimmedLine}</p>`;
      }
    });

    return htmlContent;
  };

  return (
    <div ref={containerRef} data-testid="math-content">
      {/* Content will be set via innerHTML to preserve LaTeX for KaTeX rendering */}
    </div>
  );
}

// Extend Window interface for KaTeX
declare global {
  interface Window {
    katex: any;
    renderMathInElement: any;
  }
}
