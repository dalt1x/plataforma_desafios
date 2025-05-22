from pydantic import BaseModel
from typing import Optional

class Resposta(BaseModel):
    user_id: int
    problem_id: int
    resposta: str

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class ProblemaCreate(BaseModel):
    titulo: str
    enunciado: str
    nivel: str
    tema: str
    tipo: str
    resposta_esperada: str

class LoginRequest(BaseModel):
    email: str
    senha: str

class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: str
    score: int

    class Config:
        from_attributes = True

class ProblemaOut(BaseModel):
    id: int
    titulo: str
    enunciado: str
    nivel: str
    tema: str
    tipo: str

    class Config:
        from_attributes = True