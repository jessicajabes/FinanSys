#!/usr/bin/env bash
set -euo pipefail

# Reinicia o serviço `server` via docker-compose e testa a rota /api/auth/bank/1 dentro do container.
# Uso: executar na raiz do projeto (onde está o docker-compose.yml), por exemplo via Git Bash ou WSL:
#   ./scripts/restart_and_test_server.sh

echo "Restarting docker-compose service: server"
docker-compose restart server

echo "Waiting 3 seconds for the container to come up..."
sleep 3

echo
echo "==> Testing inside container: GET /api/auth/bank/1"
# Executa curl dentro do container para evitar problemas de escaping do cliente
docker-compose exec -T server sh -c 'curl -i -X GET http://localhost:5000/api/auth/bank/1 || true'

echo
echo "==> Last 200 lines of server logs"
docker-compose logs --tail=200 server

echo
echo "Script finished. If you still see 404, try increasing the sleep time or check nodemon restarts in the logs."