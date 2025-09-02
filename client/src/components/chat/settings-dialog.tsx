import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Moon, Sun, Volume2, Type, Zap, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState([16]);
  const [responseSpeed, setResponseSpeed] = useState([1]);
  const [mathNotation, setMathNotation] = useState("latex");
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or user preferences API
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    setOpen(false);
  };

  const handleResetSettings = () => {
    setDarkMode(false);
    setSoundEnabled(true);
    setFontSize([16]);
    setResponseSpeed([1]);
    setMathNotation("latex");
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>App Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Appearance Settings */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4" />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  data-testid="switch-dark-mode"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <Label>Font Size: {fontSize[0]}px</Label>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  data-testid="slider-font-size"
                />
              </div>
            </div>
          </Card>

          {/* AI Settings */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-medium">AI Behavior</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Math Notation Style</Label>
                <Select value={mathNotation} onValueChange={setMathNotation}>
                  <SelectTrigger data-testid="select-math-notation">
                    <SelectValue placeholder="Select notation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latex">LaTeX (Recommended)</SelectItem>
                    <SelectItem value="unicode">Unicode Symbols</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Response Speed: {responseSpeed[0] === 0.5 ? 'Slow' : responseSpeed[0] === 1 ? 'Normal' : 'Fast'}</Label>
                <Slider
                  value={responseSpeed}
                  onValueChange={setResponseSpeed}
                  max={2}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                  data-testid="slider-response-speed"
                />
              </div>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Volume2 className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Audio</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-notifications">Sound Notifications</Label>
              <Switch
                id="sound-notifications"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                data-testid="switch-sound-notifications"
              />
            </div>
          </Card>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            data-testid="button-reset-settings"
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings}
            data-testid="button-save-settings"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}