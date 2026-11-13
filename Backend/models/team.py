from sqlalchemy import Column, Integer, String
from database import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=False, index=True, nullable=False)
    member1 = Column(String, unique=False, index=True, nullable=False)
    member2 = Column(String, unique=False, index=True, nullable=False)
    