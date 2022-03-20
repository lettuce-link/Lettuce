# Deploying to Production

This section is mostly for my own reference, and for anyone that wants pointers on deploying Lettuce.

Create a configuration file `.env` file in the project's parent directory.

```bash
# build frontend (before every deploy)
docker build --build-arg host=lettuce.link --build-arg is_secure=true --file prod/Dockerfile -t lettuce:prod .

# start:
docker-compose --env-file ../.env --file prod/docker-compose.yml up -d

# stop:
docker-compose --env-file ../.env --file prod/docker-compose.yml down

# logs:
docker-compose --file prod/docker-compose.yml logs -f
```
