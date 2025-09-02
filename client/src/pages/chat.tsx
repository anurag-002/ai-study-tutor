import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@/components/chat/chat-message";
import { FileUpload } from "@/components/chat/file-upload";
import { GraduationCap, Settings, UserCircle, Paperclip, Send, MessageSquare, Camera, Lightbulb, Plus, History, SquareRadical } from "lucide-react";
import { MathSymbolsDialog } from "@/components/chat/math-symbols-dialog";
import { HistoryDialog } from "@/components/chat/history-dialog";
import { SettingsDialog } from "@/components/chat/settings-dialog";
import { ProfileDialog } from "@/components/chat/profile-dialog";
import type { Message, Conversation } from "@shared/schema";

export default function ChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock user ID for demo - in real app this would come from auth
  const userId = "demo-user";

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [currentConversationId]);

  // Get messages for current conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    enabled: !!currentConversationId,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (data: { title: string; userId: string }) => {
      const response = await apiRequest('POST', '/api/conversations', data);
      return response.json();
    },
    onSuccess: (conversation: Conversation) => {
      setCurrentConversationId(conversation.id);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; content: string; isUser: boolean; imageUrl?: string }) => {
      const response = await apiRequest('POST', '/api/messages', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', currentConversationId, 'messages'] });
      setInputValue("");
      setUploadedImageUrl(null);
      setShowUploadZone(false);
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !uploadedImageUrl) return;

    let conversationId = currentConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      setIsTyping(true);
      const title = inputValue.slice(0, 50) + (inputValue.length > 50 ? "..." : "");
      const conversation = await createConversationMutation.mutateAsync({
        title,
        userId,
      });
      conversationId = conversation.id;
    }

    if (conversationId) {
      setIsTyping(true);
      sendMessageMutation.mutate({
        conversationId,
        content: inputValue.trim() || "Please solve this problem from the image:",
        isUser: true,
        imageUrl: uploadedImageUrl || undefined,
      });
    }
  };

  const handleFileUpload = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setShowUploadZone(false);
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully.",
    });
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setInputValue("");
    setUploadedImageUrl(null);
    setShowUploadZone(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInsertSymbol = (latex: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = inputValue.slice(0, start) + latex + inputValue.slice(end);
      setInputValue(newValue);
      
      // Focus back to textarea and set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + latex.length, start + latex.length);
      }, 10);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Study Tutor</h1>
                <p className="text-sm text-muted-foreground">Intelligent Problem Solving</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SettingsDialog>
                <Button variant="ghost" size="icon" data-testid="button-settings">
                  <Settings className="text-muted-foreground" />
                </Button>
              </SettingsDialog>
              <ProfileDialog>
                <Button variant="ghost" size="icon" data-testid="button-profile">
                  <UserCircle className="text-muted-foreground text-xl" />
                </Button>
              </ProfileDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Welcome Section - Only show when no conversation */}
        {!currentConversationId && (
          <div className="p-6 text-center border-b bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to AI Study Tutor</h2>
              <p className="text-muted-foreground mb-4">Ask questions, upload images of problems, and get detailed step-by-step solutions powered by advanced AI.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4 hover-lift">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="text-primary text-xl" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Ask Questions</h3>
                  <p className="text-sm text-muted-foreground">Type any math, science, or academic question</p>
                </Card>
                
                <Card className="p-4 hover-lift">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Camera className="text-secondary text-xl" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Upload Images</h3>
                  <p className="text-sm text-muted-foreground">Take photos of homework problems</p>
                </Card>
                
                <Card className="p-4 hover-lift">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="text-accent text-xl" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Get Solutions</h3>
                  <p className="text-sm text-muted-foreground">Receive detailed step-by-step explanations</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        <div 
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6" 
          data-testid="chat-messages"
        >
          {currentConversationId && messagesLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {messages.map((message: Message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start fade-in">
              <div className="max-w-xs sm:max-w-md lg:max-w-2xl">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <GraduationCap className="text-white text-sm" />
                  </div>
                  <div className="chat-bubble-ai rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">AI is analyzing your problem</span>
                      <div className="flex space-x-1 ml-2">
                        <div className="w-2 h-2 bg-primary/60 rounded-full typing-dots"></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full typing-dots"></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full typing-dots"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-card/50 backdrop-blur-sm sticky bottom-0">
          <div className="p-4 max-w-4xl mx-auto">
            {/* File Upload Dropzone */}
            {showUploadZone && (
              <FileUpload
                onFileUpload={handleFileUpload}
                onClose={() => setShowUploadZone(false)}
              />
            )}

            {/* Uploaded Image Preview */}
            {uploadedImageUrl && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="text-primary w-4 h-4" />
                    <span className="text-sm text-foreground">Image attached</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedImageUrl(null)}
                    data-testid="button-remove-image"
                  >
                    Remove
                  </Button>
                </div>
                <img 
                  src={uploadedImageUrl} 
                  alt="Uploaded problem" 
                  className="mt-2 max-w-xs rounded-lg border"
                />
              </div>
            )}

            {/* Input Controls */}
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask a question or describe a problem you need help with..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[44px] max-h-32 px-4 py-3 pr-12 bg-input border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
                    rows={1}
                    data-testid="textarea-message-input"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowUploadZone(!showUploadZone)}
                    data-testid="button-toggle-upload"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm hover-lift"
                onClick={handleSendMessage}
                disabled={(!inputValue.trim() && !uploadedImageUrl) || sendMessageMutation.isPending}
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <MathSymbolsDialog onInsertSymbol={handleInsertSymbol}>
                <Button 
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                  data-testid="button-math-symbols"
                >
                  <SquareRadical className="w-4 h-4" />
                  <span>Math Symbols</span>
                </Button>
              </MathSymbolsDialog>
              <Button 
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                onClick={handleNewChat}
                data-testid="button-new-chat"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </Button>
              <HistoryDialog currentConversationId={currentConversationId} onSelectConversation={setCurrentConversationId} userId={userId}>
                <Button 
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                  data-testid="button-history"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </Button>
              </HistoryDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
