import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Brain,
  TrendingUp,
  DollarSign,
  Search,
  FileText,
  Sparkles,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI expense assistant. I can help you analyze spending patterns, approve expenses, and provide budget insights. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide tooltip after 8 seconds or when user interacts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setHasInteracted(true);
  };

  const quickActions = [
    { label: "Check my budget status", icon: DollarSign },
    { label: "Find duplicate expenses", icon: Search },
    { label: "Optimize recurring costs", icon: TrendingUp },
    { label: "Generate expense report", icon: FileText }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Import AI service dynamically
      const { aiService } = await import('@/services/aiService');
      
      // Get real AI response
      const aiContent = await aiService.generateChatResponse(userMessage);
      
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiContent,
        timestamp: new Date(),
        actions: userMessage.toLowerCase().includes('budget') ? [
          { label: "View Details", action: () => {} },
          { label: "Set Alert", action: () => {} }
        ] : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // Handle error silently
      
      // Fallback response
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: "I'm having trouble connecting to my AI service right now. Please try again in a moment. In the meantime, I can help you with basic expense management questions.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleQuickAction = async (action: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: action,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      // Import AI service dynamically
      const { aiService } = await import('@/services/aiService');
      
      // Get real AI response
      const aiContent = await aiService.generateChatResponse(action);
      
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiContent,
        timestamp: new Date(),
        actions: action.toLowerCase().includes('budget') ? [
          { label: "View Details", action: () => {} },
          { label: "Set Alert", action: () => {} }
        ] : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // Fallback response
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: "I'm having trouble connecting to my AI service right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !hasInteracted && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute bottom-16 right-0 mb-2 mr-2"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg relative max-w-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Assistant Ready!</span>
                </div>
                <p className="text-xs mt-1 opacity-90">
                  Click to get help with expenses, budgets, and financial insights
                </p>
                <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleOpen}
            size="lg"
            className="relative rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Pulsing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Main icon */}
            <div className="relative flex items-center justify-center">
              <Bot className="h-7 w-7 text-white" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-300" />
              </motion.div>
            </div>

            {/* Online indicator */}
            <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? '60px' : '500px'
      }}
      className="fixed bottom-6 right-6 z-50 w-96"
    >
      <Card className="bg-gradient-card backdrop-blur-sm border border-white/20 shadow-hover overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-blue-600" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-2 w-2 text-yellow-500" />
              </motion.div>
            </div>
            <h3 className="font-semibold text-gray-800">FlowPay AI Assistant</h3>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Online
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-gradient-primary text-white shadow-md'
                            : 'bg-card text-card-foreground border border-border/50 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        {msg.actions && (
                          <div className="flex gap-2 mt-2">
                            {msg.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={action.action}
                                className="text-xs hover:bg-primary/10"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        <p className="text-xs opacity-60 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={action.label}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action.label)}
                          className="text-xs justify-start"
                        >
                          <Icon className="h-3 w-3 mr-2" />
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about expenses..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};