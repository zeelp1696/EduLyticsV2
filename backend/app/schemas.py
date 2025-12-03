# app/schemas.py
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- User Schemas ----------

class UserBase(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    mobile_number: Optional[str] = None
    account_type: Optional[str] = None  # 'personal', 'student', 'teacher', 'admin'


class UserCreate(UserBase):
    password: str = Field(min_length=6, description="User password (will be hashed)")


class UserRead(UserBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Auth Schemas ----------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[UUID] = None


# ---------- Course Schemas ----------

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseRead(CourseBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CoursesList(BaseModel):
    courses: List[CourseRead]


# ---------- Task Schemas ----------

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: Optional[UUID] = None
    due_at: Optional[datetime] = None
    estimated_minutes: Optional[int] = None
    priority: int = 0  # higher = more important


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    course_id: Optional[UUID] = None
    due_at: Optional[datetime] = None
    estimated_minutes: Optional[int] = None
    priority: Optional[int] = None
    status: Optional[str] = None  # 'pending', 'in_progress', 'completed', 'cancelled'


class TaskRead(TaskBase):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskList(BaseModel):
    tasks: List[TaskRead]


# ---------- Task Session Schemas ----------

class TaskSessionBase(BaseModel):
    start_at: datetime
    end_at: datetime
    source: Optional[str] = "manual"   # 'manual' or 'ai'
    status: Optional[str] = "planned"  # 'planned', 'completed', 'skipped'


class TaskSessionCreate(TaskSessionBase):
    pass


class TaskSessionRead(TaskSessionBase):
    id: UUID
    task_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskSessionList(BaseModel):
    sessions: List[TaskSessionRead]


# ---------- Institution Schemas ----------

class InstitutionBase(BaseModel):
    name: str
    code: Optional[str] = None


class InstitutionCreate(InstitutionBase):
    pass


class InstitutionRead(InstitutionBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InstitutionUserRead(BaseModel):
    id: UUID
    role: str
    created_at: datetime
    institution: InstitutionRead

    model_config = ConfigDict(from_attributes=True)


class InstitutionMemberships(BaseModel):
    memberships: List[InstitutionUserRead]


# ---------- Admin Schemas ----------

class AdminBase(BaseModel):
    name: str
    email: EmailStr
    institution_id: Optional[UUID] = None

class AdminCreate(AdminBase):
    password: str = Field(min_length=6)

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str  # "developer_admin" or "institution_admin"
    institution_id: Optional[UUID] = None
    institution_name: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse

class AddUserRequest(BaseModel):
    email: EmailStr
    mobile_number: str
    institution_id: UUID
    user_id: str  # unique ID within institution
    role: str  # "student" or "teacher"

class AssignStudentsRequest(BaseModel):
    teacher_id: UUID
    student_ids: List[UUID]

class TeacherResponse(BaseModel):
    id: UUID
    name: Optional[str]
    email: str
    
    model_config = ConfigDict(from_attributes=True)

class StudentResponse(BaseModel):
    id: UUID
    name: Optional[str]
    email: str
    
    model_config = ConfigDict(from_attributes=True)

class InstitutionResponse(BaseModel):
    id: UUID
    name: str
    code: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)