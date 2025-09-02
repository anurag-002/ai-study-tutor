import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { History, MessageSquare, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Conversation } from "@shared/schema";

interface HistoryDialogProps {
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  children: React.ReactNode;
}

export function HistoryDialog({ currentConversationId, onSelectConversation, children }: HistoryDialogProps) {
  const [open, setOpen] = useState(false);

  // Get conversation history - using the conversations endpoint
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['/api/conversations'],
    enabled: open, // Only fetch when dialog is open
  });

  const handleConversationSelect = (conversationId: string) => {
    onSelectConversation(conversationId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[70vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <span>Conversation History</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new chat to see your history here</p>
            </div>
          ) : (
            conversations.map((conversation: Conversation) => (
              <Card 
                key={conversation.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                  conversation.id === currentConversationId ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleConversationSelect(conversation.id)}
                data-testid={`conversation-${conversation.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {conversation.title || "Untitled Conversation"}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      {conversation.id === currentConversationId && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="font-medium mb-1">💭 Tip:</p>
          <p className="text-xs">Click any conversation to continue where you left off. Your chat history is automatically saved.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}