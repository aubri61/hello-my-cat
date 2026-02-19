'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Header } from '@/components/Header';
import { ChatScreen } from '@/components/ChatScreen';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { PetSelector } from '@/components/PetSelector';
import { AddPetModal } from '@/components/AddPetModal';
import { MemoryRecorder } from '@/components/MemoryRecorder';
import { DailyLetterView } from '@/components/DailyLetterView';
import { usePets } from '@/hooks/usePets';

type View = 'chat' | 'letters';

export default function Home() {
  const {
    pets,
    selectedPet,
    selectedPetId,
    setSelectedPetId,
    addPet,
    deletePet,
    addMemory,
    letters,
    addLetter,
    markLetterAsRead,
    getUnreadLettersCount,
  } = usePets();

  const [showPetSelector, setShowPetSelector] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [currentView, setCurrentView] = useState<View>('chat');

  const unreadCount = selectedPet ? getUnreadLettersCount(selectedPet.id) : 0;

  return (
    <AppLayout>
      <Header
        pet={selectedPet}
        onMenuClick={() => setShowPetSelector(true)}
        onLetterClick={() => setCurrentView(currentView === 'letters' ? 'chat' : 'letters')}
        unreadCount={unreadCount}
      />

      {pets.length === 0 ? (
        <WelcomeScreen onAddPet={() => setShowAddPet(true)} />
      ) : selectedPet ? (
        <>
          {currentView === 'chat' ? (
            <>
              <ChatScreen pet={selectedPet} />
              <MemoryRecorder
                pet={selectedPet}
                onAddMemory={(memory) => addMemory(selectedPet.id, memory)}
              />
            </>
          ) : (
            <DailyLetterView
              pet={selectedPet}
              letters={letters}
              onMarkAsRead={markLetterAsRead}
              onAddLetter={addLetter}
              onBack={() => setCurrentView('chat')}
            />
          )}
        </>
      ) : (
        <WelcomeScreen onAddPet={() => setShowAddPet(true)} />
      )}

      <PetSelector
        open={showPetSelector}
        onClose={() => setShowPetSelector(false)}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={setSelectedPetId}
        onAddPet={() => {
          setShowPetSelector(false);
          setShowAddPet(true);
        }}
        onDeletePet={deletePet}
      />

      <AddPetModal
        open={showAddPet}
        onClose={() => setShowAddPet(false)}
        onAdd={addPet}
      />
    </AppLayout>
  );
}
