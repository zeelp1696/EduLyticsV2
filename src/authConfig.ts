// src/authConfig.ts
export type UserMode = 'institution' | 'personal';
export type UserRole = 'student' | 'teacher' | 'admin';

export interface DemoUser {
  email: string;
  password: string;
  mode: UserMode;
  role: UserRole;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'student.xyz@academy.edu',
    password: 'DemoStudent123!',
    mode: 'institution',
    role: 'student',
  },
  {
    email: 'teacher.xyz@academy.edu',
    password: 'DemoTeacher123!',
    mode: 'institution',
    role: 'teacher',
  },
  {
    email: 'demo.personal@edulytics.app',
    password: 'DemoPersonal123!',
    mode: 'personal',
    role: 'student',
  },
];
