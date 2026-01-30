
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UnitUseCases } from '../../application/useCases/unit/UnitUseCases';
import { EstateUseCases } from '../../application/useCases/estate/EstateUseCases';
import { Box, ArrowUpRight } from 'lucide-react';
import { LeaseStatus } from '../../shared/types';

const UnitManager: React.FC = () => {
  const units = UnitUseCases.getAll();
  const estates = EstateUseCases.getAll();
  const navigate = useNavigate();

  const getEstateName = (id: string) => estates.find(e => e.id === id)?.name || 'Unknown';

  const getStatusStyle = (status: LeaseStatus) => {
    switch (status) {
      case LeaseStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700';
      case LeaseStatus.EXPIRED: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Unit Directory</h1>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Unit Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estate</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {units.map(unit => (
              <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3"><Box size={16} /> {unit.unitName}</td>
                <td className="px-6 py-4 text-slate-600">{getEstateName(unit.estateId)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusStyle(unit.leaseStatus)}`}>
                    {unit.leaseStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => navigate(`/unit/${unit.id}`)} className="text-blue-600"><ArrowUpRight size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitManager;
