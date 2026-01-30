
import React, { useState } from 'react';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@sicop.gov');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await login(email)) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4"><ShieldCheck size={32} /></div>
          <h1 className="text-2xl font-bold">SICOP Estate Portal</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-xl" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">Login Securely <ArrowRight size={18} /></button>
        </form>
        <div className="mt-8 space-y-2">
           <button onClick={() => setEmail('admin@sicop.gov')} className="w-full text-left text-xs p-3 bg-slate-50 rounded-lg hover:bg-slate-100 font-medium">Admin: admin@sicop.gov</button>
           <button onClick={() => setEmail('john@alphatech.com')} className="w-full text-left text-xs p-3 bg-slate-50 rounded-lg hover:bg-slate-100 font-medium">Holder: john@alphatech.com</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
