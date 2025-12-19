
import React, { useState, useEffect } from 'react';
import { AppTab, Report, ChatMessage, UserLocation, NavigationState, UserProfile } from './types';
import MapView from './components/MapView';
import BottomNav from './components/BottomNav';
import ReportOverlay from './components/ReportOverlay';
import ChatView from './components/ChatView';
import ReportsList from './components/ReportsList';
import AIView from './components/AIView';
import Header from './components/Header';
import NavigationPanel from './components/NavigationPanel';

// The environment provides AIStudio and window.aistudio globally.
// Redefining them here causes "identical modifiers" and "same type" errors.

const INITIAL_LOCATION: UserLocation = { lat: 41.0082, lng: 28.9784 };

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MAP);
  const [reports, setReports] = useState<Report[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation>(INITIAL_LOCATION);
  const [isReporting, setIsReporting] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('yolarkadasim_profile');
    return saved ? JSON.parse(saved) : { nickname: 'Gezgin' };
  });
  const [navigation, setNavigation] = useState<NavigationState>({
    isNavigating: false,
    destination: null,
    waypoints: [],
    eta: null,
    distance: null
  });

  useEffect(() => {
    const checkKey = async () => {
      // Access aistudio using any to avoid re-declaration conflicts in the global scope
      const aistudio = (window as any).aistudio;
      if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
        const selected = await aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      await aistudio.openSelectKey();
      // Assume success and proceed to mitigate race condition as per guidelines
      setHasKey(true);
    }
  };
  
  useEffect(() => {
    localStorage.setItem('yolarkadasim_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const mockReports: Report[] = [
      { id: '1', type: 'police', lat: 41.012, lng: 28.98, description: 'Sivil ekip kontrolü var.', timestamp: Date.now() - 3600000, userId: 'u1', userName: 'Ahmet', votes: 12 },
      { id: '3', type: 'accident', lat: 41.015, lng: 28.99, description: 'Zincirleme kaza, sol şerit kapalı.', timestamp: Date.now() - 600000, userId: 'u3', userName: 'Mert', votes: 24 },
    ];
    setReports(mockReports);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => console.log("Konum izni reddedildi.")
      );
    }
  }, []);

  const handleAddReport = (newReport: Omit<Report, 'id' | 'timestamp' | 'votes' | 'userId' | 'userName'>) => {
    const report: Report = {
      ...newReport,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      votes: 0,
      userId: 'currentUser',
      userName: profile.nickname,
    };
    setReports([report, ...reports]);
    setIsReporting(false);
  };

  const startNavigation = (dest: string, waypoints: string[] = []) => {
    setNavigation({
      isNavigating: true,
      destination: dest,
      waypoints: waypoints,
      eta: 'Hesaplanıyor...',
      distance: 'Hesaplanıyor...'
    });
    setActiveTab(AppTab.MAP);
  };

  const stopNavigation = () => {
    setNavigation({ isNavigating: false, destination: null, waypoints: [], eta: null, distance: null });
  };

  if (hasKey === null) {
    return <div className="h-full flex items-center justify-center bg-slate-950 text-white font-bold">Yükleniyor...</div>;
  }

  if (!hasKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl shadow-orange-500/20 mb-8 animate-bounce">
          <i className="fa-solid fa-location-arrow"></i>
        </div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">YolArkadaşım AI</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Google Maps ve gelişmiş AI özelliklerini kullanabilmek için lütfen geçerli bir API anahtarı seçin.
        </p>
        <button 
          onClick={handleOpenKeySelector}
          className="w-full max-w-xs bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform mb-4"
        >
          API ANAHTARI SEÇ
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-orange-500 font-bold underline"
        >
          Faturalandırma Hakkında Bilgi
        </a>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.MAP:
        return <MapView reports={reports} userLocation={userLocation} navigation={navigation} onAuthError={() => setHasKey(false)} />;
      case AppTab.REPORTS:
        return <ReportsList reports={reports} />;
      case AppTab.CHAT:
        return <ChatView messages={messages} userName={profile.nickname} onSendMessage={(text) => setMessages([...messages, { id: Date.now().toString(), userId: 'currentUser', userName: profile.nickname, text, timestamp: Date.now() }])} />;
      case AppTab.AI:
        return <AIView reports={reports} destination={navigation.destination} userLocation={userLocation} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-slate-950">
      <Header 
        activeTab={activeTab} 
        onSearch={startNavigation} 
        isNavigating={navigation.isNavigating}
        profile={profile}
        onProfileUpdate={(nickname) => setProfile({ nickname })}
      />
      
      <main className="flex-1 relative overflow-hidden bg-slate-950">
        {renderContent()}
        
        {navigation.isNavigating && activeTab === AppTab.MAP && (
          <NavigationPanel 
            navigation={navigation} 
            onStop={stopNavigation} 
          />
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onReportClick={() => setIsReporting(true)}
      />

      {isReporting && (
        <ReportOverlay 
          userLocation={userLocation}
          nickname={profile.nickname}
          onClose={() => setIsReporting(false)}
          onReport={handleAddReport}
        />
      )}
    </div>
  );
};

export default App;
