'use client';

import { useState, useEffect } from 'react';
import type { Pet, Memory, DailyLetter } from '@/types/pet';

const STORAGE_KEY = 'rainbow-bridge-pets';
const LETTERS_KEY = 'rainbow-bridge-letters';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [letters, setLetters] = useState<DailyLetter[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedPets = JSON.parse(stored);
      setPets(parsedPets);
      if (parsedPets.length > 0 && !selectedPetId) {
        setSelectedPetId(parsedPets[0].id);
      }
    }

    const storedLetters = localStorage.getItem(LETTERS_KEY);
    if (storedLetters) {
      setLetters(JSON.parse(storedLetters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
    } else {
      // Clear storage if no pets
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [pets]);

  useEffect(() => {
    if (letters.length > 0) {
      localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
    } else {
      // Clear storage if no letters
      localStorage.removeItem(LETTERS_KEY);
    }
  }, [letters]);

  const selectedPet = pets.find(p => p.id === selectedPetId) || null;

  const addPet = (pet: Omit<Pet, 'id' | 'memories' | 'createdAt'>) => {
    const newPet: Pet = {
      ...pet,
      id: crypto.randomUUID(),
      memories: [],
      createdAt: new Date().toISOString(),
    };
    setPets(prev => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePet = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
    if (selectedPetId === id) {
      const remaining = pets.filter(p => p.id !== id);
      setSelectedPetId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const addMemory = (petId: string, memory: Omit<Memory, 'id'>) => {
    const newMemory: Memory = {
      ...memory,
      id: crypto.randomUUID(),
    };
    setPets(prev => prev.map(p => 
      p.id === petId 
        ? { ...p, memories: [...p.memories, newMemory] }
        : p
    ));
  };

  const addLetter = (letter: Omit<DailyLetter, 'id'>) => {
    const newLetter: DailyLetter = {
      ...letter,
      id: crypto.randomUUID(),
    };
    setLetters(prev => [...prev, newLetter]);
  };

  const markLetterAsRead = (id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l));
  };

  const getUnreadLettersCount = (petId: string) => {
    return letters.filter(l => l.petId === petId && !l.isRead).length;
  };

  const getLettersForPet = (petId: string) => {
    return letters.filter(l => l.petId === petId);
  };

  return {
    pets,
    selectedPet,
    selectedPetId,
    setSelectedPetId,
    addPet,
    updatePet,
    deletePet,
    addMemory,
    letters,
    addLetter,
    markLetterAsRead,
    getUnreadLettersCount,
    getLettersForPet,
  };
}
