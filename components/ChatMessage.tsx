'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/types/pet';

interface ChatMessageProps {
  message: Message;
  petName?: string;
  petPhoto?: string | null;
}

export function ChatMessage({ message, petName, petPhoto }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div 
      className={cn(
        "flex gap-2 animate-fade-in-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-peach flex items-center justify-center flex-shrink-0 overflow-hidden">
          {petPhoto ? (
            <img src={petPhoto} alt={petName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">🐱</span>
          )}
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-2xl shadow-soft",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "gradient-message rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span 
          className={cn(
            "text-[10px] mt-1 block",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}
