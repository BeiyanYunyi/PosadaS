#!/usr/bin/env bash
set -euo pipefail
# All state is disposable; no production secrets or network endpoints are used.
cleanup() {
  docker rm -f posadas-web posadas-db >/dev/null 2>&1 || true
  docker volume rm posadas-next >/dev/null 2>&1 || true
  docker network rm posadas-test >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker run --rm --entrypoint sh posadas:test -c \
  'test "$(id -u)" = 1000 && test ! -e .next/BUILD_ID && test -s "src/app/topic/[topicId]/MapleMono-NF-CN-Regular.ttf" && test -s licenses/maple-mono/LICENSE.txt'
if docker run --rm posadas:test start; then
  echo 'Uninitialized image unexpectedly started' >&2; exit 1
fi
if docker run --rm posadas:test init; then
  echo 'Initialization without configuration unexpectedly passed' >&2; exit 1
fi

docker network create posadas-test
docker volume create posadas-next
# Mimic Kubernetes fsGroup on a newly mounted emptyDir.
docker run --rm --user 0:0 -v posadas-next:/app/.next --entrypoint chown posadas:test 1000:1000 /app/.next
docker run -d --name posadas-db --network posadas-test \
  -e POSTGRES_PASSWORD=ci-only -e POSTGRES_DB=posadas postgres:18
for attempt in {1..60}; do
  if docker exec posadas-db pg_isready -U postgres -d posadas; then break; fi
  sleep 1
done
docker exec -i posadas-db psql -v ON_ERROR_STOP=1 -U postgres -d posadas < test/schema.sql
args=(--network posadas-test -v posadas-next:/app/.next
  -e 'DATABASE_URL=postgresql://postgres:ci-only@posadas-db:5432/posadas?schema=posadas'
  -e SERVE_URL=http://localhost:3000)
docker run --rm "${args[@]}" posadas:test init
# Reuse must work even when the database is unreachable; it must not build again.
docker run --rm -v posadas-next:/app/.next posadas:test init
docker run -d --name posadas-web -p 3000:3000 "${args[@]}" posadas:test start
for attempt in {1..60}; do
  if curl --fail --silent http://localhost:3000/ > /tmp/posadas-home.html; then break; fi
  sleep 1
done
curl --fail --silent http://localhost:3000/ > /dev/null
curl --fail --silent http://localhost:3000/sitemap.xml > /dev/null
docker stop --time 10 posadas-web
test "$(docker inspect -f '{{.State.ExitCode}}' posadas-web)" != 137
