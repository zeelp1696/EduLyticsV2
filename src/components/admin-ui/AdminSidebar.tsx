import { Users, Settings, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDeveloper: boolean;
}

const AdminSidebar = ({ activeTab, setActiveTab, isDeveloper }: AdminSidebarProps) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'app-people', label: 'Add People', icon: Users },
    { id: 'manage-roles', label: 'Manage Roles', icon: Settings },
    { id: 'details', label: 'View Details', icon: Users },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border p-6 sticky top-0 h-screen overflow-y-auto">
      
      <h1 className="text-xl font-bold text-foreground mb-2">Edulytics Admin</h1>
      <p className="text-xs text-muted-foreground mb-8">Institution Control Panel</p>

      <nav className="space-y-2 mb-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border my-6"></div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

    </aside>
  );
};

export default AdminSidebar;
