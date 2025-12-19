
import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onReportClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onReportClick }) => {
  return (
    <div className="h-20 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 px-6 flex items-center justify-between pb-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <NavButton 
        icon="fa-map" 
        label="Harita" 
        isActive={activeTab === AppTab.MAP} 
        onClick={() => onTabChange(AppTab.MAP)} 
      />
      <NavButton 
        icon="fa-list" 
        label="Raporlar" 
        isActive={activeTab === AppTab.REPORTS} 
        onClick={() => onTabChange(AppTab.REPORTS)} 
      />
      
      {/* Central Report Button */}
      <div className="relative -top-6">
        <button 
          onClick={onReportClick}
          className="w-14 h-14 bg-orange-600 rounded-full shadow-2xl shadow-orange-600/30 flex items-center justify-center text-white text-2xl active:scale-95 transition-transform border-4 border-slate-900"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <NavButton 
        icon="fa-comments" 
        label="Mesajlar" 
        isActive={activeTab === AppTab.CHAT} 
        onClick={() => onTabChange(AppTab.CHAT)} 
      />
      <NavButton 
        icon="fa-robot" 
        label="AI Asistan" 
        isActive={activeTab === AppTab.AI} 
        onClick={() => onTabChange(AppTab.AI)} 
      />
    </div>
  );
};

interface NavButtonProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-500'}`}
  >
    <i className={`fa-solid ${icon} text-xl`}></i>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default BottomNav;
