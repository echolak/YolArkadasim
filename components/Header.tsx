
import React, { useState } from 'react';
import { AppTab, UserProfile } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  onSearch?: (dest: string) => void;
  isNavigating?: boolean;
  profile?: UserProfile;
  onProfileUpdate?: (nickname: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onSearch, isNavigating, profile, onProfileUpdate }) => {
  const [searchText, setSearchText] = useState('');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [tempNick, setTempNick] = useState(profile?.nickname || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim() && onSearch) {
      onSearch(searchText);
    }
  };

  const handleNickSave = () => {
    if (tempNick.trim() && onProfileUpdate) {
      onProfileUpdate(tempNick);
      setIsEditingNick(false);
    }
  };

  const getTitle = () => {
    if (isNavigating && activeTab === AppTab.MAP) return "Navigasyon Aktif";
    switch(activeTab) {
      case AppTab.MAP: return "YolArkadaşım AI";
      case AppTab.REPORTS: return "Canlı Akış";
      case AppTab.CHAT: return "Telsiz Sohbet";
      case AppTab.AI: return "Akıllı Pilot";
      default: return "YolArkadaşım";
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl px-5 py-4 flex flex-col gap-4 border-b border-white/5 z-30 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
            <i className="fa-solid fa-location-arrow text-sm"></i>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">{getTitle()}</h1>
            {!isEditingNick ? (
              <button 
                onClick={() => setIsEditingNick(true)}
                className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1 flex items-center gap-1"
              >
                {profile?.nickname || 'Nick Ayarla'} <i className="fa-solid fa-pen text-[8px]"></i>
              </button>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <input 
                  autoFocus
                  className="text-[10px] font-black text-slate-950 bg-white border-none outline-none p-1 px-2 rounded-lg"
                  value={tempNick}
                  onChange={(e) => setTempNick(e.target.value)}
                  onBlur={handleNickSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNickSave()}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-green-500 tracking-widest">CANLI</span>
        </div>
      </div>

      {activeTab === AppTab.MAP && !isNavigating && (
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Nereye gitmek istersiniz?"
            className="w-full bg-white border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-xl"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <button type="submit" className="hidden"></button>
        </form>
      )}
    </header>
  );
};

export default Header;
