
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { UnitUseCases } from '../../application/useCases/unit/UnitUseCases';
import { RentUseCases } from '../../application/useCases/rent/RentUseCases';
import { EstateUseCases } from '../../application/useCases/estate/EstateUseCases';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const UnitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const unit = UnitUseCases.getAll().find(u => u.id === id);
  const estate = EstateUseCases.getAll().find(e => e.id === unit?.estateId);
  const rentRecords = id ? RentUseCases.getByUnit(id) : [];

  if (!unit) return <div className="p-8 text-center text-slate-500">Unit profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Link to="/units" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold">
        <ArrowLeft size={16} /> Back to Units
      </Link>
      
      <div className="bg-white rounded-2xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{unit.unitName}</h1>
        <p className="text-slate-500 mb-6">{estate?.name}, {estate?.location}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div><p className="text-xs font-bold text-slate-400 uppercase">Proprietor</p><p className="font-semibold">{unit.proprietorName}</p></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase">Activity</p><p className="font-semibold">{unit.activityType}</p></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase">Employees</p><p className="font-semibold">{unit.employeeCount}</p></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase">Status</p><p className="font-bold text-blue-600">{unit.leaseStatus}</p></div>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-lg font-bold mb-4">Rent History</h3>
          <div className="space-y-3">
            {rentRecords.map(record => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div><p className="font-bold text-slate-900">₹{record.amount.toLocaleString()}</p><p className="text-xs text-slate-500">Due: {record.dueDate}</p></div>
                <div>{record.status === 'PAID' ? <span className="text-emerald-600 font-bold flex items-center gap-1 text-sm"><CheckCircle2 size={14} /> Settled</span> : <span className="text-rose-600 font-bold flex items-center gap-1 text-sm"><AlertCircle size={14} /> {record.status}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
