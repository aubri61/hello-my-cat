'use client';

import { Plus, Cat, Dog, Bird, Rabbit, Heart, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Pet } from '@/types/pet';

interface PetSelectorProps {
  open: boolean;
  onClose: () => void;
  pets: Pet[];
  selectedPetId: string | null;
  onSelectPet: (id: string) => void;
  onAddPet: () => void;
  onDeletePet: (id: string) => void;
}

const getSpeciesIcon = (species: Pet['species']) => {
  switch (species) {
    case 'cat': return <Cat className="w-4 h-4" />;
    case 'dog': return <Dog className="w-4 h-4" />;
    case 'bird': return <Bird className="w-4 h-4" />;
    case 'rabbit': return <Rabbit className="w-4 h-4" />;
    default: return <Heart className="w-4 h-4" />;
  }
};

export function PetSelector({ 
  open, 
  onClose, 
  pets, 
  selectedPetId, 
  onSelectPet, 
  onAddPet,
  onDeletePet 
}: PetSelectorProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 gradient-warm">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-2">
            <span className="text-2xl">🌈</span>
            <span>나의 무지개 친구들</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-3">
          {pets.map(pet => (
            <div
              key={pet.id}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                selectedPetId === pet.id 
                  ? 'bg-primary/10 ring-2 ring-primary/30' 
                  : 'hover:bg-secondary'
              }`}
              onClick={() => {
                onSelectPet(pet.id);
                onClose();
              }}
            >
              <Avatar className="w-12 h-12 ring-2 ring-peach">
                <AvatarImage src={pet.photo || undefined} />
                <AvatarFallback className="bg-peach text-foreground">
                  {getSpeciesIcon(pet.species)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">{pet.name}</p>
                <p className="text-xs text-muted-foreground">{pet.personality}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePet(pet.id);
                }}
                className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <Button
            onClick={onAddPet}
            variant="outline"
            className="w-full mt-4 rounded-2xl border-dashed border-2 py-6 hover:bg-secondary"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 친구 등록하기
          </Button>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-xs text-center text-muted-foreground">
            영원히 기억될 소중한 친구들 💕
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
