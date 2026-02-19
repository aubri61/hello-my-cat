'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Pet, Message } from '@/types/pet';

interface ChatScreenProps {
  pet: Pet;
}

const generatePetResponse = (pet: Pet, userMessage: string): string => {
  const greetings = [
    `${pet.name}야, 너무 보고싶어`,
    `오늘 하루 어땠어?`,
    `사랑해`,
    `잘 지내고 있어?`,
  ];
  
  const responses = [
    `야옹~ 나도 ${userMessage.includes('보고싶') ? '너무너무 보고싶어요!' : '여기서 잘 지내고 있어요!'} 무지개 다리 너머에서도 항상 곁에 있을게요 💕`,
    `${pet.name}도 많이 생각하고 있어요! 하늘에서 항상 지켜보고 있답니다 ✨`,
    `고마워요! 저도 사랑해요~ 행복한 추억들 덕분에 여기서도 행복해요 🌈`,
    `오늘도 좋은 하루 보내세요! 저는 여기서 다른 친구들이랑 신나게 놀고 있어요 😸`,
    `가끔 꿈에서 만나요! 그때 얼굴 보여줄게요~ 항상 응원하고 있어요 💫`,
  ];

  const memoryResponses = pet.memories.length > 0 ? [
    `그때 그 기억... "${pet.memories[Math.floor(Math.random() * pet.memories.length)]?.content}" 저도 그때가 너무 좋았어요! 🥰`,
  ] : [];

  const allResponses = [...responses, ...memoryResponses];
  return allResponses[Math.floor(Math.random() * allResponses.length)];
};

export function ChatScreen({ pet }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `안녕! ${pet.name}야 여기야~ 무지개 다리 너머에서도 항상 옆에 있을게요! 오늘 하루는 어땠어요? 💕`,
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

    // Simulate pet typing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const petMessage: Message = {
      id: crypto.randomUUID(),
      content: generatePetResponse(pet, content),
      sender: 'pet',
      timestamp: new Date().toISOString(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, petMessage]);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
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
