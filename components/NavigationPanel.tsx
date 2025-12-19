
import React from 'react';
import { NavigationState } from '../types';

interface NavigationPanelProps {
  navigation: NavigationState;
  onStop: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ navigation, onStop }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-40 animate-slide-down">
      <div className="bg-white rounded-3xl shadow-2xl p-4 flex flex-col gap-3 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
            <i className="fa-solid fa-arrow-turn-up rotate-90"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">300m Sonra Sağa Dönün</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">İnönü Caddesi'ne bağlanın</p>
          </div>
          <button 
            onClick={onStop}
            className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center active:bg-red-100 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
           <div className="flex items-center gap-2">
             <span className="text-2xl font-black text-gray-900">{navigation.eta?.split(' ')[0]}</span>
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Varış</span>
               <span className="text-xs font-bold text-green-600">{navigation.eta?.split(' ')[1]} {navigation.eta?.split(' ')[2]}</span>
             </div>
           </div>
           <div className="text-right">
             <span className="text-lg font-bold text-gray-800">{navigation.distance}</span>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Kalan Yol</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
