import React, { useState, useMemo } from 'react';
import { User, UserRole, Estate, Unit } from '../types';
import { Shield, UserPlus, Trash2, Edit2, Key, Building, Factory, X, Check, Search, Filter, UserCheck, UserX } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  estates: Estate[];
  units: Unit[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  estates, 
  units, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      
      let matchesAssignment = true;
      if (assignmentFilter !== 'ALL') {
        const hasAssignment = 
          user.role === UserRole.ADMIN || 
          (user.role === UserRole.MANAGER && user.assignedEstateIds && user.assignedEstateIds.length > 0) ||
          (user.role === UserRole.UNIT_HOLDER && user.assignedUnitId);
        
        matchesAssignment = assignmentFilter === 'ASSIGNED' ? !!hasAssignment : !hasAssignment;
      }

      return matchesSearch && matchesRole && matchesAssignment;
    });
  }, [users, searchTerm, roleFilter, assignmentFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === UserRole.ADMIN).length,
    managers: users.filter(u => u.role === UserRole.MANAGER).length,
    holders: users.filter(u => u.role === UserRole.UNIT_HOLDER).length,
  }), [users]);

  const handleOpenModal = (user?: User) => {
    setCurrentUser(user || {
      id: `u${Date.now()}`,
      username: '',
      password: '',
      name: '',
      role: UserRole.UNIT_HOLDER,
      assignedEstateIds: [],
      assignedUnitId: ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentUser?.username || !currentUser?.name) {
      alert("Username and Name are required.");
      return;
    }
    
    const userToSave = currentUser as User;
    const exists = users.find(u => u.id === userToSave.id);
    
    if (exists) {
      onUpdateUser(userToSave);
    } else {
      onAddUser(userToSave);
    }
    setIsEditing(false);
    setCurrentUser(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage system credentials, roles, and assignments.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      {/* Stats Chips */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-2">
          <Shield className="w-3 h-3 text-blue-500" /> Total: {stats.total}
        </div>
        <div className="bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-700 shadow-sm flex items-center gap-2">
          Admins: {stats.admins}
        </div>
        <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700 shadow-sm flex items-center gap-2">
          Managers: {stats.managers}
        </div>
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-2">
          Holders: {stats.holders}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or username..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-40">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <select 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value={UserRole.ADMIN}>Administrators</option>
              <option value={UserRole.MANAGER}>Managers</option>
              <option value={UserRole.UNIT_HOLDER}>Holders</option>
            </select>
          </div>

          <div className="relative flex-1 md:w-48">
            <select 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500"
              value={assignmentFilter}
              onChange={e => setAssignmentFilter(e.target.value as any)}
            >
              <option value="ALL">Assignment: Any</option>
              <option value="ASSIGNED">Assigned Only</option>
              <option value="UNASSIGNED">Unassigned Only</option>
            </select>
          </div>
        </div>

        {(searchTerm || roleFilter !== 'ALL' || assignmentFilter !== 'ALL') && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('ALL');
              setAssignmentFilter('ALL');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status & Assignments</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? filteredUsers.map(user => {
              const hasAssignment = 
                user.role === UserRole.ADMIN || 
                (user.role === UserRole.MANAGER && user.assignedEstateIds && user.assignedEstateIds.length > 0) ||
                (user.role === UserRole.UNIT_HOLDER && user.assignedUnitId);

              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">UID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 text-xs">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      user.role === UserRole.MANAGER ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${hasAssignment ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {hasAssignment ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        {hasAssignment ? 'Active Assignment' : 'No Assignment'}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        {user.role === UserRole.MANAGER && (
                          <><Building className="w-3 h-3" /> {user.assignedEstateIds?.length || 0} Estates</>
                        )}
                        {user.role === UserRole.UNIT_HOLDER && (
                          <><Factory className="w-3 h-3" /> {units.find(u => u.id === user.assignedUnitId)?.name || 'None'}</>
                        )}
                        {user.role === UserRole.ADMIN && 'Full System Access'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                        disabled={user.role === UserRole.ADMIN && users.filter(u => u.role === UserRole.ADMIN).length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Search className="w-10 h-10 opacity-20" />
                    <p className="font-medium">No users found matching your criteria</p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('ALL');
                        setAssignmentFilter('ALL');
                      }}
                      className="text-blue-600 text-xs hover:underline mt-1"
                    >
                      Reset all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && currentUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-down border border-white/20">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                {users.find(u => u.id === currentUser.id) ? 'Edit User Credentials' : 'Create New User Account'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
                    placeholder="Enter full name"
                    value={currentUser.name}
                    onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
                    placeholder="login_username"
                    value={currentUser.username}
                    onChange={e => setCurrentUser({...currentUser, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
                      value={currentUser.password}
                      placeholder="••••••••"
                      onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">System Role</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={currentUser.role}
                    onChange={e => setCurrentUser({...currentUser, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.ADMIN}>Administrator (Full Access)</option>
                    <option value={UserRole.MANAGER}>Estate Manager (Regional Access)</option>
                    <option value={UserRole.UNIT_HOLDER}>Unit Holder (Personal Access)</option>
                  </select>
                </div>

                {currentUser.role === UserRole.MANAGER && (
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Estates</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border border-slate-100 rounded-lg bg-slate-50">
                      {estates.map(estate => (
                        <label key={estate.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                          <input 
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={currentUser.assignedEstateIds?.includes(estate.id)}
                            onChange={e => {
                              const current = currentUser.assignedEstateIds || [];
                              const next = e.target.checked 
                                ? [...current, estate.id]
                                : current.filter(id => id !== estate.id);
                              setCurrentUser({...currentUser, assignedEstateIds: next});
                            }}
                          />
                          {estate.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {currentUser.role === UserRole.UNIT_HOLDER && (
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Industrial Unit</label>
                    <select 
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={currentUser.assignedUnitId}
                      onChange={e => setCurrentUser({...currentUser, assignedUnitId: e.target.value})}
                    >
                      <option value="">Select Unit...</option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name} ({estates.find(e => e.id === unit.estateId)?.name})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  <Check className="w-4 h-4" /> Save Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
