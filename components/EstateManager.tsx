import React, { useState } from 'react';
import { Estate, UserRole, ServiceRequest } from '../types';
import { Plus, Trash2, MapPin, Calendar, Layers, Edit2, AlertCircle } from 'lucide-react';

interface EstateManagerProps {
  estates: Estate[];
  onAddEstate: (estate: Estate) => void;
  onEditEstate: (estate: Estate) => void;
  onDeleteEstate: (id: string) => void;
  onRequestChange: (request: Partial<ServiceRequest>) => void;
  userRole: UserRole;
}

export const EstateManager: React.FC<EstateManagerProps> = ({ 
  estates, 
  onAddEstate, 
  onEditEstate, 
  onDeleteEstate, 
  onRequestChange,
  userRole 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Estate>>({
    name: '',
    location: '',
    totalArea: 0,
    establishedDate: ''
  });

  const resetForm = () => {
    setFormData({ name: '', location: '', totalArea: 0, establishedDate: '' });
    setEditingEstate(null);
    setIsAdding(false);
  };

  const handleEditClick = (estate: Estate) => {
    setEditingEstate(estate);
    setFormData({ ...estate });
    setIsAdding(true); // Reuse the modal/form area
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    if (editingEstate) {
      // Logic for Editing
      const updatedEstate = { ...editingEstate, ...formData } as Estate;
      
      if (userRole === UserRole.ADMIN) {
        onEditEstate(updatedEstate);
        alert('Estate updated successfully.');
      } else {
        // Manager Request Flow
        onRequestChange({
          targetId: editingEstate.id,
          targetName: editingEstate.name,
          estateId: editingEstate.id,
          type: 'ESTATE_EDIT',
          description: `Request to update details for estate: ${editingEstate.name}`,
          payload: updatedEstate
        });
        alert('Change request submitted to Admin for approval.');
      }
    } else {
      // Logic for Adding
      const newEstate = {
        id: `e${Date.now()}`,
        name: formData.name,
        location: formData.location,
        totalArea: formData.totalArea || 0,
        establishedDate: formData.establishedDate || new Date().toISOString().split('T')[0]
      } as Estate;

      if (userRole === UserRole.ADMIN) {
        onAddEstate(newEstate);
      } else {
         alert('Only Admins can create new Estates directly. Contact Admin.');
         // Optional: Implement ESTATE_CREATE request if needed
      }
    }
    resetForm();
  };

  const isAdmin = userRole === UserRole.ADMIN;
  const isManager = userRole === UserRole.MANAGER;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Industrial Estates</h2>
        {isAdmin && (
          <button 
            onClick={() => { resetForm(); setIsAdding(!isAdding); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Estate
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl animate-fade-in-down relative">
          <h3 className="text-lg font-semibold mb-4">
            {editingEstate ? (isAdmin ? 'Edit Estate' : 'Request Estate Update') : 'New Estate Details'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estate Name</label>
              <input 
                type="text" 
                required
                className="w-full border border-slate-300 rounded-md p-2"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input 
                type="text" 
                required
                className="w-full border border-slate-300 rounded-md p-2"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Area (sq ft)</label>
              <input 
                type="number" 
                className="w-full border border-slate-300 rounded-md p-2"
                value={formData.totalArea}
                onChange={e => setFormData({...formData, totalArea: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Established Date</label>
              <input 
                type="date" 
                className="w-full border border-slate-300 rounded-md p-2"
                value={formData.establishedDate}
                onChange={e => setFormData({...formData, establishedDate: e.target.value})}
              />
            </div>
            
            {!isAdmin && editingEstate && (
               <div className="md:col-span-2 bg-amber-50 text-amber-800 text-sm p-3 rounded flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" />
                 Note: As a manager, your changes will be submitted as a request for Admin approval.
               </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-md"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingEstate ? (isAdmin ? 'Update Estate' : 'Submit Request') : 'Save Estate'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {estates.map(estate => (
          <div key={estate.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Layers className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                   {(isAdmin || isManager) && (
                     <button 
                       onClick={() => handleEditClick(estate)}
                       className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                       title={isAdmin ? "Edit" : "Request Change"}
                     >
                       <Edit2 className="w-4 h-4" />
                     </button>
                   )}
                   {isAdmin && (
                    <button 
                      onClick={() => onDeleteEstate(estate.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                   )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{estate.name}</h3>
              <div className="flex items-center text-slate-500 text-sm mb-4">
                <MapPin className="w-3 h-3 mr-1" />
                {estate.location}
              </div>
              
              <div className="border-t border-slate-100 pt-4 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Est.</span>
                   <span className="font-medium text-slate-800">{estate.establishedDate}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Total Area</span>
                   <span className="font-medium text-slate-800">{estate.totalArea.toLocaleString()} sq ft</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
