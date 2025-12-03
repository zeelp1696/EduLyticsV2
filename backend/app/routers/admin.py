# app/routers/admin.py
# Complete admin endpoints

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.deps import get_db, get_current_admin, get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/admin", tags=["admin"])

# =======================
# LOGIN
# =======================

@router.post("/login", response_model=schemas.AdminLoginResponse)
def admin_login(
    request: schemas.AdminLoginRequest,
    db: Session = Depends(get_db),
):
    """Admin login endpoint"""
    admin = db.query(models.Admin).filter(models.Admin.email == request.email).first()
    
    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive",
        )
    
    # Determine role based on institution_id
    role = "developer_admin" if admin.institution_id is None else "institution_admin"
    
    token = create_access_token({"sub": str(admin.id)})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": role,
            "institution_id": admin.institution_id,
            "institution_name": admin.institution.name if admin.institution else None,
            "created_at": admin.created_at,
        }
    }

# =======================
# ADD USER
# =======================

@router.post("/add-user")
def add_user(
    request: schemas.AddUserRequest,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Add new user (student/teacher)"""
    
    # Check permissions
    is_developer = current_admin.institution_id is None
    if not is_developer and current_admin.institution_id != request.institution_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot add users to other institutions",
        )
    
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    new_user = models.User(
        email=request.email,
        mobile_number=request.mobile_number,
        password_hash=get_password_hash("DefaultPassword123!"),  # Default password
        account_type=request.role,
        name=request.user_id,
    )
    
    db.add(new_user)
    db.flush()
    
    # Add to institution
    institution_user = models.InstitutionUser(
        user_id=new_user.id,
        institution_id=request.institution_id,
        role=request.role,
    )
    
    db.add(institution_user)
    db.commit()
    
    return {
        "message": f"{request.role.title()} added successfully",
        "user_id": str(new_user.id),
    }

# =======================
# ASSIGN STUDENTS TO TEACHER
# =======================

@router.post("/assign-students")
def assign_students(
    request: schemas.AssignStudentsRequest,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Assign students to a teacher"""
    
    teacher = db.query(models.User).filter(models.User.id == request.teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found",
        )
    
    # Check permissions
    is_developer = current_admin.institution_id is None
    if not is_developer:
        # Institution admin - verify teacher belongs to same institution
        teacher_inst = db.query(models.InstitutionUser).filter(
            models.InstitutionUser.user_id == request.teacher_id,
            models.InstitutionUser.institution_id == current_admin.institution_id,
        ).first()
        if not teacher_inst:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Teacher not in your institution",
            )
    
    # Assign students
    for student_id in request.student_ids:
        existing = db.query(models.StudentTeacher).filter(
            models.StudentTeacher.student_id == student_id,
            models.StudentTeacher.teacher_id == request.teacher_id,
        ).first()
        
        if not existing:
            assignment = models.StudentTeacher(
                student_id=student_id,
                teacher_id=request.teacher_id,
            )
            db.add(assignment)
    
    db.commit()
    
    return {
        "message": f"Assigned {len(request.student_ids)} students to teacher",
    }

# =======================
# GET TEACHERS
# =======================

@router.get("/teachers", response_model=list[schemas.TeacherResponse])
def get_teachers(
    institution_id: UUID = None,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Get teachers (filtered by institution if not developer)"""
    
    query = db.query(models.User).filter(
        models.User.account_type.in_(["teacher", "admin"])
    )
    
    is_developer = current_admin.institution_id is None
    
    if is_developer and institution_id:
        # Developer can filter by institution
        query = query.join(
            models.InstitutionUser,
            models.InstitutionUser.user_id == models.User.id,
        ).filter(
            models.InstitutionUser.institution_id == institution_id,
        )
    elif not is_developer:
        # Institution admin - only their institution
        query = query.join(
            models.InstitutionUser,
            models.InstitutionUser.user_id == models.User.id,
        ).filter(
            models.InstitutionUser.institution_id == current_admin.institution_id,
        )
    
    return query.all()

# =======================
# GET STUDENTS
# =======================

@router.get("/students", response_model=list[schemas.StudentResponse])
def get_students(
    institution_id: UUID = None,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Get students (filtered by institution if not developer)"""
    
    query = db.query(models.User).filter(
        models.User.account_type.in_(["student"])
    )
    
    is_developer = current_admin.institution_id is None
    
    if is_developer and institution_id:
        query = query.join(
            models.InstitutionUser,
            models.InstitutionUser.user_id == models.User.id,
        ).filter(
            models.InstitutionUser.institution_id == institution_id,
        )
    elif not is_developer:
        query = query.join(
            models.InstitutionUser,
            models.InstitutionUser.user_id == models.User.id,
        ).filter(
            models.InstitutionUser.institution_id == current_admin.institution_id,
        )
    
    return query.all()

# =======================
# GET ALL USERS
# =======================

@router.get("/users", response_model=list[schemas.UserRead])
def get_all_users(
    institution_id: UUID = None,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Get all users"""
    
    query = db.query(models.User)
    
    is_developer = current_admin.institution_id is None
    
    if is_developer and institution_id:
        query = query.join(
            models.InstitutionUser,
            models.InstitutionUser.user_id == models.User.id,
        ).filter(
            models.InstitutionUser.institution_id == institution_id,
        )
    elif not is_developer:
        query = query.join(
            models.InstitutionUser,
            models.InstitutionUser.user_id == models.User.id,
        ).filter(
            models.InstitutionUser.institution_id == current_admin.institution_id,
        )
    
    return query.all()

# =======================
# GET INSTITUTIONS
# =======================

@router.get("/institutions", response_model=list[schemas.InstitutionResponse])
def get_institutions(
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Get institutions (all for developer, only own for institution admin)"""
    
    if current_admin.institution_id is None:
        # Developer - get all
        return db.query(models.Institution).all()
    else:
        # Institution admin - get only own
        return [current_admin.institution]

# =======================
# CREATE INSTITUTION
# =======================

@router.post("/institutions", response_model=schemas.InstitutionResponse)
def create_institution(
    request: schemas.InstitutionCreate,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Create institution (developer only)"""
    
    if current_admin.institution_id is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only developer admins can create institutions",
        )
    
    new_institution = models.Institution(
        name=request.name,
        code=request.code,
    )
    
    db.add(new_institution)
    db.commit()
    db.refresh(new_institution)
    
    return new_institution
