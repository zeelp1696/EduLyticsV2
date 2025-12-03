import { useState } from 'react';
import { useAdminAuth, AdminRole } from '@/context/AdminAuthContext';
import { GlassCard } from '@/components/GlassCard';
import { useToast } from '@/hooks/use-toast';

interface AppPeopleProps {
  isDeveloper?: boolean;
}

interface AddPersonForm {
  email: string;
  mobile_number: string;
  institution_name: string;
  user_id: string;
  role: 'teacher' | 'student';
}

const AppPeople = ({ isDeveloper = false }: AppPeopleProps) => {
  const { admin, hasPermission } = useAdminAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AddPersonForm>({
    email: '',
    mobile_number: '',
    institution_name: admin?.institution_name || '',
    user_id: '',
    role: 'student',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to add user');

      toast({
        title: 'Success',
        description: `${form.role} added successfully!`,
      });

      setForm({
        email: '',
        mobile_number: '',
        institution_name: admin?.institution_name || '',
        user_id: '',
        role: 'student',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard hover>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Add People</h2>
        <p className="text-muted-foreground">
          Add new students and teachers to {isDeveloper ? 'any institution' : admin?.institution_name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="user@example.com"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mobile Number *</label>
          <input
            type="tel"
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+91 XXXXXXXXXX"
          />
        </div>

        {/* Institution Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Institution Name {!isDeveloper && '(Pre-filled)'}
          </label>
          <input
            type="text"
            name="institution_name"
            value={form.institution_name}
            onChange={handleInputChange}
            disabled={!isDeveloper}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            placeholder="Institution Name"
          />
        </div>

        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Institution User ID *</label>
          <input
            type="text"
            name="user_id"
            value={form.user_id}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Unique User ID"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-primary-foreground font-semibold py-2 rounded-lg transition duration-200"
          >
            {isLoading ? 'Adding...' : 'Add Person'}
          </button>
        </div>

      </form>
    </GlassCard>
  );
};

export default AppPeople;
