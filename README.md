# Mendrek app

## Demo

View the app at https://mendrek.jennybelanger.com/

## Development setup

### Install requirements

* [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Setup the API

See [Mendrek API](https://github.com/jlbelanger/mendrek-api).

### Clone the app repo

``` bash
git clone https://github.com/jlbelanger/mendrek-app.git
cd mendrek-app
```

All other commands should be run in the `mendrek-app` folder.

### Configure environment settings

``` bash
cp .env.example .env
```

### Install dependencies

``` bash
yarn install
```

### Start the app

``` bash
yarn start
```

Your browser should automatically open http://localhost:3000/

## Deploying

### First-time setup

Locally, run:

``` bash
cp deploy-config.sh.example deploy-config.sh
cp .env.example .env.production
```

Set the variables in `deploy-config.sh` and `.env.production`.

### Subsequent deploys

``` bash
./deploy.sh
```

## Helpful development stuff

### Running tests

``` bash
yarn test
```
