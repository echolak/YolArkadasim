
import React from 'react';
import { Report } from '../types';

interface ReportsListProps {
  reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'police': return { icon: 'fa-shield-halved', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'radar': return { icon: 'fa-camera', color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'accident': return { icon: 'fa-car-burst', color: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'traffic': return { icon: 'fa-traffic-light', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'gas_price': return { icon: 'fa-gas-pump', color: 'text-green-400', bg: 'bg-green-500/10' };
      default: return { icon: 'fa-circle-exclamation', color: 'text-slate-400', bg: 'bg-slate-500/10' };
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Az önce';
    if (mins < 60) return `${mins} dk önce`;
    return `${Math.floor(mins / 60)} sa önce`;
  };

  return (
    <div className="h-full bg-slate-950 overflow-y-auto">
      <div className="p-4 space-y-6">
        {reports.length === 0 ? (
          <div className="text-center py-20 text-slate-800">
            <i className="fa-solid fa-magnifying-glass text-6xl mb-6 block"></i>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Rapor Bulunmuyor</p>
          </div>
        ) : (
          reports.map((report) => {
            const style = getIcon(report.type);
            return (
              <div key={report.id} className="flex flex-col bg-slate-900 rounded-3xl border border-white/5 shadow-xl overflow-hidden animate-fade-in">
                <div className="flex gap-4 p-4">
                  <div className={`${style.bg} ${style.color} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5`}>
                    <i className={`fa-solid ${style.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-white text-sm tracking-tight">{report.userName}</h4>
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{getTimeAgo(report.timestamp)}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3 font-medium">
                      {report.description || `${report.type.toUpperCase()} bildirimi yapıldı.`}
                    </p>
                    
                    {report.imageUrl && (
                      <div className="mb-4 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                        <img src={report.imageUrl} alt="Incident" className="w-full h-48 object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full active:scale-95 transition-transform border border-blue-500/20">
                        <i className="fa-solid fa-check"></i> ONAYLA ({report.votes})
                      </button>
                      <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1.5 rounded-full active:scale-95 transition-transform border border-white/5">
                        <i className="fa-solid fa-xmark"></i> YOK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReportsList;
