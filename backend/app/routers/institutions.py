# app/routers/institutions.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, get_current_user

router = APIRouter(prefix="/institutions", tags=["institutions"])


@router.post("/", response_model=schemas.InstitutionRead, status_code=status.HTTP_201_CREATED)
def create_institution(
    inst_in: schemas.InstitutionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Optionally you could enforce unique code here
    if inst_in.code:
        existing = (
            db.query(models.Institution)
            .filter(models.Institution.code == inst_in.code)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Institution code already in use")

    inst = models.Institution(
        name=inst_in.name,
        code=inst_in.code,
    )
    db.add(inst)
    db.commit()
    db.refresh(inst)

    membership = models.InstitutionUser(
        user_id=current_user.id,
        institution_id=inst.id,
        role="admin",
    )
    db.add(membership)

    # Upgrade account_type if needed
    if not current_user.account_type or current_user.account_type == "personal":
        current_user.account_type = "admin"
        db.add(current_user)

    db.commit()
    db.refresh(inst)
    return inst


@router.get("/my", response_model=schemas.InstitutionMemberships)
def list_my_institutions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    memberships = (
        db.query(models.InstitutionUser)
        .filter(models.InstitutionUser.user_id == current_user.id)
        .all()
    )
    return {"memberships": memberships}
