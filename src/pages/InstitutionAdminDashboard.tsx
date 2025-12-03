import { useState } from 'react';
import { useAdminAuth, AdminRole } from '@/context/AdminAuthContext';
import AdminHeader from '@/components/admin-ui/AdminHeader';
import AdminSidebar from '@/components/admin-ui/AdminSidebar';
import AppPeople from '@/components/admin/AppPeople';
import ManageRoles from '@/components/admin/ManageRoles';
import Details from '@/components/admin/Details';

type TabType = 'app-people' | 'manage-roles' | 'details';

const InstitutionAdminDashboard = () => {
  const { admin, hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabType>('app-people');

  const isInstitutionAdmin = hasPermission([AdminRole.INSTITUTION_ADMIN]);

  if (!isInstitutionAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isDeveloper={false} />
        <main className="flex-1 container mx-auto px-4 py-8">
          
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Institution Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome, {admin?.name} • Managing: {admin?.institution_name}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {activeTab === 'app-people' && <AppPeople isDeveloper={false} />}
            {activeTab === 'manage-roles' && <ManageRoles isDeveloper={false} />}
            {activeTab === 'details' && <Details isDeveloper={false} />}
          </div>

        </main>
      </div>
    </div>
  );
};

export default InstitutionAdminDashboard;
