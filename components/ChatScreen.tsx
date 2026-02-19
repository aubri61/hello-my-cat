'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Pet, Message } from '@/types/pet';

interface ChatScreenProps {
  pet: Pet;
}

// 이 함수는 더 이상 사용되지 않습니다 (Gemini API 사용)

export function ChatScreen({ pet }: ChatScreenProps) {
  const honorific = pet.honorific || '언니'; // 기본값 설정
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `${honorific}! 안녕. 나 ${pet.name}이야. 잘 지냈어?`,
      sender: 'pet',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 대화 히스토리 준비 (최근 10개 메시지)
      const recentHistory = messages.slice(-10).map(msg => ({
        role: msg.sender as 'user' | 'pet',
        content: msg.content,
      }));

      // Gemini API 호출
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pet,
          message: content,
          conversationHistory: recentHistory,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI 응답 생성 실패');
      }

      const data = await response.json();
      
      const petMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response || '응답을 생성하지 못했어요...',
        sender: 'pet',
        timestamp: new Date().toISOString(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, petMessage]);
    } catch (error: any) {
      console.error('채팅 오류:', error);
      setIsTyping(false);
      
      // 오류 발생 시 기본 응답 사용
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        content: `죄송해요... ${error.message || '응답을 생성하지 못했어요'}. 다시 말해주실래요? 😿`,
        sender: 'pet',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 min-h-0" style={{ padding: '7.5%' }}>
        {messages.map(msg => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            petName={pet.name}
            petPhoto={pet.photo}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach flex items-center justify-center overflow-hidden">
              {pet.photo ? (
                <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">🐱</span>
              )}
            </div>
            <div className="gradient-message px-4 py-3 rounded-2xl rounded-bl-md shadow-soft">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
