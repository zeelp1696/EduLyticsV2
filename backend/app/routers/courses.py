# app/routers/courses.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("/", response_model=schemas.CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: schemas.CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    course = models.Course(
        user_id=current_user.id,
        title=course_in.title,
        description=course_in.description,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/", response_model=schemas.CoursesList)
def list_courses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    courses = (
        db.query(models.Course)
        .filter(models.Course.user_id == current_user.id)
        .order_by(models.Course.created_at.desc())
        .all()
    )
    return {"courses": courses}