'use client';

import { useState } from 'react';
import { BookHeart, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Pet, Memory } from '@/types/pet';

interface MemoryRecorderProps {
  pet: Pet;
  onAddMemory: (memory: Omit<Memory, 'id'>) => void;
}

const moodOptions: { value: Memory['mood']; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: '행복했던' },
  { value: 'peaceful', emoji: '😌', label: '평화로운' },
  { value: 'playful', emoji: '😸', label: '장난스런' },
  { value: 'loving', emoji: '🥰', label: '사랑스런' },
];

export function MemoryRecorder({ pet, onAddMemory }: MemoryRecorderProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Memory['mood']>('happy');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onAddMemory({
        content: content.trim(),
        date: new Date().toISOString(),
        mood,
      });
      setContent('');
      setMood('happy');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-lavender hover:bg-lavender/80 shadow-card"
        >
          <BookHeart className="w-5 h-5 text-foreground" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {pet.name}와(과)의 추억 기록하기
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              어떤 기분의 추억인가요?
            </label>
            <div className="flex gap-2">
              {moodOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMood(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                    mood === opt.value
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span className="text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              추억을 적어주세요
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`${pet.name}와(과) 함께했던 소중한 순간을 기록해주세요...`}
              className="rounded-xl resize-none"
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full rounded-xl py-6 shadow-soft"
            disabled={!content.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            추억 저장하기
          </Button>

          {pet.memories.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                저장된 추억들 ({pet.memories.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pet.memories.slice().reverse().map(memory => (
                  <div 
                    key={memory.id}
                    className="p-3 bg-secondary rounded-xl text-sm"
                  >
                    <p className="text-foreground">{memory.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(memory.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
