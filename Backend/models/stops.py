from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Float

class Stop(Base):
    __tablename__ = "stops"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), index=True, nullable=False)
    image_url = Column(String(255), index=True, nullable=True) 
    is_transfer = Column(Boolean, index=True, nullable=True)
    x = Column(Float, index=True, nullable=True)
    y = Column(Float, index=True, nullable=True)
    wheelchair_accessible = Column(Boolean, index=True, nullable=False)
    has_shelter = Column(Boolean, index=True, nullable=False)
    has_bench = Column(Boolean, index=True, nullable=True)
    has_ticket_machine = Column(Boolean, index=True, nullable=False)
    has_display = Column(Boolean, index=True, nullable=True)