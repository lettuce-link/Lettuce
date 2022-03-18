# File based on
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# Install dependencies only when needed
FROM node:16-alpine AS deps

RUN apk add git
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
ENV PORT 3000

WORKDIR /app

CMD ["yarn", "dev"]