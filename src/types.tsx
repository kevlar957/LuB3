import { Heart, Star, Moon, Sun, Cloud, Flower } from 'lucide-react';
import img1 from './assets/1.png';
import img2 from './assets/2.png';
import img3 from './assets/3.png';
import img4 from './assets/4.png';
import img5 from './assets/5.png';
import img6 from './assets/6.png';

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
      <img src={img1} alt="Heart" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  star: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src={img2} alt="Star" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  moon: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src={img3} alt="Moon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  sun: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src={img4} alt="Sun" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  cloud: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src={img5} alt="Cloud" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
  flower: { 
    color: 'bg-transparent', 
    icon: () => (
      <img src={img6} alt="Flower" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    ) 
  },
};

export const GEM_TYPES: GemType[] = ['heart', 'star', 'moon', 'sun', 'cloud', 'flower'];
