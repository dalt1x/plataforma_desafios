import re
import hashlib

def validar_resposta(resposta_usuario: str, resposta_esperada: str, tipo: str) -> bool:
    if tipo == "texto":
        return bool(re.fullmatch(resposta_esperada, resposta_usuario.strip()))
    elif tipo == "escolha":
        return resposta_usuario.strip().lower() == resposta_esperada.lower()
    return False

def calcular_pontos(nivel: str) -> int:
    return 5 if nivel == "facil" else 10 if nivel == "medio" else 20

def hash_senha(senha: str) -> str:
    return hashlib.sha256(senha.encode()).hexdigest()

def verificar_senha(senha: str, senha_hash: str) -> bool:
    return hash_senha(senha) == senha_hash