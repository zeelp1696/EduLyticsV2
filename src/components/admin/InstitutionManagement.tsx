import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  created_at: string;
}

const InstitutionManagement = () => {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/institutions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to create institution');

      toast({
        title: 'Success',
        description: 'Institution created successfully!',
      });

      setForm({ name: '', address: '', city: '', phone: '', email: '' });
      setShowForm(false);
      fetchInstitutions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create institution',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <GlassCard>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Institution Management
            </h2>
            <p className="text-muted-foreground">
              Manage all institutions across the platform
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            New Institution
          </button>
        </div>
      </GlassCard>

      {/* Add Institution Form */}
      {showForm && (
        <GlassCard hover>
          <h3 className="text-xl font-bold text-foreground mb-6">Create New Institution</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Institution Name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})}
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({...form, city: e.target.value})}
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-primary-foreground font-semibold py-2 rounded-lg transition"
              >
                {isLoading ? 'Creating...' : 'Create Institution'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-secondary hover:bg-secondary-hover text-foreground font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Institutions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {institutions.map(inst => (
          <GlassCard key={inst.id} hover>
            <h3 className="text-lg font-bold text-foreground mb-2">{inst.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{inst.address}, {inst.city}</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> {inst.email}</p>
              <p><span className="font-medium">Phone:</span> {inst.phone}</p>
              <p><span className="font-medium">Created:</span> {new Date(inst.created_at).toLocaleDateString()}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default InstitutionManagement;
