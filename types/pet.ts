export interface Pet {
  id: string;
  name: string;
  photo: string | null;
  species: 'cat' | 'dog' | 'bird' | 'rabbit' | 'hamster' | 'other';
  personality: string;
  honorific: string; // 호칭 (언니, 엄마, 아빠, 누나, 형, 오빠 등)
  memories: Memory[];
  createdAt: string;
}

export interface Memory {
  id: string;
  content: string;
  date: string;
  mood?: 'happy' | 'peaceful' | 'playful' | 'loving';
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'pet';
  timestamp: string;
}

export interface DailyLetter {
  id: string;
  petId: string;
  content: string;
  date: string;
  isRead: boolean;
}
