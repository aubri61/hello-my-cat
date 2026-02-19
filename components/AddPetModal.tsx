'use client';

import { useState, useRef } from 'react';
import { Camera, Cat, Dog, Bird, Rabbit, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Pet } from '@/types/pet';

interface AddPetModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (pet: Omit<Pet, 'id' | 'memories' | 'createdAt'>) => void;
}

const speciesOptions: { value: Pet['species']; label: string; icon: React.ReactNode }[] = [
  { value: 'cat', label: '고양이', icon: <Cat className="w-5 h-5" /> },
  { value: 'dog', label: '강아지', icon: <Dog className="w-5 h-5" /> },
  { value: 'bird', label: '새', icon: <Bird className="w-5 h-5" /> },
  { value: 'rabbit', label: '토끼', icon: <Rabbit className="w-5 h-5" /> },
  { value: 'other', label: '기타', icon: <Heart className="w-5 h-5" /> },
];

const honorificOptions = ['언니', '엄마', '아빠', '누나', '형', '오빠'];

export function AddPetModal({ open, onClose, onAdd }: AddPetModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Pet['species']>('cat');
  const [personality, setPersonality] = useState('');
  const [honorific, setHonorific] = useState('');
  const [customHonorific, setCustomHonorific] = useState('');
  const [useCustomHonorific, setUseCustomHonorific] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const finalHonorific = useCustomHonorific ? customHonorific.trim() : honorific;
      if (!finalHonorific) {
        alert('호칭을 선택하거나 입력해주세요.');
        return;
      }
      onAdd({
        name: name.trim(),
        species,
        personality: personality.trim() || '사랑스러운 아이',
        honorific: finalHonorific,
        photo,
      });
      // Reset form
      setName('');
      setSpecies('cat');
      setPersonality('');
      setHonorific('');
      setCustomHonorific('');
      setUseCustomHonorific(false);
      setPhoto(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <span className="text-xl">🌈</span>
            새 친구 등록하기
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Photo Upload */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden ring-4 ring-peach/30 hover:ring-primary/50 transition-all"
            >
              {photo ? (
                <>
                  <img src={photo} alt="Pet" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto(null);
                    }}
                    className="absolute top-0 right-0 p-1 bg-destructive rounded-full text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Name Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              이름
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="소중한 친구의 이름"
              className="rounded-xl"
              required
            />
          </div>

          {/* Species Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              어떤 친구인가요?
            </label>
            <div className="flex gap-2 flex-wrap">
              {speciesOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSpecies(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                    species === opt.value
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {opt.icon}
                  <span className="text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Honorific Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              호칭
            </label>
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {honorificOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setHonorific(opt);
                      setUseCustomHonorific(false);
                    }}
                    className={`px-3 py-2 rounded-xl transition-all text-sm ${
                      !useCustomHonorific && honorific === opt
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomHonorific(true);
                    setHonorific('');
                  }}
                  className={`px-3 py-2 rounded-xl transition-all text-sm ${
                    useCustomHonorific
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  직접 입력
                </button>
              </div>
              {useCustomHonorific && (
                <Input
                  value={customHonorific}
                  onChange={(e) => setCustomHonorific(e.target.value)}
                  placeholder="호칭을 입력하세요"
                  className="rounded-xl"
                />
              )}
            </div>
          </div>

          {/* Personality */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              성격 / 특징
            </label>
            <Textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="예: 츤데레지만 애교쟁이, 간식을 좋아해요"
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-xl py-6 shadow-soft"
            disabled={!name.trim()}
          >
            등록하기 💕
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
