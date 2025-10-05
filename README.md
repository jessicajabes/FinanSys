Projeto FinanSys: backend Node.js (Express) + frontend React (Vite) + PostgreSQL. Este README descreve como rodar o ambiente de desenvolvimento com docker-compose e resolver os problemas mais comuns.

Pré-requisitos

- Docker Desktop instalado e em execução
- Docker Compose compatível (v1 ou v2 via docker-compose)
- Node/NPM (apenas para desenvolvimento local opcionalmente)

Variáveis de ambiente

- Copie `.env.example` para `.env` e ajuste conforme necessário.
- As variáveis principais:
  - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT
  - SERVER_PORT, CLIENT_PORT
  - VITE_API_BASE_URL, VITE_APP_NAME, VITE_APP_VERSION

Rodando em desenvolvimento (Docker)

1) Subir todos os serviços (com rebuild):
cd FinanSys
docker-compose up --build


2) Subir apenas o client (reconstruir):
docker-compose up --build -d client


3) Parar e remover containers/rede:
docker-compose down


Comandos úteis
docker-compose logs -f client
docker container ps
docker volume ls
docker volume rm <nome_do_volume>

