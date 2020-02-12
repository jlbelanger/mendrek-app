# Mendrek app

## Demo

View the app at https://mendrek.jennybelanger.com/

## Development setup

### Install requirements

* [npm](https://www.npmjs.com/get-npm)

### Setup the API

See [Mendrek API](https://github.com/jlbelanger/mendrek-api).

### Clone the app repo

```
git clone https://github.com/jlbelanger/mendrek-app.git
cd mendrek-app
```

All other commands should be run in the `mendrek-app` folder.

### Configure environment settings

```
cp .env.example .env
```

### Install dependencies

```
npm install
```

### Start the app

```
npm start
```

Your browser should automatically open http://localhost:3000/

## Deploying

### First-time setup

Locally, run:

```
cp deploy-config.sh.example deploy-config.sh
cp .env.example .env.production
```

Set the variables in `deploy-config.sh` and `.env.production`.

### Subsequent deploys

```
./deploy.sh
```

## Helpful development stuff

### Running tests

```
npm test
```
