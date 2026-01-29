
import React, { useState, useEffect } from 'react';
import { UserPath, UserProfile, UserRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { GlobalBackgroundAudio } from './components/GlobalBackgroundAudio';
import { LanguageProvider } from './contexts/LanguageContext';
import { CosmicBackground } from './components/CosmicBackground';

// Onboarding Components
import { LoginPortal } from './components/Onboarding/LoginPortal';
import { ArchetypeShowcase } from './components/Onboarding/ArchetypeShowcase'; 
import { NeuralInit } from './components/Onboarding/NeuralInit';
import { ArchetypeReveal } from './components/Onboarding/ArchetypeReveal';
import { NeuronBuilder } from './components/Onboarding/NeuronBuilder';
import { TransitionScreen } from './components/TransitionScreen';
import { WarpScreen } from './components/WarpScreen';

type OnboardingStep = 'PORTAL' | 'SHOWCASE' | 'INIT' | 'REVEAL' | 'WARP' | 'BUILDER' | 'COMPLETE';

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

  // --- INITIALIZATION ---
  useEffect(() => {
    const savedPath = localStorage.getItem('gb_path') as UserPath;
    const savedAuthToken = localStorage.getItem('gb_auth_token');
    
    if (savedAuthToken) {
      const db = getUserDB();
      const emailKey = Object.keys(db).find(key => savedAuthToken.includes(key));
      
      if (emailKey && db[emailKey]) {
         const record = db[emailKey];
         setUserProfile(record.profile);
         setIsAuthenticated(true);
         setQueriesUsed(record.queriesUsed);
         setIsPremium(record.isPremium);
         
         if (record.profile.email === 'architect@source.code' || record.profile.email === 'admin@godsbrain.com') {
             setIsAuthor(true);
         }
         
         if (savedPath && Object.values(UserPath).includes(savedPath)) {
            setPath(savedPath);
            setOnboardingStep('COMPLETE');
         } else {
             setOnboardingStep('SHOWCASE');
         }
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
      } else if (onboardingStep === 'BUILDER') {
          if (path !== UserPath.NONE) {
              setOnboardingStep('COMPLETE');
          } else {
              setOnboardingStep('REVEAL');
          }
      }
  };

  // --- ACTION HANDLERS ---

  const handleLoginSuccess = (email: string) => {
    const profile: UserProfile = {
        name: email.split('@')[0],
        email: email,
        provider: 'email',
        avatar: undefined
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
        triggerTransition('SHOWCASE', "IDENTITY VERIFICATION", [
            "Establishing secure neural uplink...",
            "INITIALIZING SECURE GATEWAY...",
            "Protocol: TLS 1.3 / AES-256 / 4096-bit RSA",
            "Handshake Complete."
        ]);
    }
  };
  
  const handleShowcaseContinue = () => {
      triggerTransition('INIT', "INITIALIZING CALIBRATION", [
          "Loading psychometric matrix...",
          "Preparing neural baseline...",
          "Sequence Ready."
      ]);
  };

  const handleManualArchetypeSelect = (id: string, skill: string) => {
      let selectedPath = UserPath.BLENDED;
      if (['SCIENTIST', 'ARCHITECT'].includes(id)) selectedPath = UserPath.SCIENTIFIC;
      if (['MYSTIC', 'SEEKER'].includes(id)) selectedPath = UserPath.RELIGIOUS;
      
      setPath(selectedPath);
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

  const handleCalibrationComplete = (profile: any) => {
      setCalibrationProfile(profile);
      setArchetypeKey(profile.finalArchetype || 'ACTIVE_NODE');
      
      // TRIGGER TRANSITION TO REVEAL
      triggerTransition('REVEAL', "ANALYZING NEURAL ARCHITECTURE", [
          "Compiling psychometric data...",
          "Comparing against archetype database...",
          "Match found...",
          "Generating profile..."
      ]);
  };

  const handleAcceptArchetype = (selectedPath: UserPath, color: string) => {
    setPath(selectedPath);
    localStorage.setItem('gb_path', selectedPath);
    setWarpColor(color);
    
    // GO TO WARP SCREEN
    setOnboardingStep('WARP');
  };

  const handleWarpComplete = () => {
      setOnboardingStep('BUILDER');
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
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix'
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

    triggerTransition('COMPLETE', "PHOENIX PROTOCOL RECOGNIZED", [
        "Identity Confirmed: SUPREME NODE.",
        "Bypassing Calibration Sequence...",
        "Unlocking Root Access...",
        "Welcome Home, Architect."
    ]);
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
    <div className="h-screen w-screen text-[#e0f2fe] font-sans relative overflow-hidden bg-transparent">
      
      <CosmicBackground path={path} />
      <GlobalBackgroundAudio autoPlay={true} />
      
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
                userName={userProfile.name} 
                onComplete={handleCalibrationComplete} 
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
