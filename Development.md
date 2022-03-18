# Development notes

## Production

Use Dockerfile_prod and docker-compose-prod.yml.

Test production setup locally:

```bash
docker build --build-arg host=localhost --build-arg is_secure=false --file Dockerfile_prod -t lettuce:prod .
```
