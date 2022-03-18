# Development notes

## Production

```bash
docker build --build-arg host=lettuce.link --build-arg is_secure=true --file Dockerfile_prod -t lettuce:prod .

host=lettuce.link docker-compose --file docker-compose-prod.yml up
```
