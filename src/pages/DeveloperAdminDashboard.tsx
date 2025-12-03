import { useState } from 'react';
import { useAdminAuth, AdminRole } from '@/context/AdminAuthContext';
import AdminHeader from '@/components/admin-ui/AdminHeader';
import DeveloperSidebar from '@/components/admin-ui/DeveloperSidebar';
import AppPeople from '@/components/admin/AppPeople';
import ManageRoles from '@/components/admin/ManageRoles';
import Details from '@/components/admin/Details';
import InstitutionManagement from '@/components/admin/InstitutionManagement';
import DeveloperDashboardOverview from '@/components/admin/DeveloperDashboardOverview';

type TabType = 'overview' | 'app-people' | 'manage-roles' | 'details' | 'institution-management';

const DeveloperAdminDashboard = () => {
  const { admin, hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const isDeveloper = hasPermission([AdminRole.DEVELOPER_ADMIN]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <DeveloperSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 container mx-auto px-4 py-8">
          
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Developer Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome, {admin?.name} • Full Platform Access 🔐
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold text-sm">
                Platform Admin
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {activeTab === 'overview' && <DeveloperDashboardOverview />}
            {activeTab === 'app-people' && <AppPeople isDeveloper={true} />}
            {activeTab === 'manage-roles' && <ManageRoles isDeveloper={true} />}
            {activeTab === 'details' && <Details isDeveloper={true} />}
            {activeTab === 'institution-management' && <InstitutionManagement />}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DeveloperAdminDashboard;
