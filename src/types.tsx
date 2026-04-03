import { Heart, Star, Moon, Sun, Cloud, Flower } from 'lucide-react';

export type GemType = 'heart' | 'star' | 'moon' | 'sun' | 'cloud' | 'flower';

export interface Gem {
  id: string;
  type: GemType;
}

export interface Position {
  row: number;
  col: number;
}

export interface LevelConfig {
  rows: number;
  cols: number;
  targetScore: number;
  moves: number;
}

export const GEM_CONFIG: Record<GemType, { color: string; icon: any }> = {
  heart: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src="1.png" alt="Heart" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  star: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src="2.png" alt="Star" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  moon: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src="3.png" alt="Moon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  sun: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src="4.png" alt="Sun" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  cloud: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src="5.png" alt="Cloud" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  flower: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src="6.png" alt="Flower" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
};

export const GEM_TYPES: GemType[] = ['heart', 'star', 'moon', 'sun', 'cloud', 'flower'];
