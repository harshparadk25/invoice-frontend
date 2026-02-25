import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Shield,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/organizations', label: 'Organizations', icon: Building2 },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminSecret');
    navigate('/admin/login');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-dark-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-65 shrink-0 bg-dark-900 flex flex-col transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-dark-700/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-linear-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">Admin Panel</span>
          </div>
          <button className="lg:hidden p-1 text-dark-400 rounded-md hover:bg-dark-800" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-dark-700/80 text-white'
                    : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
                }`
              }
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-dark-700/60 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] text-red-400 hover:bg-dark-800 transition-colors"
          >
            <LogOut size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 shrink-0 bg-white border-b border-dark-200/60 flex items-center px-5 lg:px-8 gap-3">
          <button className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-dark-50 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-dark-600" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
            <Shield size={14} className="text-red-600" />
            <span className="text-[13px] font-medium text-red-700">Admin</span>
          </div>
        </header>

        {/* Page Content - scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-5 lg:p-8 max-w-350 mx-auto w-full">
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
