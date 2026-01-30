
import React, { useState } from 'react';
import { EstateUseCases } from '../../application/useCases/estate/EstateUseCases';
import { Building2, Plus, MapPin, Layers, Search, MoreVertical } from 'lucide-react';

const EstateManager: React.FC = () => {
  const [estates, setEstates] = useState(EstateUseCases.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEstate, setNewEstate] = useState({ name: '', location: '', totalUnits: 10 });

  const handleAddEstate = () => {
    if (!newEstate.name || !newEstate.location) return;
    try {
      EstateUseCases.create(newEstate);
      setEstates(EstateUseCases.getAll());
      setIsModalOpen(false);
      setNewEstate({ name: '', location: '', totalUnits: 10 });
    } catch (e) {
      alert("Unauthorized: You do not have permissions to manage estates.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Estates</h1>
          <p className="text-slate-500">Official industrial estate directory</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
        >
          <Plus size={20} /> Create Estate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estates.map(estate => (
          <div key={estate.id} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={24} /></div>
              <MoreVertical className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{estate.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1 mb-4"><MapPin size={14} /> {estate.location}</div>
            <div className="bg-slate-50 p-3 rounded-lg flex justify-between">
              <span className="text-sm font-medium text-slate-600">Capacity</span>
              <span className="text-sm font-bold">{estate.totalUnits} Units</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">New Estate</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={newEstate.name} onChange={e => setNewEstate({...newEstate, name: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="Location" value={newEstate.location} onChange={e => setNewEstate({...newEstate, location: e.target.value})} className="w-full p-3 border rounded-xl" />
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleAddEstate} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateManager;
