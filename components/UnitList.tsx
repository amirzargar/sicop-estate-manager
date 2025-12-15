import React, { useState } from 'react';
import { Unit, Estate, UserRole, ServiceRequest } from '../types';
import { Search, Filter, ChevronRight, CheckCircle2, AlertCircle, Clock, Plus, Building } from 'lucide-react';

interface UnitListProps {
  units: Unit[];
  estates: Estate[];
  onSelectUnit: (unit: Unit) => void;
  onAddUnit: (unit: Unit) => void;
  onRequestAddUnit: (request: Partial<ServiceRequest>) => void;
  userRole: UserRole;
}

export const UnitList: React.FC<UnitListProps> = ({ 
  units, 
  estates, 
  onSelectUnit, 
  onAddUnit,
  onRequestAddUnit,
  userRole 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estateFilter, setEstateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Add Unit Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    name: '',
    estateId: '',
    proprietorName: '',
    lineOfActivity: '',
    employeeCount: 0,
    monthlyRent: 0,
    contactEmail: '',
    contactPhone: '',
    rentStatus: 'PENDING',
    leaseDurationYears: 10
  });

  const getRentStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'OVERDUE': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return null;
    }
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          unit.proprietorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstate = estateFilter === 'all' || unit.estateId === estateFilter;
    const matchesStatus = statusFilter === 'all' || unit.rentStatus === statusFilter;
    return matchesSearch && matchesEstate && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit.estateId) {
      alert("A Unit MUST belong to an Estate. Please select an Estate.");
      return;
    }

    const unitData = {
       ...newUnit,
       id: `u${Date.now()}`,
       leaseDeedDate: new Date().toISOString().split('T')[0],
       rentAgreementDate: new Date().toISOString().split('T')[0],
       lastRentPaymentDate: 'N/A',
       history: []
    } as Unit;

    if (userRole === UserRole.ADMIN) {
      onAddUnit(unitData);
      alert('Unit created successfully.');
      setIsAdding(false);
    } else {
      // Manager Request
      onRequestAddUnit({
        targetId: 'temp',
        targetName: unitData.name,
        estateId: unitData.estateId,
        type: 'NEW_UNIT',
        description: `Request to register new unit: ${unitData.name}`,
        payload: unitData
      });
      alert('Registration request submitted to Admin for approval.');
      setIsAdding(false);
    }
    // Reset form
    setNewUnit({
      name: '', estateId: '', proprietorName: '', lineOfActivity: '',
      employeeCount: 0, monthlyRent: 0, contactEmail: '', contactPhone: '',
      rentStatus: 'PENDING', leaseDurationYears: 10
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-slate-800">Industrial Units</h2>
             <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
               {filteredUnits.length} Units Found
             </span>
           </div>
           
           {(userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) && (
             <button 
               onClick={() => setIsAdding(!isAdding)}
               className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
             >
               <Plus className="w-4 h-4" /> 
               {userRole === UserRole.ADMIN ? 'Add Unit' : 'Register New Unit'}
             </button>
           )}
        </div>

        {isAdding && (
          <div className="bg-slate-50 border border-blue-200 p-4 rounded-lg animate-fade-in-down mb-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600"/>
              {userRole === UserRole.ADMIN ? 'Create New Unit' : 'Application for New Unit Registration'}
            </h3>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">Estate (Required)</label>
                <select 
                  required
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  value={newUnit.estateId}
                  onChange={e => setNewUnit({...newUnit, estateId: e.target.value})}
                >
                  <option value="">Select Estate...</option>
                  {estates.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Unit Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-300 rounded p-2 text-sm" 
                  value={newUnit.name}
                  onChange={e => setNewUnit({...newUnit, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Proprietor Name</label>
                <input required type="text" className="w-full border border-slate-300 rounded p-2 text-sm" 
                  value={newUnit.proprietorName}
                  onChange={e => setNewUnit({...newUnit, proprietorName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Line of Activity</label>
                <input required type="text" className="w-full border border-slate-300 rounded p-2 text-sm" 
                  value={newUnit.lineOfActivity}
                  onChange={e => setNewUnit({...newUnit, lineOfActivity: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-xs font-medium text-slate-700 mb-1">Monthly Rent (₹)</label>
                 <input required type="number" className="w-full border border-slate-300 rounded p-2 text-sm" 
                   value={newUnit.monthlyRent}
                   onChange={e => setNewUnit({...newUnit, monthlyRent: Number(e.target.value)})}
                 />
              </div>
               <div>
                 <label className="block text-xs font-medium text-slate-700 mb-1">Employees</label>
                 <input required type="number" className="w-full border border-slate-300 rounded p-2 text-sm" 
                   value={newUnit.employeeCount}
                   onChange={e => setNewUnit({...newUnit, employeeCount: Number(e.target.value)})}
                 />
              </div>
               <div>
                 <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                 <input required type="text" className="w-full border border-slate-300 rounded p-2 text-sm" 
                   value={newUnit.contactPhone}
                   onChange={e => setNewUnit({...newUnit, contactPhone: e.target.value})}
                 />
              </div>
               <div>
                 <label className="block text-xs font-medium text-slate-700 mb-1">Contact Email</label>
                 <input required type="email" className="w-full border border-slate-300 rounded p-2 text-sm" 
                   value={newUnit.contactEmail}
                   onChange={e => setNewUnit({...newUnit, contactEmail: e.target.value})}
                 />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-sm">Cancel</button>
                 <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm">
                   {userRole === UserRole.ADMIN ? 'Create Unit' : 'Submit Registration'}
                 </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search units or proprietors..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
             <select 
               className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
               value={estateFilter}
               onChange={e => setEstateFilter(e.target.value)}
             >
               <option value="all">All Estates</option>
               {estates.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
             </select>
          </div>

          <div className="relative">
             <select 
               className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
               value={statusFilter}
               onChange={e => setStatusFilter(e.target.value)}
             >
               <option value="all">All Rent Statuses</option>
               <option value="PAID">Paid</option>
               <option value="PENDING">Pending</option>
               <option value="OVERDUE">Overdue</option>
             </select>
          </div>
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Unit Name</th>
              <th className="px-6 py-3">Estate</th>
              <th className="px-6 py-3">Proprietor</th>
              <th className="px-6 py-3">Activity</th>
              <th className="px-6 py-3">Rent Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUnits.map(unit => (
              <tr key={unit.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-900">{unit.name}</td>
                <td className="px-6 py-4 text-slate-600">
                  {estates.find(e => e.id === unit.estateId)?.name}
                </td>
                <td className="px-6 py-4 text-slate-600">{unit.proprietorName}</td>
                <td className="px-6 py-4 text-slate-600">{unit.lineOfActivity}</td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit
                    ${unit.rentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                      unit.rentStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'}`}>
                    {getRentStatusIcon(unit.rentStatus)}
                    {unit.rentStatus}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onSelectUnit(unit)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUnits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No units found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
