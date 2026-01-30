
import React, { useState, useEffect } from 'react';
import { UserPath, UserProfile, UserRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { GlobalBackgroundAudio } from './components/GlobalBackgroundAudio';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProgressionProvider } from './contexts/ProgressionContext';
import { CosmicBackground } from './components/CosmicBackground';

// Onboarding Components
import { LoginPortal } from './components/Onboarding/LoginPortal';
import { ArchetypeShowcase } from './components/Onboarding/ArchetypeShowcase'; 
import { NeuralInit } from './components/Onboarding/NeuralInit';
import { ArchetypeReveal } from './components/Onboarding/ArchetypeReveal';
import { FinalReveal } from './components/Onboarding/FinalReveal';
import { NeuronBuilder } from './components/Onboarding/NeuronBuilder';
import { TransitionScreen } from './components/TransitionScreen';
import { WarpScreen } from './components/WarpScreen';

type OnboardingStep = 'PORTAL' | 'SHOWCASE' | 'INIT' | 'REVEAL' | 'SKILL_INIT' | 'SYNTHESIS' | 'WARP' | 'BUILDER' | 'COMPLETE';

const ARCHETYPE_COLORS: Record<string, string> = {
    'SCIENTIST': '#00FFFF',
    'ARCHITECT': '#F43F5E',
    'MYSTIC': '#FFD700',
    'SEEKER': '#F97316',
    'ALCHEMIST': '#10B981',
    'ACTIVE_NODE': '#A855F7'
};

