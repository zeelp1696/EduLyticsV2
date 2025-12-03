# app/models.py
from sqlalchemy import Column, String, DateTime, ForeignKey, text, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    # personal / student / teacher / admin (or None for old rows)
    account_type = Column(String, nullable=True, server_default=text("'personal'"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    courses = relationship("Course", back_populates="owner")
    institution_memberships = relationship("InstitutionUser", back_populates="user")
    tasks = relationship("Task", back_populates="owner")
    task_sessions = relationship("TaskSession", back_populates="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    owner = relationship("User", back_populates="courses")
    tasks = relationship("Task", back_populates="course")


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    name = Column(String, nullable=False)
    code = Column(String, nullable=True)  # you can make this unique later
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    members = relationship("InstitutionUser", back_populates="institution")


class InstitutionUser(Base):
    __tablename__ = "institution_users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    institution_id = Column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=False,
    )
    role = Column(String, nullable=False)  # 'student', 'teacher', 'admin'
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="institution_memberships")
    institution = relationship("Institution", back_populates="members")


class Task(Base):
    """
    High-level task (what needs to be done), linked to a user
    and optionally to a course.
    """
    __tablename__ = "tasks"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    course_id = Column(
        UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    # 'pending', 'in_progress', 'completed', 'cancelled'
    status = Column(String, nullable=False, server_default=text("'pending'"))
    priority = Column(Integer, nullable=False, server_default=text("0"))
    due_at = Column(DateTime(timezone=True), nullable=True)
    estimated_minutes = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    owner = relationship("User", back_populates="tasks")
    course = relationship("Course", back_populates="tasks")
    sessions = relationship("TaskSession", back_populates="task", cascade="all, delete-orphan")


class TaskSession(Base):
    """
    A scheduled time block for working on a task.
    Will be created either manually or by the AI agent.
    """
    __tablename__ = "task_sessions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    task_id = Column(
        UUID(as_uuid=True),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    start_at = Column(DateTime(timezone=True), nullable=False)
    end_at = Column(DateTime(timezone=True), nullable=False)
    # 'manual' or 'ai'
    source = Column(String, nullable=False, server_default=text("'manual'"))
    # 'planned', 'completed', 'skipped'
    status = Column(String, nullable=False, server_default=text("'planned'"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    task = relationship("Task", back_populates="sessions")
    user = relationship("User", back_populates="task_sessions")

class Admin(Base):
    """Admin users for admin dashboard"""
    __tablename__ = "admins"
    
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    
    # For institution admins: institution_id is set
    # For developer admins: institution_id is NULL
    institution_id = Column(
        UUID(as_uuid=True),
        ForeignKey("institutions.id", ondelete="CASCADE"),
        nullable=True,
    )
    
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    
    institution = relationship("Institution", foreign_keys=[institution_id])


class StudentTeacher(Base):
    """Junction table for student-teacher relationships"""
    __tablename__ = "student_teacher"
    
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=text("gen_random_uuid()"),
    )
    
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    
    teacher_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)