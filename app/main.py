from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import HTMLResponse
from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# Dependência de sessão DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/usuarios", response_model=schemas.UsuarioOut)
def criar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.criar_usuario(db, usuario.nome, usuario.email, usuario.senha)

@app.post("/problemas")
def criar_problema(problema: schemas.ProblemaCreate, db: Session = Depends(get_db)):
    return crud.criar_problema(db, problema)

@app.get("/api/problemas")
def listar_problemas(nivel: str = Query(None), tema: str = Query(None), db: Session = Depends(get_db)):
    return crud.listar_problemas(db, nivel, tema)

@app.post("/responder")
def responder(resposta: schemas.Resposta, db: Session = Depends(get_db)):
    resultado = crud.processar_resposta(db, resposta.user_id, resposta.problem_id, resposta.resposta)
    if resultado is None:
        raise HTTPException(status_code=404, detail="Problema ou usuário não encontrado")
    return resultado

@app.get("/api/ranking", response_model=List[schemas.UsuarioOut])
def ranking(db: Session = Depends(get_db)):
    return crud.get_ranking(db)

