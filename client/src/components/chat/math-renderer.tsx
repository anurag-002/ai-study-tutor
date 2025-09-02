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

  useEffect(() => {
    if (katexLoaded && containerRef.current && window.renderMathInElement) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
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
      }, 100);
    }
  }, [katexLoaded, content]);

  // Process content to detect and format steps
  const processContent = (text: string) => {
    const lines = text.split('\n');
    const processedLines: JSX.Element[] = [];
    let stepNumber = 1;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        processedLines.push(<br key={index} />);
        return;
      }
      
      // Detect step patterns (markdown headers like ## Step 1:)
      if (trimmedLine.startsWith('##') && (trimmedLine.includes('Step') || /\d+/.test(trimmedLine))) {
        const stepText = trimmedLine.replace(/^##\s*/, '').replace(/^(Step \d+|^\d+\.|\d+\)):?\s*/i, '').trim();
        processedLines.push(
          <div key={index} className="flex items-start space-x-3 my-4">
            <span className="step-number w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              {stepNumber}
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">{stepText}</h3>
            </div>
          </div>
        );
        stepNumber++;
      } else if (trimmedLine.toLowerCase().includes('answer') || trimmedLine.toLowerCase().includes('solution')) {
        // Highlight final answers
        processedLines.push(
          <div key={index} className="bg-secondary/10 rounded-lg p-3 border border-secondary/20 my-3">
            <p className="text-sm font-medium text-foreground">{trimmedLine}</p>
          </div>
        );
      } else {
        // Regular content - preserve LaTeX formatting
        processedLines.push(
          <p key={index} className="text-sm text-foreground my-1">{trimmedLine}</p>
        );
      }
    });

    return processedLines;
  };

  return (
    <div ref={containerRef} data-testid="math-content">
      {processContent(content)}
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
