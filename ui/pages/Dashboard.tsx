
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GetEstateSummaryUseCase } from '../../application/useCases/estate/GetEstateSummaryUseCase';
import { RentUseCases } from '../../application/useCases/rent/RentUseCases';
import { JsonStorage } from '../../infrastructure/storage/JsonStorage';
import { Building2, TrendingUp, History, ShieldAlert } from 'lucide-react';

const Dashboard: React.FC = () => {
  const estates = GetEstateSummaryUseCase.execute();
  const rentSummary = RentUseCases.getSummary();
  const auditLogs = JsonStorage.get().auditLogs || [];
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500">Real-time SICOP Estate Performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={20} /></div>
            <span className="text-sm font-bold text-slate-500">Total Collection</span>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{rentSummary.totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShieldAlert size={20} /></div>
            <span className="text-sm font-bold text-slate-500">Outstanding Rent</span>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{rentSummary.totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-sm font-bold text-slate-500">Avg Occupancy</span>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {(estates.reduce((a, b) => a + b.occupancy, 0) / (estates.length || 1)).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Occupancy per Estate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estates}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="occupancy" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History size={18} className="text-slate-400" />
            Recent Activity
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {auditLogs.length > 0 ? auditLogs.map(log => (
              <div key={log.id} className="flex gap-4 p-3 rounded-lg border border-slate-50 bg-slate-50/50">
                <div className="text-[10px] font-bold text-slate-400 w-20 pt-1 uppercase">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div>
                  <p className="text-sm text-slate-700 font-medium">{log.description}</p>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{log.userName}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 text-sm py-8">No recent activity logs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
