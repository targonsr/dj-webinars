# Deliveroo 🚚 🚛 📦

## development

    docker compose --profile dev up
    docker compose --profile dev up -d
    docker compose --profile dev up -d --build

    docker compose --profile dev down -v

and if you want the `--watch` mode (see develop / watch in `docker-compose.yaml`), run:

    docker compose --profile dev up --build --watch

URLs:
- [backend](http://localhost:3000)
- [frontend](http://localhost:4200)
- postgres
  - `docker compose exec postgres-app psql -U admin -d deliveroo`
- [pgadmin](http://localhost:5050)
  - `admin@example.com` / `adminpass` (see .env and secret/pgadmin)
  - after toggling servers: `strongpassword123`
- [grafana](http://localhost:4000)
  - `admin` / `secret` (see .env and secret/grafana)
- [redis insight (admin UI)](http://localhost:5540)

## production

    export NODE_ENV=production
    export FRONTEND_URL=https://yourdomain.com
    docker compose --profile prod up --build -d

