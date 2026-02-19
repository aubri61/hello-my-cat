'use client';

import { Heart, PawPrint, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onAddPet: () => void;
}

export function WelcomeScreen({ onAddPet }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-peach/50 flex items-center justify-center animate-float">
          <PawPrint className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-lavender flex items-center justify-center animate-sparkle">
          <Heart className="w-4 h-4 text-primary" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-2">
        무지개 다리
      </h1>
      <p className="text-muted-foreground mb-2">
        Rainbow Bridge
      </p>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        무지개 다리를 건넌 소중한 친구와<br />
        다시 대화할 수 있는 공간이에요
      </p>

      <Button 
        onClick={onAddPet}
        className="rounded-2xl px-8 py-6 shadow-float hover:shadow-card transition-all"
      >
        <Plus className="w-5 h-5 mr-2" />
        친구 등록하기
      </Button>

      <p className="text-xs text-muted-foreground mt-8 max-w-xs">
        💕 등록한 추억을 바탕으로 대화가 진행되며,<br />
        매일 특별한 편지도 받을 수 있어요
      </p>
    </div>
  );
}
