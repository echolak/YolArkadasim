
import React, { useState, useRef } from 'react';
import { IncidentType, UserLocation, Report } from '../types';

interface ReportOverlayProps {
  userLocation: UserLocation;
  nickname: string;
  onClose: () => void;
  onReport: (report: Omit<Report, 'id' | 'timestamp' | 'votes' | 'userId' | 'userName'>) => void;
}

const ReportOverlay: React.FC<ReportOverlayProps> = ({ userLocation, nickname, onClose, onReport }) => {
  const [type, setType] = useState<IncidentType>('police');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const types: { val: IncidentType; label: string; icon: string; color: string }[] = [
    { val: 'police', label: 'Polis Kontrolü', icon: 'fa-shield-halved', color: 'bg-blue-600' },
    { val: 'radar', label: 'Radar Uyarı', icon: 'fa-camera', color: 'bg-red-600' },
    { val: 'accident', label: 'Kaza', icon: 'fa-car-burst', color: 'bg-orange-600' },
    { val: 'traffic', label: 'Yoğun Trafik', icon: 'fa-traffic-light', color: 'bg-yellow-500' },
    { val: 'roadwork', label: 'Yol Çalışması', icon: 'fa-person-digging', color: 'bg-gray-600' },
    { val: 'weather', label: 'Hava Durumu', icon: 'fa-cloud-showers-heavy', color: 'bg-cyan-500' },
    { val: 'hazard', label: 'Yolda Engel', icon: 'fa-triangle-exclamation', color: 'bg-amber-500' },
    { val: 'stopped_car', label: 'Durmuş Araç', icon: 'fa-car-on', color: 'bg-slate-500' },
    { val: 'gas_price', label: 'Yakıt Fiyatı', icon: 'fa-gas-pump', color: 'bg-green-600' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-[40px] p-6 animate-slide-up shadow-2xl overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-950 leading-tight">Canlı Bildir</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{nickname} olarak paylaş</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-slate-400 bg-slate-50 rounded-full">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {types.map((t) => (
            <button
              key={t.val}
              onClick={() => setType(t.val)}
              className={`flex flex-col items-center gap-2 p-3 rounded-[24px] border-2 transition-all ${
                type === t.val ? 'border-orange-500 bg-orange-50 scale-105 shadow-sm' : 'border-gray-50 hover:border-gray-200'
              }`}
            >
              <div className={`${t.color} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
                <i className={`fa-solid ${t.icon}`}></i>
              </div>
              <span className="text-[10px] font-black text-center leading-tight text-slate-800">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detaylar</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-sm text-black font-bold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none min-h-[100px]"
              placeholder="Gördüğünüzü tarif edin..."
              style={{ color: 'black' }}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Görsel (İsteğe Bağlı)</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-colors"
              >
                {imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                ) : (
                  <>
                    <i className="fa-solid fa-camera text-xl mb-1"></i>
                    <span className="text-[8px] font-bold">EKLE</span>
                  </>
                )}
              </button>
              {imageUrl && (
                <button onClick={() => setImageUrl(undefined)} className="text-red-500 text-xs font-bold underline">Kaldır</button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onReport({ type, description, imageUrl, lat: userLocation.lat, lng: userLocation.lng })}
          className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-200 active:scale-95 transition-transform"
        >
          BİLDİRİMİ GÖNDER
        </button>
      </div>
    </div>
  );
};

export default ReportOverlay;
