'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-sm safe-area-bottom"
    >
      <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2">
        <Sparkles className="w-5 h-5 text-primary/60 flex-shrink-0" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || disabled}
          className="rounded-full w-9 h-9 bg-primary hover:bg-primary/90 shadow-soft"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
