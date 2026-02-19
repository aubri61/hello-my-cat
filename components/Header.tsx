'use client';

import { ChevronDown, Menu, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Pet } from '@/types/pet';

interface HeaderProps {
  pet: Pet | null;
  onMenuClick: () => void;
  onLetterClick: () => void;
  unreadCount: number;
}

export function Header({ pet, onMenuClick, onLetterClick, unreadCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-card/80 backdrop-blur-sm safe-area-top">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
      >
        <Menu className="w-5 h-5 text-muted-foreground" />
      </button>

      {pet ? (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={pet.photo || undefined} alt={pet.name} />
            <AvatarFallback className="bg-peach text-foreground font-medium">
              {pet.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-foreground">{pet.name}</span>
            <span className="text-xs text-muted-foreground">무지개 다리 너머에서 💫</span>
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">반려동물을 등록해주세요</span>
      )}

      <button 
        onClick={onLetterClick}
        className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors relative"
      >
        <Mail className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>
    </header>
  );
}
