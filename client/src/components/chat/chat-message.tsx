import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, User, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MathRenderer } from "./math-renderer";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const timestamp = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied!",
        description: "Solution copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end fade-in" data-testid={`message-user-${message.id}`}>
        <div className="max-w-xs sm:max-w-md lg:max-w-lg">
          <div className="chat-bubble-user rounded-2xl px-4 py-3 shadow-sm">
            <MathRenderer content={message.content} />
            {message.imageUrl && (
              <img 
                src={message.imageUrl} 
                alt="Problem image" 
                className="mt-3 rounded-lg w-full h-auto max-w-sm border"
                data-testid="img-user-upload"
              />
            )}
          </div>
          <div className="flex items-center justify-end mt-1 space-x-2">
            <span className="text-xs text-muted-foreground" data-testid="text-timestamp">{timestamp}</span>
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <User className="text-primary-foreground text-xs" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start fade-in" data-testid={`message-ai-${message.id}`}>
      <div className="max-w-xs sm:max-w-md lg:max-w-2xl">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <GraduationCap className="text-white text-sm" />
          </div>
          <div className="chat-bubble-ai rounded-2xl px-4 py-4 shadow-sm">
            <MathRenderer content={message.content} />
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground" data-testid="text-timestamp">{timestamp}</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                  data-testid="button-copy-solution"
                >
                  <Copy className="text-xs" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  data-testid="button-thumbs-up"
                >
                  <ThumbsUp className="text-xs" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  data-testid="button-thumbs-down"
                >
                  <ThumbsDown className="text-xs" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
