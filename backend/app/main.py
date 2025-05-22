from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi import FastAPI, HTTPException, Depends, Query, Path, status
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud
from .database import SessionLocal, engine
from fastapi import Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from .auth import criar_token_acesso, verificar_token

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.delete("/usuarios/{usuario_id}")
def deletar_usuario_endpoint(usuario_id: int = Path(..., title="O ID do usuário a ser deletado"), db: Session = Depends(get_db)):
    sucesso = crud.deletar_usuario(db, usuario_id=usuario_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return JSONResponse(content={"message": "Usuário deletado com sucesso"}, status_code=200)

@app.post("/problemas")
def criar_problema(problema: schemas.ProblemaCreate, db: Session = Depends(get_db)):
    return crud.criar_problema(db, problema)

@app.delete("/problemas/{problema_id}")
def deletar_problema_endpoint(problema_id: int = Path(..., title="O ID do problema a ser deletado"), db: Session = Depends(get_db)):
    sucesso = crud.deletar_problema(db, problema_id=problema_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Problema não encontrado")
    return JSONResponse(content={"message": "Problema deletado com sucesso"}, status_code=200)

@app.get("/api/problemas")
def listar_problemas(nivel: str = Query(None), tema: str = Query(None), db: Session = Depends(get_db)):
    return crud.listar_problemas(db, nivel, tema)

@app.get("/api/problemas/{problema_id}", response_model=schemas.ProblemaOut)
def obter_problema(problema_id: int, db: Session = Depends(get_db)):
    problema = db.query(models.Problema).filter(models.Problema.id == problema_id).first()
    if not problema:
        raise HTTPException(status_code=404, detail="Problema não encontrado")
    return problema

@app.post("/responder")
def responder(resposta: schemas.Resposta, db: Session = Depends(get_db)):
    resultado = crud.processar_resposta(db, resposta.user_id, resposta.problem_id, resposta.resposta)
    if resultado is None:
        raise HTTPException(status_code=404, detail="Problema ou usuário não encontrado")
    return resultado

@app.get("/api/ranking", response_model=List[schemas.UsuarioOut])
def ranking(db: Session = Depends(get_db)):
    return crud.get_ranking(db)

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = crud.autenticar_usuario(db, form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    token = criar_token_acesso({"sub": str(usuario.id)})
    return {"access_token": token, "token_type": "bearer", "usuario": usuario}
