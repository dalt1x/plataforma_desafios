from sqlalchemy.orm import Session
from . import models, utils

def criar_usuario(db: Session, nome: str, email: str, senha: str):
    senha_hash = utils.hash_senha(senha)
    novo_usuario = models.Usuario(nome=nome, email=email, senha_hash=senha_hash)
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

def autenticar_usuario(db: Session, email: str, senha: str):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if usuario and utils.verificar_senha(senha, usuario.senha_hash):
        return usuario
    return None

def deletar_usuario(db: Session, usuario_id: int):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario:
        db.delete(usuario)
        db.commit()
        return True
    return False

def criar_problema(db: Session, problema):
    novo = models.Problema(**problema.dict())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def deletar_problema(db: Session, problema_id: int):
    problema = db.query(models.Problema).filter(models.Problema.id == problema_id).first()
    if problema:
        db.delete(problema)
        db.commit()
        return True
    return False

def listar_problemas(db: Session, nivel: str = None, tema: str = None):
    query = db.query(models.Problema)
    if nivel:
        query = query.filter(models.Problema.nivel == nivel)
    if tema:
        query = query.filter(models.Problema.tema == tema)
    return query.all()

def processar_resposta(db: Session, user_id: int, problem_id: int, resposta: str):
    problema = db.query(models.Problema).filter(models.Problema.id == problem_id).first()
    usuario = db.query(models.Usuario).filter(models.Usuario.id == user_id).first()

    if not problema or not usuario:
        return None

    correta = utils.validar_resposta(resposta, problema.resposta_esperada, problema.tipo)
    pontos = utils.calcular_pontos(problema.nivel)
    resultado = "Correta" if correta else "Incorreta"

    if correta:
        usuario.score += pontos

    submissao = models.Submissao(
        user_id=user_id,
        problem_id=problem_id,
        resposta_usuario=resposta,
        resultado=resultado
    )
    db.add(submissao)
    db.commit()
    return {"resultado": resultado, "pontos": pontos if correta else 0, "score_atual": usuario.score}

def get_ranking(db: Session):
    return db.query(models.Usuario).order_by(models.Usuario.score.desc()).limit(10).all()