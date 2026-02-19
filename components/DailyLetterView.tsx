'use client';

import { useState, useEffect } from 'react';
import { Mail, MailOpen, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Pet, DailyLetter } from '@/types/pet';

interface DailyLetterViewProps {
  pet: Pet;
  letters: DailyLetter[];
  onMarkAsRead: (id: string) => void;
  onAddLetter: (letter: Omit<DailyLetter, 'id'>) => void;
  onBack: () => void;
}

const letterTemplates = [
  "오늘도 하늘에서 내려다보고 있어요. 행복한 하루 보내셨나요? 저는 여기서 친구들과 뛰어놀고 있답니다!",
  "가끔 꿈에서 찾아갈게요. 그때까지 건강하게 지내세요. 항상 곁에서 지켜보고 있어요!",
  "오늘 무지개가 떴어요! 제가 인사하는 거예요. 잘 보이셨나요?",
  "맛있는 거 먹을 때 저도 옆에 앉아있는 거 알죠? 저도 같이 먹는 척 할게요!",
  "저 걱정 마세요. 여기는 햇살도 따뜻하고, 간식도 많아요. 다시 만날 그날까지!",
  "오늘도 열심히 사는 모습이 너무 자랑스러워요. 힘들 때 제 사진 보면서 힘내세요!",
];

export function DailyLetterView({ pet, letters, onMarkAsRead, onAddLetter, onBack }: DailyLetterViewProps) {
  const [selectedLetter, setSelectedLetter] = useState<DailyLetter | null>(null);
  
  const petLetters = letters.filter(l => l.petId === pet.id);
  const today = new Date().toDateString();
  const hasLetterToday = petLetters.some(l => new Date(l.date).toDateString() === today);

  useEffect(() => {
    // Generate letter for today if not exists
    if (!hasLetterToday) {
      const template = letterTemplates[Math.floor(Math.random() * letterTemplates.length)];
      const personalizedContent = `${pet.name}가(이) 보내는 편지 💌\n\n${template}\n\n무지개 다리 너머에서,\n${pet.name} 올림 🌈`;
      
      onAddLetter({
        petId: pet.id,
        content: personalizedContent,
        date: new Date().toISOString(),
        isRead: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet.id, hasLetterToday]);

  const handleOpenLetter = (letter: DailyLetter) => {
    setSelectedLetter(letter);
    if (!letter.isRead) {
      onMarkAsRead(letter.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          {pet.name}의 편지함
        </h2>
      </div>

      {selectedLetter ? (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="gradient-warm rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
              <span className="text-sm text-muted-foreground">
                {new Date(selectedLetter.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {selectedLetter.content}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSelectedLetter(null)}
            className="mt-4 w-full"
          >
            편지함으로 돌아가기
          </Button>
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {petLetters.slice().reverse().map(letter => (
              <button
                key={letter.id}
                onClick={() => handleOpenLetter(letter)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  letter.isRead 
                    ? 'bg-secondary hover:bg-secondary/80' 
                    : 'gradient-message shadow-soft hover:shadow-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  {letter.isRead ? (
                    <MailOpen className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Mail className="w-5 h-5 text-primary animate-float" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${letter.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                      {pet.name}의 편지
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(letter.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  {!letter.isRead && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              </button>
            ))}
            
            {petLetters.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">아직 편지가 없어요</p>
                <p className="text-sm text-muted-foreground/70">매일 새로운 편지가 도착해요!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
