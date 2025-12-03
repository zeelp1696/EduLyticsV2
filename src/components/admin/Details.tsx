import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { GlassCard } from '@/components/GlassCard';

interface DetailsProps {
  isDeveloper?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  status: 'active' | 'inactive';
  last_login: string;
  institution_name: string;
}

const Details = ({ isDeveloper = false }: DetailsProps) => {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<'all' | 'teacher' | 'student'>('all');
  const [filterInstitution, setFilterInstitution] = useState<string>('all');
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const url = isDeveloper
          ? 'http://localhost:8000/api/admin/users?all=true'
          : `http://localhost:8000/api/admin/users?institution_id=${admin?.institution_id}`;
        
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data);

        // Extract unique institutions for developer
        if (isDeveloper) {
          const instNames = [...new Set(data.map((u: User) => u.institution_name))];
          setInstitutions(instNames);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [admin?.institution_id, isDeveloper]);

  let filteredUsers = users;
  
  if (filterRole !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.role === filterRole);
  }
  
  if (isDeveloper && filterInstitution !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.institution_name === filterInstitution);
  }

  return (
    <GlassCard hover>
      <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Active Users</h2>
          <p className="text-muted-foreground">
            Total: {filteredUsers.length} users
          </p>
        </div>
        <div className="flex gap-2">
          {isDeveloper && (
            <select
              value={filterInstitution}
              onChange={(e) => setFilterInstitution(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm"
            >
              <option value="all">All Institutions</option>
              {institutions.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          )}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option value="all">All Users</option>
            <option value="teacher">Teachers Only</option>
            <option value="student">Students Only</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Email</th>
                {isDeveloper && (
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Institution</th>
                )}
                <th className="text-left py-4 px-4 font-semibold text-foreground">Role</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-card transition">
                  <td className="py-4 px-4 text-foreground font-medium">{user.name}</td>
                  <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                  {isDeveloper && (
                    <td className="py-4 px-4 text-muted-foreground text-sm">{user.institution_name}</td>
                  )}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'teacher'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
};

export default Details;
