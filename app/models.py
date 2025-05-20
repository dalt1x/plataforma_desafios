from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Usuario(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    senha_hash = Column(String, nullable=False)
    score = Column(Integer, default=0)

class Problema(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    enunciado = Column(Text, nullable=False)
    nivel = Column(String)
    tema = Column(String)
    tipo = Column(String)
    resposta_esperada = Column(String)

class Submissao(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    resposta_usuario = Column(String)
    resultado = Column(String)
    data_envio = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("Usuario")
    problema = relationship("Problema")