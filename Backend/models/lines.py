from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Line(Base):
    __tablename__ = "lines"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    type = Column(String, index=True, nullable=False)
    colour = Column(String, index=True, nullable=False)

class Journey(Base):
    __tablename__ = "journeys"

    id = Column(Integer, primary_key=True, index=True)
    line_id = Column(Integer, ForeignKey("lines.id"), index=True, nullable=False) 
    direction = Column(String, index=True, nullable=False)

