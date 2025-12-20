
import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Building, Factory, MessageSquare, Settings, LogOut, FileSignature, Bell, ClipboardList, Shield } from 'lucide-react';
import { UserRole, ViewState, Estate, Unit, User, ServiceRequest } from './types';
import { MOCK_ESTATES, MOCK_UNITS, MOCK_REQUESTS, MOCK_USERS } from './constants';
import { Dashboard } from './components/Dashboard';
import { EstateManager } from './components/EstateManager';
import { UnitList } from './components/UnitList';
import { UnitDetail } from './components/UnitDetail';
import { AIChat } from './components/AIChat';
import { RequestManager } from './components/RequestManager';
import { UserManagement } from './components/UserManagement';
import { Login } from './components/Login';

// Utility for persistence
const STORAGE_KEY = 'sicop_estate_manager_v2';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  
  // Data State
  const [estates, setEstates] = useState<Estate[]>(MOCK_ESTATES);
  const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // --- Persistence Logic ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.estates) setEstates(parsed.estates);
        if (parsed.units) setUnits(parsed.units);
        if (parsed.requests) setRequests(parsed.requests);
        if (parsed.users) setUsers(parsed.users);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        estates, units, requests, users
      }));
    }
  }, [estates, units, requests, users, isLoaded]);

  // --- Auth Handlers ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.UNIT_HOLDER && user.assignedUnitId) {
      const unit = units.find(u => u.id === user.assignedUnitId);
      if (unit) {
        setSelectedUnit(unit);
        setCurrentView('UNIT_DETAIL');
      }
    } else {
      setCurrentView('DASHBOARD');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUnit(null);
    setCurrentView('DASHBOARD');
  };

  // --- Permission & Data Logic ---
  
  // 1. Filter Estates
  const visibleEstates = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return estates;
    
    if (currentUser.role === UserRole.MANAGER && currentUser.assignedEstateIds) {
      return estates.filter(e => currentUser.assignedEstateIds?.includes(e.id));
    }

    if (currentUser.role === UserRole.UNIT_HOLDER && currentUser.assignedUnitId) {
       const userUnit = units.find(u => u.id === currentUser.assignedUnitId);
       return userUnit ? estates.filter(e => e.id === userUnit.estateId) : [];
    }
    
    return [];
  }, [currentUser, estates, units]);

  // 2. Filter Units
  const visibleUnits = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return units;

    if (currentUser.role === UserRole.MANAGER) {
      const estateIds = visibleEstates.map(e => e.id);
      return units.filter(u => estateIds.includes(u.estateId));
    }

    if (currentUser.role === UserRole.UNIT_HOLDER && currentUser.assignedUnitId) {
      return units.filter(u => u.id === currentUser.assignedUnitId);
    }

    return [];
  }, [currentUser, visibleEstates, units]);

  // 3. Requests Logic
  const visibleRequests = useMemo(() => {
      if (!currentUser) return [];
      
      if (currentUser.role === UserRole.ADMIN) {
          return requests;
      }
      
      if (currentUser.role === UserRole.MANAGER) {
          const estateIds = visibleEstates.map(e => e.id);
          return requests.filter(r => r.estateId && estateIds.includes(r.estateId));
      }

      if (currentUser.role === UserRole.UNIT_HOLDER) {
          return requests.filter(r => r.targetId === currentUser.assignedUnitId);
      }
      return [];
  }, [currentUser, requests, visibleEstates]);

  // 4. Notification Badges (FIXED PERSISTENCE ISSUE HERE)
  const pendingCount = useMemo(() => {
      if (!currentUser) return 0;
      if (currentUser.role === UserRole.ADMIN) {
          // Admin sees items that are forwarded or direct system requests that are still PENDING
          return requests.filter(r => 
            (r.status === 'FORWARDED_TO_ADMIN' || r.status === 'PENDING')
          ).length;
      }
      if (currentUser.role === UserRole.MANAGER) {
          return visibleRequests.filter(r => r.status === 'SUBMITTED_TO_MANAGER').length;
      }
      return 0;
  }, [currentUser, requests, visibleRequests]);


  // --- Action Handlers ---

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setCurrentView('UNIT_DETAIL');
  };

  const handleAddEstate = (newEstate: Estate) => {
    setEstates([...estates, newEstate]);
  };

  const handleEditEstate = (updatedEstate: Estate) => {
    setEstates(estates.map(e => e.id === updatedEstate.id ? updatedEstate : e));
  };

  const handleDeleteEstate = (id: string) => {
    if (confirm('Are you sure you want to delete this estate? This action cannot be undone.')) {
        setEstates(estates.filter(e => e.id !== id));
    }
  };

  const handleAddUnit = (newUnit: Unit) => {
    setUnits([...units, newUnit]);
  }

  const handleUpdateUnit = (updatedUnit: Unit) => {
    setUnits(units.map(u => u.id === updatedUnit.id ? updatedUnit : u));
    if (selectedUnit?.id === updatedUnit.id) {
      setSelectedUnit(updatedUnit);
    }
  };

  const handleAddRequest = (requestData: Partial<ServiceRequest>) => {
     const newReq: ServiceRequest = {
       id: `req${Date.now()}`,
       targetId: requestData.targetId!,
       targetName: requestData.targetName || 'Unknown',
       estateId: requestData.estateId,
       type: requestData.type!,
       description: requestData.description!,
       status: requestData.status || 'PENDING',
       requestDate: new Date().toISOString().split('T')[0],
       requesterRole: currentUser?.role || UserRole.UNIT_HOLDER,
       payload: requestData.payload,
       documentName: requestData.documentName
     };
     setRequests([...requests, newReq]);
  };

  const handleForwardRequest = (id: string, remarks: string) => {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'FORWARDED_TO_ADMIN', managerRemarks: remarks } : req
      ));
  }

  const handleApproveRequest = (request: ServiceRequest) => {
    // 1. Update Request Status
    setRequests(requests.map(req => 
      req.id === request.id ? { ...req, status: 'APPROVED' } : req
    ));

    // 2. Apply Changes based on Type and Payload
    if (request.type === 'NEW_UNIT' && request.payload) {
        setUnits([...units, { ...request.payload, id: `u${Date.now()}` }]);
        alert('Request Approved: New Unit Created.');
    } 
    else if (request.type === 'ESTATE_EDIT' && request.payload) {
        setEstates(estates.map(e => e.id === request.targetId ? { ...request.payload } : e));
        alert('Request Approved: Estate Updated.');
    }
    else if (request.payload) {
        setUnits(units.map(u => u.id === request.targetId ? { ...u, ...request.payload } : u));
        alert('Request Approved: Unit Details Updated.');
    }
  };

  const handleRejectRequest = (id: string, comments: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'REJECTED', comments } : req
    ));
  };


  // --- Render Helpers ---

  const NavItem = ({ view, icon, label, badge }: { view: ViewState, icon: React.ReactNode, label: string, badge?: number }) => (
    <button
      onClick={() => {
        if (view === 'UNITS' && currentUser?.role === UserRole.UNIT_HOLDER) {
           const unit = visibleUnits[0];
           if (unit) handleUnitSelect(unit);
        } else {
           setSelectedUnit(null);
           setCurrentView(view);
        }
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 relative
        ${currentView === view && !selectedUnit 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {badge ? (
        <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
        </span>
      ) : null}
    </button>
  );

  // --- Main Render ---

 if (!currentUser) {
return <Login onLogin={handleLogin} users={users} />;
}

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50">S</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SICOP</h1>
              <p className="text-xs text-slate-400">Estate Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">Menu</p>
          <NavItem view="DASHBOARD" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          
          {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER) && (
            <>
              <NavItem view="ESTATES" icon={<Building size={20} />} label="Estates" />
              <NavItem view="UNITS" icon={<Factory size={20} />} label="Units" />
            </>
          )}

          {currentUser.role === UserRole.UNIT_HOLDER && (
             <button
               onClick={() => {
                 if (visibleUnits.length > 0) handleUnitSelect(visibleUnits[0]);
               }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1
                 ${currentView === 'UNIT_DETAIL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
             >
               <Factory size={20} />
               <span className="font-medium">My Unit</span>
             </button>
          )}

          {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER) && (
             <NavItem 
                view="REQUESTS" 
                icon={currentUser.role === UserRole.ADMIN ? <Bell size={20} /> : <ClipboardList size={20} />} 
                label={currentUser.role === UserRole.ADMIN ? "Approvals" : "Requests"} 
                badge={pendingCount > 0 ? pendingCount : undefined}
            />
          )}

          {currentUser.role === UserRole.ADMIN && (
             <NavItem 
                view="USER_MANAGEMENT" 
                icon={<Shield size={20} />} 
                label="Users" 
             />
          )}

          <NavItem view="AI_ASSISTANT" icon={<MessageSquare size={20} />} label="AI Assistant" />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
           <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
               {currentUser.name.split(' ').map(n => n[0]).join('')}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium truncate">{currentUser.name}</p>
               <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role.toLowerCase().replace('_', ' ')}</p>
             </div>
             <button onClick={handleLogout} title="Logout">
                <LogOut size={16} className="text-slate-500 cursor-pointer hover:text-white" />
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between sticky top-0 z-20">
           <h2 className="text-xl font-semibold text-slate-800 capitalize">
             {currentView === 'UNIT_DETAIL' ? 'Unit Details' : currentView.toLowerCase().replace('_', ' ')}
           </h2>
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <Settings size={20} />
              </button>
           </div>
        </header>

        <div className="p-8 flex-1 bg-slate-50">
          {currentView === 'DASHBOARD' && (
            <Dashboard units={visibleUnits} estates={visibleEstates} />
          )}

          {currentView === 'ESTATES' && (
            <EstateManager 
              estates={visibleEstates} 
              onAddEstate={handleAddEstate}
              onEditEstate={handleEditEstate}
              onDeleteEstate={handleDeleteEstate}
              onRequestChange={handleAddRequest}
              userRole={currentUser.role}
            />
          )}

          {currentView === 'UNITS' && (
            <UnitList 
              units={visibleUnits} 
              estates={visibleEstates} 
              onSelectUnit={handleUnitSelect}
              onAddUnit={handleAddUnit}
              onRequestAddUnit={handleAddRequest}
              userRole={currentUser.role}
            />
          )}

          {currentView === 'UNIT_DETAIL' && selectedUnit && (
            <UnitDetail 
              unit={selectedUnit} 
              estate={estates.find(e => e.id === selectedUnit.estateId)}
              userRole={currentUser.role}
              requests={requests}
              onUpdateUnit={handleUpdateUnit}
              onRequestAdd={handleAddRequest}
              onRequestUpdate={(id, status, comments) => {
                  if (status === 'REJECTED') handleRejectRequest(id, comments || '');
              }}
              onBack={() => {
                if (currentUser.role === UserRole.UNIT_HOLDER) {
                   setCurrentView('DASHBOARD');
                   setSelectedUnit(null);
                } else {
                   setSelectedUnit(null);
                   setCurrentView('UNITS');
                }
              }}
            />
          )}

          {currentView === 'REQUESTS' && (
             <RequestManager 
                requests={visibleRequests} 
                users={users}
                onApprove={handleApproveRequest}
                onForward={handleForwardRequest}
                onReject={handleRejectRequest}
                userRole={currentUser.role}
             />
          )}

          {currentView === 'USER_MANAGEMENT' && currentUser.role === UserRole.ADMIN && (
             <UserManagement 
                users={users}
                estates={estates}
                units={units}
                onAddUser={(nu) => setUsers([...users, nu])}
                onUpdateUser={(uu) => setUsers(users.map(u => u.id === uu.id ? uu : u))}
                onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))}
             />
          )}

          {currentView === 'AI_ASSISTANT' && (
            <div className="h-[calc(100vh-10rem)]">
              <AIChat estates={visibleEstates} units={visibleUnits} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
