
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  userName: string;
  onSendMessage: (text: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, userName, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 relative z-10">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-20 text-slate-800">
            <i className="fa-solid fa-tower-broadcast text-6xl mb-6 block opacity-20"></i>
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Telsiz Sessiz</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userId === 'currentUser' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1.5 px-2">
              <span className="text-[10px] font-black text-slate-500 uppercase">{msg.userName}</span>
              <span className="text-[8px] text-slate-600 font-bold">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={`max-w-[85%] px-5 py-3 rounded-[24px] text-sm font-medium shadow-lg leading-relaxed ${
              msg.userId === 'currentUser' ? 'bg-orange-600 text-white rounded-tr-none shadow-orange-900/20' : 'bg-slate-900 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-900/90 backdrop-blur-lg border-t border-white/5 flex gap-3 shadow-2xl relative z-20">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`${userName} olarak mesaj yaz...`}
          className="flex-1 bg-white text-black border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xl"
          style={{ color: 'black' }} // Kesin siyah metin garantisi
        />
        <button 
          type="submit"
          className="bg-orange-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/20 active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-paper-plane text-lg"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatView;
