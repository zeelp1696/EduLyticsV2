# app/routers/tasks.py
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


# ---------- TASKS ----------

@router.post("/", response_model=schemas.TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Optional: validate course belongs to user
    if task_in.course_id:
        course = (
            db.query(models.Course)
            .filter(
                models.Course.id == task_in.course_id,
                models.Course.user_id == current_user.id,
            )
            .first()
        )
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found for this user",
            )

    task = models.Task(
        user_id=current_user.id,
        course_id=task_in.course_id,
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        due_at=task_in.due_at,
        estimated_minutes=task_in.estimated_minutes,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/", response_model=schemas.TaskList)
def list_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    course_id: Optional[UUID] = Query(default=None),
    status_filter: Optional[str] = Query(default=None),
):
    query = db.query(models.Task).filter(models.Task.user_id == current_user.id)

    if course_id:
        query = query.filter(models.Task.course_id == course_id)
    if status_filter:
        query = query.filter(models.Task.status == status_filter)

    tasks = query.order_by(models.Task.created_at.desc()).all()
    return {"tasks": tasks}


@router.get("/{task_id}", response_model=schemas.TaskRead)
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=schemas.TaskRead)
def update_task(
    task_id: UUID,
    task_in: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    data = task_in.dict(exclude_unset=True)

    # If course_id is being changed, validate ownership
    if "course_id" in data and data["course_id"]:
        course = (
            db.query(models.Course)
            .filter(
                models.Course.id == data["course_id"],
                models.Course.user_id == current_user.id,
            )
            .first()
        )
        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found for this user",
            )

    for field, value in data.items():
        setattr(task, field, value)

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


# ---------- TASK SESSIONS ----------

@router.post(
    "/{task_id}/sessions",
    response_model=schemas.TaskSessionRead,
    status_code=status.HTTP_201_CREATED,
)
def create_task_session(
    task_id: UUID,
    session_in: schemas.TaskSessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # ensure task belongs to user
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if session_in.end_at <= session_in.start_at:
        raise HTTPException(
            status_code=400,
            detail="end_at must be after start_at",
        )

    session = models.TaskSession(
        user_id=current_user.id,
        task_id=task.id,
        start_at=session_in.start_at,
        end_at=session_in.end_at,
        source=session_in.source or "manual",
        status=session_in.status or "planned",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get(
    "/{task_id}/sessions",
    response_model=schemas.TaskSessionList,
)
def list_task_sessions(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # ensure task belongs to user
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    sessions = (
        db.query(models.TaskSession)
        .filter(
            models.TaskSession.task_id == task_id,
            models.TaskSession.user_id == current_user.id,
        )
        .order_by(models.TaskSession.start_at.asc())
        .all()
    )
    return {"sessions": sessions}