const AppContent: React.FC = () => {
  const [path, setPath] = useState<UserPath>(UserPath.NONE);
  const [isPremium, setIsPremium] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [queriesUsed, setQueriesUsed] = useState(0);
  
  // Onboarding State
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('PORTAL');
  const [warpTarget, setWarpTarget] = useState<OnboardingStep>('SHOWCASE');
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [nextStep, setNextStep] = useState<OnboardingStep | null>(null); 
  const [transitionTitle, setTransitionTitle] = useState("IDENTITY VERIFICATION");
  const [transitionSteps, setTransitionSteps] = useState<string[]>([]);

  const [calibrationProfile, setCalibrationProfile] = useState<any>(null);
  const [archetypeKey, setArchetypeKey] = useState<string>('ACTIVE_NODE'); 
  const [warpColor, setWarpColor] = useState<string>('cyan');

  // --- ROOT ACCESS OVERRIDE ---
  const effectiveIsPremium = isPremium || isAuthor;

  // --- ANTI-ABUSE DATABASE LOGIC ---
  const getUserDB = (): Record<string, UserRecord> => {
    try {
      const db = localStorage.getItem('gb_user_database');
      return db ? JSON.parse(db) : {};
    } catch (e) {
      return {};
    }
  };

  const saveUserDB = (db: Record<string, UserRecord>) => {
    localStorage.setItem('gb_user_database', JSON.stringify(db));
  };

  // --- DYNAMIC UI COLOR SYNC ---
  useEffect(() => {
    if (userProfile?.archetype) {
        const color = ARCHETYPE_COLORS[userProfile.archetype] || '#00FFFF';
        const root = document.documentElement;
        root.style.setProperty('--path-color', color);
        root.style.setProperty('--path-glow', color + '4D'); // 30% alpha for glow
    }
  }, [userProfile?.archetype]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const savedPath = localStorage.getItem('gb_path') as UserPath;
    const savedAuthToken = localStorage.getItem('gb_auth_token');
    
    if (savedAuthToken) {
      const db = getUserDB();
      const emailKey = Object.keys(db).find(key => savedAuthToken.includes(key));
      
      if (emailKey && db[emailKey] && db[emailKey].profile) {
         const record = db[emailKey];
         setUserProfile(record.profile);
         setIsAuthenticated(true);
         setQueriesUsed(record.queriesUsed);
         setIsPremium(record.isPremium);
         
         const isAdmin = record.profile.email === 'architect@source.code' || 
                         record.profile.email === 'admin@godsbrain.com' || 
                         record.profile.email === 'phoenix';

         if (isAdmin) {
             setIsAuthor(true);
             console.log("🐦 PHOENIX PROTOCOL ENGAGED: Forcing Portal start for Developer testing...");
             // RESET ALL PROGRESS FOR THE DEVELOPER ON REFRESH
             setOnboardingStep('PORTAL'); 
         } else if (savedPath && Object.values(UserPath).includes(savedPath)) {
            setPath(savedPath);
            setOnboardingStep('COMPLETE'); 
         } else {
             setOnboardingStep('SHOWCASE');
         }
      } else {
        localStorage.removeItem('gb_auth_token');
        setOnboardingStep('PORTAL');
      }
    } else {
        setOnboardingStep('PORTAL');
    }

    setIsLoaded(true);
  }, []);

  // --- TRANSITION ENGINE ---
  const triggerTransition = (targetStep: OnboardingStep, title?: string, steps?: string[]) => {
      setNextStep(targetStep);
      setTransitionTitle(title || "SYSTEM PROCESSING");
      setTransitionSteps(steps || ["Analyzing data...", "Synchronizing...", "Complete."]);
      setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
      if (nextStep) {
          setOnboardingStep(nextStep);
          setNextStep(null);
      }
      setIsTransitioning(false);
  };

  const handleGoBack = () => {
      if (onboardingStep === 'SHOWCASE') {
          handleLogout();
      } else if (onboardingStep === 'INIT') {
          setOnboardingStep('SHOWCASE');
      } else if (onboardingStep === 'REVEAL') {
          setOnboardingStep('INIT');
      } else if (onboardingStep === 'SKILL_INIT') {
          setOnboardingStep('REVEAL');
      } else if (onboardingStep === 'SYNTHESIS') {
          setOnboardingStep('SKILL_INIT');
      } else if (onboardingStep === 'BUILDER') {
          if (path !== UserPath.NONE) {
              setOnboardingStep('COMPLETE');
          } else {
              setOnboardingStep('SYNTHESIS');
          }
      }
  };

  const handleLoginSuccess = (email: string) => {
    const profile: UserProfile = {
        name: email.split('@')[0],
        email: email,
        provider: 'email',
        avatar: undefined,
        level: 1,
        xp: 0
    };

    const db = getUserDB();
    const existingRecord = db[profile.email];

    if (existingRecord) {
        setQueriesUsed(existingRecord.queriesUsed);
        setIsPremium(existingRecord.isPremium);
        setUserProfile(existingRecord.profile);
        db[profile.email] = { ...existingRecord, lastLogin: Date.now() };
    } else {
        setQueriesUsed(0);
        setIsPremium(false);
        setUserProfile(profile);
        db[profile.email] = { profile: profile, queriesUsed: 0, isPremium: false, lastLogin: Date.now() };
    }
    
    saveUserDB(db);
    localStorage.setItem('gb_auth_token', `neural_token_${profile.email}_${Date.now()}`);
    setIsAuthenticated(true);

    if (email === 'architect@source.code' || email === 'admin@godsbrain.com' || email === 'phoenix') {
        handleAuthorLogin(); 
    } else {
        setWarpTarget('SHOWCASE');
        setWarpColor('cyan');
        setOnboardingStep('WARP');
    }
  };
  
  const handleShowcaseContinue = () => {
      triggerTransition('INIT', "INITIALIZING CALIBRATION", [
          "Loading core psychometric matrix...",
          "Phase 1: Identity Extraction...",
          "Sequence Ready."
      ]);
  };

  const handleManualArchetypeSelect = (id: string, skill: string) => {
      let selectedPath = UserPath.BLENDED;
      let colorName = 'purple';
      
      if (['SCIENTIST', 'ARCHITECT'].includes(id)) {
          selectedPath = UserPath.SCIENTIFIC;
          colorName = id === 'SCIENTIST' ? 'cyan' : 'rose';
      }
      if (['MYSTIC', 'SEEKER'].includes(id)) {
          selectedPath = UserPath.RELIGIOUS;
          colorName = id === 'MYSTIC' ? 'amber' : 'orange';
      }
      if (id === 'ALCHEMIST') {
          colorName = 'green';
      }
      
      setPath(selectedPath);
      setWarpColor(colorName);
      localStorage.setItem('gb_path', selectedPath);
      setArchetypeKey(id);

      handleUpdateProfile({ 
          archetype: id, 
          startingSkill: skill 
      });

      triggerTransition('BUILDER', `INITIALIZING ${id} PROTOCOL`, [
          `Allocating resources for ${skill}...`,
          "Bypassing standard calibration...",
          "Bio-Forge Ready."
      ]);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
      if (!userProfile) return;
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      const db = getUserDB();
      if (db[userProfile.email]) {
          db[userProfile.email].profile = updatedProfile;
          saveUserDB(db);
      }
  };

  const handleQueryIncrement = () => {
     if (!userProfile) return;
     const newCount = queriesUsed + 1;
     setQueriesUsed(newCount);
     const db = getUserDB();
     if (db[userProfile.email]) {
         db[userProfile.email].queriesUsed = newCount;
         saveUserDB(db);
     }
  };

  const handleArchetypeCalibrationComplete = (profile: any) => {
      setCalibrationProfile(profile);
      setArchetypeKey(profile.finalArchetype || 'ACTIVE_NODE');
      
      triggerTransition('REVEAL', "ANALYZING NEURAL ARCHITECTURE", [
          "Compiling core identity data...",
          "Archetype match detected.",
          "Generating profile..."
      ]);
  };

  const handleAcceptArchetype = (selectedPath: UserPath, color: string) => {
    setPath(selectedPath);
    setWarpColor(color);
    triggerTransition('SKILL_INIT', "IDENTITY INTEGRATED", [
        "Calibrating skill sub-processors...",
        "Phase 2: Functional Assessment...",
        "Ready."
    ]);
  };

  const handleSkillCalibrationComplete = (profileWithSkill: any) => {
      setCalibrationProfile(profileWithSkill);
      localStorage.setItem('gb_path', path);
      
      handleUpdateProfile({ 
          archetype: profileWithSkill.finalArchetype, 
          startingSkill: profileWithSkill.finalSkill 
      });

      triggerTransition('SYNTHESIS', "PROFILE SYNTHESIS", [
          "Merging identity and skill modules...",
          "Calculating metabolic synergy...",
          "Final Dossier Ready."
      ]);
  };

  const handleFinalAccept = () => {
      setWarpTarget('BUILDER');
      setOnboardingStep('WARP');
  };

  const handleWarpComplete = () => {
      setOnboardingStep(warpTarget);
  };

  const handleBuilderComplete = (avatarUrl: string) => {
      handleUpdateProfile({ avatar: avatarUrl });
      triggerTransition('COMPLETE', "SYSTEM UPLINK", [
          "Finalizing avatar integration...",
          "Connecting to God Brain Mainframe...",
          "Access Granted."
      ]);
  };

  const handlePremiumToggle = (status: boolean) => {
    setIsPremium(status);
    if (userProfile) {
        const db = getUserDB();
        if (db[userProfile.email]) {
            db[userProfile.email].isPremium = status;
            saveUserDB(db);
        }
    }
  };

  const handleAuthorLogin = () => {
    const authorProfile: UserProfile = {
        name: 'The Phoenix',
        email: 'architect@source.code',
        provider: 'email',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix',
        level: 99,
        xp: 0
    };
    
    setIsAuthor(true);
    setUserProfile(authorProfile);
    setIsAuthenticated(true);
    setIsPremium(true); 
    
    setPath(UserPath.BLENDED);
    localStorage.setItem('gb_path', UserPath.BLENDED);
    
    const db = getUserDB();
    db[authorProfile.email] = { profile: authorProfile, queriesUsed: 0, isPremium: true, lastLogin: Date.now() };
    saveUserDB(db);
    localStorage.setItem('gb_auth_token', `neural_token_${authorProfile.email}_${Date.now()}`);

    // GO TO SHOWCASE INSTEAD OF COMPLETE FOR THE AUTHOR TO ALLOW TESTING THE FLOW
    setWarpTarget('SHOWCASE');
    setWarpColor('amber');
    setOnboardingStep('WARP');
  };

  const handleLogout = () => {
    setPath(UserPath.NONE);
    setIsAuthenticated(false);
    setIsAuthor(false);
    setUserProfile(undefined);
    setQueriesUsed(0);
    setOnboardingStep('PORTAL');
    localStorage.removeItem('gb_path');
    localStorage.removeItem('gb_auth_token');
  };

  const handleEditNeuron = () => {
      triggerTransition('BUILDER', "RE-INITIALIZING BIO-FORGE", [
          "Loading current configuration...",
          "Accessing genetic memory...",
          "Editor Ready."
      ]);
  };

  if (!isLoaded) return null;

  return (
    <div className="h-screen w-screen text-[#e0f2fe] font-sans relative overflow-hidden bg-black">
      
      <CosmicBackground path={path} />
      <GlobalBackgroundAudio autoPlay={true} />
      
      <ProgressionProvider user={userProfile} onUpdate={handleUpdateProfile}>
          {isTransitioning && (
              <TransitionScreen 
                  onComplete={handleTransitionComplete} 
                  title={transitionTitle} 
                  steps={transitionSteps}
              />
          )}

          {onboardingStep === 'WARP' && (
              <WarpScreen color={warpColor} onComplete={handleWarpComplete} />
          )}

          <div className="relative z-10 h-full w-full overflow-hidden">
            {onboardingStep === 'PORTAL' && (
                <LoginPortal onLoginSuccess={handleLoginSuccess} />
            )}
            
            {onboardingStep === 'SHOWCASE' && userProfile && (
                <ArchetypeShowcase 
                    onContinue={handleShowcaseContinue}
                    onManualSelect={handleManualArchetypeSelect}
                />
            )}
            
            {onboardingStep === 'INIT' && userProfile && (
                <NeuralInit 
                    mode="ARCHETYPE"
                    userName={userProfile.name} 
                    onComplete={handleArchetypeCalibrationComplete} 
                    onBack={handleGoBack}
                />
            )}

            {onboardingStep === 'REVEAL' && (
                <ArchetypeReveal 
                    profile={calibrationProfile} 
                    onAccept={handleAcceptArchetype} 
                    onBack={handleGoBack}
                />
            )}

            {onboardingStep === 'SKILL_INIT' && userProfile && (
                <NeuralInit 
                    mode="SKILL"
                    userName={userProfile.name} 
                    onComplete={handleSkillCalibrationComplete} 
                    onBack={handleGoBack}
                    existingProfile={calibrationProfile}
                />
            )}

            {onboardingStep === 'SYNTHESIS' && (
                <FinalReveal 
                    profile={calibrationProfile} 
                    onAccept={handleFinalAccept} 
                    onBack={handleGoBack}
                />
            )}

            {onboardingStep === 'BUILDER' && (
                <NeuronBuilder 
                    archetype={archetypeKey} 
                    onComplete={handleBuilderComplete} 
                    onUpdateProfile={handleUpdateProfile}
                    onBack={handleGoBack}
                    isUnlocked={effectiveIsPremium}
                />
            )}

            {onboardingStep === 'COMPLETE' && (
              <Dashboard 
                path={path} 
                isPremium={effectiveIsPremium} 
                onPremiumToggle={handlePremiumToggle}
                onLogout={handleLogout} 
                isAuthor={isAuthor}
                onAuthorLogin={handleAuthorLogin}
                user={userProfile}
                onUpdateProfile={handleUpdateProfile}
                queriesUsed={queriesUsed}
                onQuery={handleQueryIncrement}
                onEditNeuron={handleEditNeuron}
              />
            )}
          </div>
      </ProgressionProvider>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .text-shadow-glow {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
