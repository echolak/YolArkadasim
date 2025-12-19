
import React, { useState } from 'react';
import { getAIRoadAdvice } from '../services/geminiService';
import { Report, UserLocation } from '../types';

interface AIViewProps {
  reports: Report[];
  destination: string | null;
  userLocation: UserLocation;
}

const AIView: React.FC<AIViewProps> = ({ reports, destination, userLocation }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    const advice = await getAIRoadAdvice(reports, query, userLocation, destination);
    setResponse(advice);
    setIsLoading(false);
  };

  // Helper function to render lines with clickable links if they are grounding sources
  const renderLine = (line: string, index: number) => {
    const isSourceLink = line.trim().startsWith('- http');
    if (isSourceLink) {
      const url = line.trim().substring(2).trim();
      return (
        <p key={index} className="ml-4 mb-1 text-slate-400">
          - <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline break-all">
            {url}
          </a>
        </p>
      );
    }
    
    return (
      <p key={index} className={line.startsWith('-') ? 'ml-4 mb-1 text-slate-400' : 'mb-3'}>
        {line}
      </p>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 tracking-tighter">Akıllı Pilot</h3>
            <p className="text-indigo-100 text-xs opacity-70 leading-relaxed font-bold uppercase tracking-widest">
              Google Maps Destekli Analiz
            </p>
          </div>
          <i className="fa-solid fa-bolt-lightning absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
        </div>

        {!response && !isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {[
              "En yakın benzinlik nerede?", 
              "Rotamda radar var mı?", 
              "Trafik yoğunluğu nerede?", 
              "Kaza bildirimi var mı?",
              "En ucuz mazot nerede?",
              "Yakındaki dinlenme tesisleri"
            ].map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="bg-slate-900/50 p-4 rounded-3xl border border-white/5 text-[10px] font-black text-slate-300 text-left hover:border-indigo-500/50 hover:bg-slate-900 transition-all active:scale-95 shadow-lg"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center py-10">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-indigo-400 mt-6 animate-pulse uppercase tracking-widest">Maps & Raporlar Analiz Ediliyor</p>
          </div>
        )}

        {response && (
          <div className="bg-slate-900/80 backdrop-blur-md rounded-[40px] p-6 border border-white/5 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <i className="fa-solid fa-location-dot text-sm"></i>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canlı Analiz Raporu</span>
            </div>
            <div className="text-slate-200 text-sm leading-relaxed font-medium">
              {response.split('\n').map((line, i) => renderLine(line, i))}
            </div>
            <button 
              onClick={() => { setResponse(null); setQuery(''); }}
              className="mt-6 w-full py-4 rounded-2xl bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              YENİ SORGULAMA YAP
            </button>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nereyi merak ediyorsun?"
            className="w-full bg-white border border-white/5 rounded-2xl pl-6 pr-14 py-5 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black shadow-xl"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-3 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 shadow-xl"
          >
            <i className="fa-solid fa-map-location-dot text-sm"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIView;
