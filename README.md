# Plataforma de Desafios de Lógica e Programação

Este projeto é uma plataforma web para prática de desafios de lógica e programação, com sistema de autenticação, submissão automática de soluções, ranking de usuários e interface web simples e funcional.

## Tecnologias Utilizadas

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Frontend**: HTML, CSS, JavaScript puro

## Funcionalidades

- Cadastro e login de usuários
- Listagem de desafios disponíveis
- Submissão de soluções com verificação automática
- Ranking com pontuação dos usuários
- Interface web com páginas de login, registro, desafios e ranking

## Estrutura do Projeto

plataforma_desafios-master/
├── backend/
│ ├── app/
│ │ ├── main.py # Ponto de entrada do FastAPI
│ │ ├── database.py # Conexão com o banco de dados
│ │ ├── crud.py # Operações de banco
│ │ ├── models.py # Modelos do SQLAlchemy
│ │ ├── schemas.py # Esquemas Pydantic
│ │ └── utils.py # Funções auxiliares
│ └── requirements.txt # Dependências do backend
├── frontend/
│ ├── *.html # Páginas da aplicação
│ ├── *.js # Scripts principais
│ └── style.css # Estilo geral
└── README.md