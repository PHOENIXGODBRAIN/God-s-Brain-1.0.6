
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { playNeuralLink } from '../utils/sfx';

interface ProgressionContextType {
  level: number;
  xp: number;
  xpToNextLevel: number;
  addXp: (amount: number, reason?: string) => void;
  entropy: number; // 0 to 100
  reduceEntropy: (amount: number) => void;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

// LEVELING FORMULA: Level * 1000 * 1.5
const calculateXpForLevel = (lvl: number) => Math.floor(lvl * 1000 * 1.5);

export const ProgressionProvider: React.FC<{ children: React.ReactNode, user?: UserProfile, onUpdate?: (u: Partial<UserProfile>) => void }> = ({ children, user, onUpdate }) => {
  const [level, setLevel] = useState(user?.level || 1);
  const [xp, setXp] = useState(user?.xp || 0);
  const [entropy, setEntropy] = useState(0);

  useEffect(() => {
    if (user) {
        setLevel(user.level || 1);
        setXp(user.xp || 0);
        // Simulate initial entropy based on perceived inactivity
        setEntropy(15); 
    }
  }, [user?.email]); // Re-sync when user identity changes

  const addXp = (amount: number, reason?: string) => {
      let newXp = xp + amount;
      let newLevel = level;
      const required = calculateXpForLevel(level);

      if (newXp >= required) {
          newXp -= required;
          newLevel += 1;
          playNeuralLink(); 
          console.log("NEURAL EXPANSION: LEVEL " + newLevel);
      }

      setXp(newXp);
      setLevel(newLevel);
      if (onUpdate) onUpdate({ level: newLevel, xp: newXp });
  };

  const reduceEntropy = (amount: number) => {
      setEntropy(prev => Math.max(0, prev - amount));
  };

  return (
    <ProgressionContext.Provider value={{ 
        level, 
        xp, 
        xpToNextLevel: calculateXpForLevel(level), 
        addXp, 
        entropy, 
        reduceEntropy 
    }}>
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return context;
};
