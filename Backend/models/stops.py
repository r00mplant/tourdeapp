from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Float

class Stop(Base):
    __tablename__ = "stops"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), index=True, nullable=False)
    image_url = Column(String(255), index=True, nullable=False)
    is_transfer = Column(Boolean, index=True, nullable=False)
    x = Column(Float, index=True)
    y = Column(Float, index=True)
    wheelchair_accessible = Column(Boolean, index=True)
    has_shelter = Column(Boolean, index=True)
    has_bench = Column(Boolean, index=True)
    has_ticket_machine = Column(Boolean, index=True)
    has_display = Column(Boolean, index=True)