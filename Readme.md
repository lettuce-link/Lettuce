# Lettuce

A (work in progress) beautiful and intuitive frontend for [Lemmy](https://join-lemmy.org/), an awesome open source federated discussion platform.

## Why "Lettuce"?

Lettuce was named after:

- The green stuff healthy people eat
- Lemmy → lemme (let me) → let us → Lettuce 😎
- [A cool band.](<https://en.wikipedia.org/wiki/Lettuce_(band)>) (don't sue me)

## Status

Currently I don't think I can get away with calling it anything more than a proof of concept.

I intend to keep working on it, but this is the side project of my side project, so don't hold your breath.

## Development setup

Install [node](https://github.com/nvm-sh/nvm) (v16) and [yarn](https://yarnpkg.com/getting-started/install) and [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/).

Clone the repo:

```bash
git clone https://github.com/rMazeiks/Lettuce.git
```

Build the development lettuce image (you only need to do this once):

```bash
cd Lettuce
docker build -t lettuce:dev .
```

Finally, start the Docker containers:

```
docker-compose up
```

This will locally start the database, Lemmy, the Lettuce frontend, and everything else needed for Lettuce to work. Open up http://localhost and the website should be there!

You might have to run `sudo chown -R 991:991 volumes/pictrs` to fix permissions for the pictrs volume.

If you'd like to contribute, please see [Contributing.md](./Contributing.md)
