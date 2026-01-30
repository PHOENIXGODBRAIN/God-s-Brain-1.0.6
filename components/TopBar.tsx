
import React, { useRef, useState } from 'react';
import { Activity, Globe, Edit2, Flame, Atom, Sparkles, Cpu, User, Menu, X, Zap, Anchor, Compass, Scroll } from 'lucide-react';
import { UserProfile, UserPath, LanguageCode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgression } from '../contexts/ProgressionContext';
import { LANGUAGES } from '../translations';
import { playCosmicClick, playDataOpen } from '../utils/sfx';

interface TopBarProps {
  activeTab: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  user?: UserProfile;
  path: UserPath;
  isAuthor: boolean;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  activeTab, isMenuOpen, onToggleMenu, user, path, isAuthor, onUpdateProfile 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { level, xp, xpToNextLevel, entropy } = useProgression();
  
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  const getIdentity = () => {
    if (isAuthor) return { label: 'The Phoenix', color: 'text-[#FFD700]', icon: <Flame className="w-4 h-4 text-[#FFD700]" /> };
    
    const archetype = user?.archetype || 'GUEST';
    switch (archetype) {
        case 'SCIENTIST':
            return { label: t('scientist'), color: 'text-[#00FFFF]', icon: <Atom className="w-4 h-4 text-[#00FFFF]" /> };
        case 'ARCHITECT':
            return { label: 'Architect', color: 'text-[#F43F5E]', icon: <Anchor className="w-4 h-4 text-[#F43F5E]" /> };
        case 'MYSTIC':
            return { label: 'Mystic', color: 'text-[#FFD700]', icon: <Sparkles className="w-4 h-4 text-[#FFD700]" /> };
        case 'SEEKER':
            return { label: t('seeker'), color: 'text-[#F97316]', icon: <Compass className="w-4 h-4 text-[#F97316]" /> };
        case 'ALCHEMIST':
            return { label: 'Alchemist', color: 'text-[#10B981]', icon: <Scroll className="w-4 h-4 text-[#10B981]" /> };
        case 'ACTIVE_NODE':
            return { label: t('activeNode'), color: 'text-[#a855f7]', icon: <Cpu className="w-4 h-4 text-[#a855f7]" /> };
        default:
            return { label: 'Guest Node', color: 'text-gray-400', icon: <User className="w-4 h-4" /> };
    }
  };

  const identity = getIdentity();

  const handleAvatarClick = () => {
      playCosmicClick();
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onUpdateProfile) {
          const reader = new FileReader();
          reader.onloadend = () => {
              playDataOpen();
              onUpdateProfile({ avatar: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const startNameEdit = () => {
      if (!user) return;
      playCosmicClick();
      setEditName(user.name);
      setIsEditingName(true);
  };

  const saveNameEdit = () => {
      if (onUpdateProfile && editName.trim()) {
          playDataOpen();
          onUpdateProfile({ name: editName });
      }
      setIsEditingName(false);
  };

  const getTitle = () => {
      if (activeTab === 'companion') return t('dashboardAI');
      if (activeTab === 'book') return t('dashboardBook');
      if (activeTab === 'audio') return t('dashboardAudio');
      if (activeTab === 'map') return t('dashboardMap');
      if (activeTab === 'protocols') return t('dashboardProtocols');
      return 'DASHBOARD';
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-8 bg-black/30 backdrop-blur-xl p-6 rounded-3xl sticky top-0 z-30 shadow-2xl gap-4">
        
        <div className="md:hidden w-full flex justify-between items-center mb-4">
            <h1 className="font-tech text-[#00FFFF] tracking-tighter">{t('appTitle')}</h1>
            <button onClick={onToggleMenu} className="text-[#00FFFF]">
                {isMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        <div className="flex-1">
            <h2 className="font-tech text-xl text-white uppercase tracking-widest">{getTitle()}</h2>
            
            {/* PROGRESSION BAR */}
            <div className="mt-2 flex items-center gap-3 group/xp">
                <div className="text-[10px] font-mono text-[#00FFFF] font-bold">LVL {level}</div>
                <div className="h-1.5 w-40 bg-gray-900 rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_var(--path-color)] transition-all duration-1000" 
                        style={{ width: `${xpPercent}%`, backgroundColor: 'var(--path-color)' }}
                    ></div>
                </div>
                <div className="text-[8px] text-gray-500 font-mono opacity-0 group-hover/xp:opacity-100 transition-opacity uppercase">
                    {xp} / {xpToNextLevel} Synaptic Mass
                </div>
            </div>
        </div>
             
        {/* ENTROPY HUD */}
        <div className="hidden md:flex flex-col items-end mr-6">
            <div className="flex items-center gap-2 mb-1">
                <Activity className={`w-3 h-3 ${entropy > 50 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                <span className="font-tech text-[10px] text-gray-500 uppercase tracking-widest">Entropy Delta</span>
            </div>
            <div className="flex items-center gap-1 w-32 h-1 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-red-600 shadow-[0_0_10px_red] transition-all duration-500" 
                    style={{ width: `${entropy}%` }}
                ></div>
            </div>
            <div className="flex justify-between w-32 mt-1 text-[8px] font-mono text-gray-600 uppercase">
                <span>Decay: {entropy}%</span>
            </div>
        </div>
             
        {/* PROFILE CHIP */}
        <div className="w-full md:w-auto flex items-center gap-4 bg-black/40 p-2 pr-4 rounded-full border border-white/10 relative">
            <div className="relative group">
                <div className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <Globe className="w-4 h-4" />
                </div>
                <select 
                    value={language}
                    onChange={(e) => { playCosmicClick(); setLanguage(e.target.value as LanguageCode); }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                >
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
            </div>

            <div className="h-6 w-[1px] bg-white/10"></div>

            <div className="relative cursor-pointer group/avatar" onClick={handleAvatarClick}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-white/20 object-cover shadow-[0_0_10px_var(--path-glow)]" />
                ) : (
                    <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 ${identity.color} shadow-[0_0_10px_var(--path-glow)]`}>
                        {identity.icon}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start mr-2 min-w-[100px]">
                {isEditingName ? (
                    <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-black border border-white/20 text-[10px] text-white px-1 py-0.5 rounded w-24 focus:border-[#00FFFF] outline-none font-tech uppercase"
                        autoFocus
                        onBlur={saveNameEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveNameEdit()}
                    />
                ) : (
                    <div className={`text-[10px] font-bold font-tech uppercase flex items-center gap-1.5 ${identity.color} cursor-pointer hover:brightness-125 transition-all`} onClick={startNameEdit}>
                        {user?.name || 'Unknown Node'}
                        <Edit2 className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
                <div className="text-[8px] font-mono text-gray-500 tracking-wider">
                    {user?.email || 'OFFLINE'}
                </div>
            </div>
        </div>
    </div>
  );
};
