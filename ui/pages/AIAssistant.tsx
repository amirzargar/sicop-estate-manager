
import React, { useState, useRef, useEffect } from 'react';
import { AIUseCases } from '../../application/useCases/ai/AIUseCases';
import { Send, Bot, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Welcome to the SICOP Intelligence Hub. Ask me about rent outstanding or estate metrics.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await AIUseCases.queryAssistant(input);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "Error fetching insights." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
        <Sparkles className="text-blue-600" /> Intelligence Hub
      </h1>
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${m.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-slate-800 text-slate-200'}`}>
                  {m.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-slate-50 border border-slate-100' : 'bg-blue-600 text-white'}`}>
                   {m.text}
                </div>
              </div>
            </div>
          ))}
          {loading && <Loader2 className="animate-spin text-blue-600 mx-auto" />}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..." className="flex-1 px-4 py-2 border rounded-xl outline-none"
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-lg"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
