import { useAdminAuth } from '@/context/AdminAuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  role?: 'institution' | 'developer';
}

const AdminHeader = ({ role = 'institution' }: AdminHeaderProps) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <div>
          <h1 className="text-xl font-bold text-foreground">Edulytics</h1>
          <p className="text-xs text-muted-foreground">
            {role === 'developer' ? 'Developer Control Panel' : 'Institution Panel'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-foreground text-sm">{admin?.name}</p>
            <p className="text-xs text-muted-foreground">
              {admin?.role === 'developer_admin' ? 'Platform Admin' : 'Institution Admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground hover:text-foreground"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
