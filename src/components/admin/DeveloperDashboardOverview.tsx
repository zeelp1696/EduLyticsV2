import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';

const DeveloperDashboardOverview = () => {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        // Fetch institutions count
        const instRes = await fetch('http://localhost:8000/api/admin/institutions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const institutions = await instRes.json();

        // Fetch all users count
        const usersRes = await fetch('http://localhost:8000/api/admin/users?all=true', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await usersRes.json();

        const teachers = users.filter((u: any) => u.role === 'teacher').length;
        const students = users.filter((u: any) => u.role === 'student').length;

        setStats({
          totalInstitutions: institutions.length,
          totalUsers: users.length,
          totalTeachers: teachers,
          totalStudents: students,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Institutions', value: stats.totalInstitutions, color: 'bg-blue-100 text-blue-800' },
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-green-100 text-green-800' },
    { label: 'Total Teachers', value: stats.totalTeachers, color: 'bg-purple-100 text-purple-800' },
    { label: 'Total Students', value: stats.totalStudents, color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <GlassCard key={i} hover>
            <div className={`p-6 rounded-lg ${card.color}`}>
              <p className="text-sm font-medium opacity-75 mb-2">{card.label}</p>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover>
        <h3 className="text-xl font-bold text-foreground mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition">
            <p className="font-semibold text-blue-900">Add Users</p>
            <p className="text-sm text-blue-700">Add new teachers and students</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition">
            <p className="font-semibold text-green-900">Manage Roles</p>
            <p className="text-sm text-green-700">Assign students to teachers</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition">
            <p className="font-semibold text-purple-900">View Users</p>
            <p className="text-sm text-purple-700">See all active users</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition">
            <p className="font-semibold text-orange-900">Institutions</p>
            <p className="text-sm text-orange-700">Manage all institutions</p>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default DeveloperDashboardOverview;
