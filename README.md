
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

## Como Executar o Backend

1. Acesse o diretório `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

4. Acesse a API no navegador ou via frontend:
   ```
   http://localhost:8000
   ```

## Observações

- O frontend pode ser aberto diretamente no navegador acessando os arquivos HTML.
- Para integração com o backend, certifique-se de que o servidor esteja rodando localmente.
