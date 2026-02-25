import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { path: '/dashboard/customers', label: 'Customers', icon: Users },
  { path: '/dashboard/members', label: 'Members', icon: UserCog },
  { path: '/dashboard/organization', label: 'Organization', icon: Building2 },
  { path: '/dashboard/templates', label: 'Templates', icon: Settings },
  
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
  <div className="h-screen w-screen overflow-hidden flex bg-slate-50 text-slate-800">
    {/* Mobile overlay */}
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </AnimatePresence>

    {/* Sidebar */}
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-out shadow-sm lg:shadow-none lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
            <Zap size={17} className="text-white" />
          </div>
          <span className="text-[16px] font-semibold tracking-tight">
            SimplifiIQ
          </span>
        </div>

        <button
          className="lg:hidden p-1.5 rounded-md hover:bg-slate-100"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} className="text-slate-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            <item.icon
              size={18}
              strokeWidth={1.8}
              className="opacity-90 group-hover:opacity-100"
            />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[13px] text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    {/* Main area */}
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center px-5 lg:px-8 gap-3 shadow-sm">
        <button
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} className="text-slate-600" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-medium leading-tight">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Dashboard
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-5 lg:p-8 max-w-[1600px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  </div>
);
}
