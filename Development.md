# Development notes

## Production

Use Dockerfile_prod and docker-compose-prod.yml:

```bash
docker build --build-arg host=localhost --build-arg is_secure=false --file Dockerfile_prod -t lettuce:prod .

host=localhost docker-compose --file docker-compose-prod.yml up
```
