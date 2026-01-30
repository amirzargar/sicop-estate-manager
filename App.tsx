
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { UserDTO, UserRole } from './shared/types';
import { AuthUseCases } from './application/useCases/auth/AuthUseCases';

// Pages
import Dashboard from './ui/pages/Dashboard';
import EstateManager from './ui/pages/EstateManager';
import UnitManager from './ui/pages/UnitManager';
import UnitDetail from './ui/pages/UnitDetail';
import AIAssistant from './ui/pages/AIAssistant';
import Login from './ui/pages/Login';

// Icons
import { 
  LayoutDashboard, 
  Building2, 
  Box, 
  MessageSquareCode, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AuthContextType {
  user: UserDTO | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER] },
    { label: 'Estates', path: '/estates', icon: <Building2 size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { label: 'Units', path: '/units', icon: <Box size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER] },
    { label: 'AI Assistant', path: '/assistant', icon: <MessageSquareCode size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER, UserRole.UNIT_HOLDER] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">SICOP</h1>
            <p className="text-xs text-slate-400">Estate Manager</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[10px] uppercase text-blue-400 font-bold tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
             <span className="text-sm font-medium">Home</span>
             <ChevronRight size={16} />
             <span className="text-sm font-semibold text-slate-900 capitalize">
               {location.pathname.replace('/', '') || 'Dashboard'}
             </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: UserRole[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserDTO | null>(AuthUseCases.getCurrentUser());

  const handleLogin = async (email: string) => {
    const loggedUser = AuthUseCases.authenticate(email);
    if (loggedUser) {
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    AuthUseCases.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/estates" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER]}><EstateManager /></ProtectedRoute>} />
          <Route path="/units" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]}><UnitManager /></ProtectedRoute>} />
          <Route path="/unit/:id" element={<ProtectedRoute><UnitDetail /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
