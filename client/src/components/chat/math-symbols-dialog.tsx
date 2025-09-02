import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquareRadical, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MathSymbolsDialogProps {
  onInsertSymbol: (symbol: string) => void;
  children: React.ReactNode;
}

interface MathSymbol {
  symbol: string;
  latex: string;
  description: string;
}

const mathCategories = {
  basic: [
    { symbol: "±", latex: "\\pm", description: "Plus or minus" },
    { symbol: "∞", latex: "\\infty", description: "Infinity" },
    { symbol: "≈", latex: "\\approx", description: "Approximately equal" },
    { symbol: "≠", latex: "\\neq", description: "Not equal" },
    { symbol: "≤", latex: "\\leq", description: "Less than or equal" },
    { symbol: "≥", latex: "\\geq", description: "Greater than or equal" },
    { symbol: "∝", latex: "\\propto", description: "Proportional to" },
    { symbol: "∴", latex: "\\therefore", description: "Therefore" },
  ],
  algebra: [
    { symbol: "√", latex: "\\sqrt{}", description: "Square root" },
    { symbol: "∛", latex: "\\sqrt[3]{}", description: "Cube root" },
    { symbol: "x²", latex: "x^2", description: "Squared" },
    { symbol: "x³", latex: "x^3", description: "Cubed" },
    { symbol: "xⁿ", latex: "x^n", description: "Power of n" },
    { symbol: "log", latex: "\\log", description: "Logarithm" },
    { symbol: "ln", latex: "\\ln", description: "Natural logarithm" },
    { symbol: "∑", latex: "\\sum", description: "Summation" },
  ],
  calculus: [
    { symbol: "∫", latex: "\\int", description: "Integral" },
    { symbol: "∮", latex: "\\oint", description: "Line integral" },
    { symbol: "∂", latex: "\\partial", description: "Partial derivative" },
    { symbol: "∇", latex: "\\nabla", description: "Del/nabla operator" },
    { symbol: "Δ", latex: "\\Delta", description: "Delta (change)" },
    { symbol: "δ", latex: "\\delta", description: "Small delta" },
    { symbol: "→", latex: "\\to", description: "Approaches/tends to" },
    { symbol: "lim", latex: "\\lim", description: "Limit" },
  ],
  greek: [
    { symbol: "α", latex: "\\alpha", description: "Alpha" },
    { symbol: "β", latex: "\\beta", description: "Beta" },
    { symbol: "γ", latex: "\\gamma", description: "Gamma" },
    { symbol: "δ", latex: "\\delta", description: "Delta" },
    { symbol: "ε", latex: "\\epsilon", description: "Epsilon" },
    { symbol: "θ", latex: "\\theta", description: "Theta" },
    { symbol: "λ", latex: "\\lambda", description: "Lambda" },
    { symbol: "μ", latex: "\\mu", description: "Mu" },
    { symbol: "π", latex: "\\pi", description: "Pi" },
    { symbol: "σ", latex: "\\sigma", description: "Sigma" },
    { symbol: "τ", latex: "\\tau", description: "Tau" },
    { symbol: "φ", latex: "\\phi", description: "Phi" },
    { symbol: "ω", latex: "\\omega", description: "Omega" },
  ],
  fractions: [
    { symbol: "½", latex: "\\frac{1}{2}", description: "One half" },
    { symbol: "⅓", latex: "\\frac{1}{3}", description: "One third" },
    { symbol: "¼", latex: "\\frac{1}{4}", description: "One quarter" },
    { symbol: "²⁄₃", latex: "\\frac{2}{3}", description: "Two thirds" },
    { symbol: "³⁄₄", latex: "\\frac{3}{4}", description: "Three quarters" },
    { symbol: "x/y", latex: "\\frac{x}{y}", description: "General fraction" },
  ]
};

export function MathSymbolsDialog({ onInsertSymbol, children }: MathSymbolsDialogProps) {
  const [open, setOpen] = useState(false);
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSymbolClick = (symbol: MathSymbol) => {
    onInsertSymbol(symbol.latex);
    setCopiedSymbol(symbol.latex);
    
    toast({
      title: "Symbol inserted",
      description: `Added ${symbol.description}: ${symbol.latex}`,
    });

    // Clear the copied state after a short delay
    setTimeout(() => setCopiedSymbol(null), 1000);
  };

  const SymbolCard = ({ symbol }: { symbol: MathSymbol }) => (
    <Card 
      className="p-3 hover:bg-muted/50 cursor-pointer transition-colors hover-lift"
      onClick={() => handleSymbolClick(symbol)}
      data-testid={`symbol-${symbol.latex.replace(/[\\{}]/g, '')}`}
    >
      <div className="text-center">
        <div className="text-2xl font-mono mb-1 text-primary">{symbol.symbol}</div>
        <div className="text-xs text-muted-foreground mb-1">{symbol.description}</div>
        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
          {symbol.latex}
          {copiedSymbol === symbol.latex && (
            <Check className="w-3 h-3 inline ml-1 text-green-500" />
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <SquareRadical className="w-5 h-5 text-primary" />
            <span>Mathematical Symbols & LaTeX</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="algebra">Algebra</TabsTrigger>
            <TabsTrigger value="calculus">Calculus</TabsTrigger>
            <TabsTrigger value="greek">Greek</TabsTrigger>
            <TabsTrigger value="fractions">Fractions</TabsTrigger>
          </TabsList>
          
          {Object.entries(mathCategories).map(([category, symbols]) => (
            <TabsContent key={category} value={category} className="mt-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {symbols.map((symbol, index) => (
                  <SymbolCard key={index} symbol={symbol} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="font-medium mb-1">💡 Quick Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Click any symbol to insert its LaTeX code into your message</li>
            <li>• Use $ for inline math: $x^2$ becomes x²</li>
            <li>• Use $$ for display math: $$\frac{'{a}'}{'{b}'}$$ becomes centered fractions</li>
            <li>• Combine symbols: $\int_0^1 x^2 dx$ for advanced expressions</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}