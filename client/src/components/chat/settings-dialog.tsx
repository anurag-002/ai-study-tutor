import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Moon, Sun, Volume2, Type, Zap, Palette, Eye, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    setOpen(false);
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    });
  };

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
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
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                  data-testid="switch-dark-mode"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <Label>Font Size: {settings.fontSize}px</Label>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  data-testid="slider-font-size"
                />
                <div className="text-xs text-muted-foreground">
                  Preview: <span style={{ fontSize: `${settings.fontSize}px` }}>This is how text will look</span>
                </div>
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
                <Select 
                  value={settings.mathNotation} 
                  onValueChange={(value) => updateSettings({ mathNotation: value })}
                >
                  <SelectTrigger data-testid="select-math-notation">
                    <SelectValue placeholder="Select notation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latex">LaTeX (Recommended)</SelectItem>
                    <SelectItem value="unicode">Unicode Symbols</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">
                  LaTeX renders beautiful mathematical expressions like integration symbols and fractions
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Response Speed: {
                  settings.responseSpeed === 0.5 ? 'Thoughtful' : 
                  settings.responseSpeed === 1 ? 'Balanced' : 
                  'Quick'
                }</Label>
                <Slider
                  value={[settings.responseSpeed]}
                  onValueChange={(value) => updateSettings({ responseSpeed: value[0] })}
                  max={2}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                  data-testid="slider-response-speed"
                />
                <div className="text-xs text-muted-foreground">
                  Controls how much time the AI takes to think through problems
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <Label htmlFor="step-numbers">Show Step Numbers</Label>
                </div>
                <Switch
                  id="step-numbers"
                  checked={settings.showStepNumbers}
                  onCheckedChange={(checked) => updateSettings({ showStepNumbers: checked })}
                  data-testid="switch-step-numbers"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <Label htmlFor="auto-scroll">Auto-scroll to New Messages</Label>
                </div>
                <Switch
                  id="auto-scroll"
                  checked={settings.autoScroll}
                  onCheckedChange={(checked) => updateSettings({ autoScroll: checked })}
                  data-testid="switch-auto-scroll"
                />
              </div>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Volume2 className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Audio & Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-notifications">Sound Notifications</Label>
                <Switch
                  id="sound-notifications"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                  data-testid="switch-sound-notifications"
                />
              </div>
              
              {settings.soundEnabled && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={playNotificationSound}
                    data-testid="button-test-sound"
                  >
                    🔊 Test Sound
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll hear a gentle chime when the AI finishes responding
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Live Settings Preview */}
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center">
              <h4 className="font-medium mb-2">Settings Preview</h4>
              <div 
                className="text-sm p-3 rounded-lg bg-background border"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <p className="mb-2">
                  This is how your chat will look with current settings.
                </p>
                {settings.mathNotation === 'latex' && (
                  <p className="text-primary">
                    Math: $x^2 + 2x + 1 = (x+1)^2$
                  </p>
                )}
                {settings.mathNotation === 'unicode' && (
                  <p className="text-primary">
                    Math: x² + 2x + 1 = (x+1)²
                  </p>
                )}
                {settings.mathNotation === 'text' && (
                  <p className="text-primary">
                    Math: x^2 + 2x + 1 = (x+1)^2
                  </p>
                )}
              </div>
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