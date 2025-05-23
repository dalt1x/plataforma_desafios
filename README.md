# Plataforma de Desafios

Plataforma web para gerenciamento e resolução de desafios, com ranking e autenticação de usuários.

## Tecnologias Utilizadas

### Backend
- **Python**
- **FastAPI** – framework web assíncrono
- **SQLAlchemy** – ORM para interação com o banco de dados
- **SQLite** – banco de dados relacional leve
- **Uvicorn** – servidor ASGI para FastAPI
- **Pydantic** – validação de dados
- **OAuth2 com JWT usando python-jose e passlib** - Autenticação

### Frontend
- **HTML5**
- **JavaScript Vanilla (sem frameworks como React/Vue)**
- **Uso básico de redirecionamentos via script**
- **CSS3**

## Estrutura do Projeto

```
plataforma_desafios-master/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── utils.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── desafios.html
│   ├── ranking.html
│   └── js/
│
└── README.md
```

🌐 Acesse o site: [Clique aqui para acessar o site publicado](https://plataforma-desafios.vercel.app/login.html)

---

**Projeto acadêmico - UNIG/EAD - 2025**