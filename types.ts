
export enum UserPath {
  SCIENTIFIC = 'SCIENTIFIC',
  RELIGIOUS = 'RELIGIOUS',
  BLENDED = 'BLENDED',
  NONE = 'NONE'
}

export type LanguageCode = 
  | 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'hi' | 'ar' | 'pt' | 'ru' 
  | 'ko' | 'it' | 'tr' | 'nl' | 'sv' | 'pl' | 'id' | 'th' | 'vi' | 'he';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface UserState {
  path: UserPath;
  isPremium: boolean;
  queriesUsed: number;
  level: number;
  xp: number;
  entropy: number;
  atp: number;
  proteins: number;
  voltage: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'email' | 'anonymous';
  archetype?: string;
  startingSkill?: string;
  level: number;
  xp: number;
  atp: number;
  proteins: number;
  voltage: number;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  isLocked: boolean;
  content: string;
  visualCue?: string;
  imgUrl?: string;
}

// Simulated Database Record
export interface UserRecord {
  profile: UserProfile;
  queriesUsed: number;
  isPremium: boolean;
  lastLogin: number;
}
