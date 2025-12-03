import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { GlassCard } from '@/components/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

interface ManageRolesProps {
  isDeveloper?: boolean;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

const ManageRoles = ({ isDeveloper = false }: ManageRolesProps) => {
  const { admin } = useAdminAuth();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const institutionId = isDeveloper ? '' : admin?.institution_id;
        
        // Fetch teachers
        const teachersUrl = isDeveloper 
          ? 'http://localhost:8000/api/admin/teachers?all=true'
          : `http://localhost:8000/api/admin/teachers?institution_id=${institutionId}`;
        
        const teachersRes = await fetch(teachersUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const teachersData = await teachersRes.json();
        setTeachers(teachersData);

        // Fetch students
        const studentsUrl = isDeveloper 
          ? 'http://localhost:8000/api/admin/students?all=true'
          : `http://localhost:8000/api/admin/students?institution_id=${institutionId}`;
        
        const studentsRes = await fetch(studentsUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [admin?.institution_id, isDeveloper]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = async () => {
    if (!selectedTeacher || selectedStudents.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select a teacher and at least one student',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin/assign-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          teacher_id: selectedTeacher,
          student_ids: selectedStudents,
        }),
      });

      if (!response.ok) throw new Error('Assignment failed');

      toast({
        title: 'Success',
        description: `Assigned ${selectedStudents.length} student(s) to teacher`,
      });

      setSelectedTeacher('');
      setSelectedStudents([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign students',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard hover>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Manage Roles</h2>
        <p className="text-muted-foreground">
          Assign students to specific teachers for personalized learning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Select Teacher */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Step 1: Select Teacher</h3>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Choose a teacher...</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Select Students */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Step 2: Select Students ({selectedStudents.length} selected)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {students.map(student => (
                <button
                  key={student.id}
                  onClick={() => handleStudentToggle(student.id)}
                  className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-colors ${
                    selectedStudents.includes(student.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary-hover text-foreground'
                  }`}
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm opacity-70">{student.email}</p>
                  </div>
                  {selectedStudents.includes(student.id) && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleAssign}
          disabled={isLoading || !selectedTeacher || selectedStudents.length === 0}
          className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-primary-foreground font-semibold py-3 rounded-lg transition"
        >
          {isLoading ? 'Assigning...' : 'Assign Selected Students'}
        </button>
        <button
          onClick={() => {
            setSelectedTeacher('');
            setSelectedStudents([]);
          }}
          className="flex-1 bg-secondary hover:bg-secondary-hover text-foreground font-semibold py-3 rounded-lg transition"
        >
          Clear Selection
        </button>
      </div>
    </GlassCard>
  );
};

export default ManageRoles;
