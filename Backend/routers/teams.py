from fastapi import APIRouter, HTTPException
import fastapi
from fastapi import status
from schemes.team import TeamResponse, TeamCreate
from models import Team
from database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends


router = APIRouter(
    prefix="/api/v1/teams",
    tags=["Teams"]
)

@router.get("/", response_model=TeamResponse)
def get_team(response: fastapi.Response, db : Session = Depends(get_db)):

    team = db.query(Team).filter(Team.id == 1).first()

    if not team:
        raise fastapi.HTTPException(status_code=404, detail="Team not found")

    response.status_code = status.HTTP_200_OK
    return team

@router.get("/{team_id}", response_model=TeamResponse)
def get_team_by_id(team_id: int, response: fastapi.Response, db : Session = Depends(get_db)):

    team = db.query(Team).filter(Team.id == team_id).first()

    if not team:
        raise fastapi.HTTPException(status_code=404, detail="Team not found")

    response.status_code = status.HTTP_200_OK
    return team

@router.post("/", response_model=TeamResponse)
def create_team(team: TeamCreate, response: fastapi.Response, db : Session = Depends(get_db)):

    new_team = Team(
        name=team.name,
        member1=team.member1,
        member2=team.member2
    )

    try:
        db.add(new_team)
        db.commit()
        db.refresh(new_team)
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating team")

    response.status_code = status.HTTP_201_CREATED
    return new_team