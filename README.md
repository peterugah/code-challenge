## Description

My solution to RiskIdent's code challenge

Author - [Peter Ugah](https://www.linkedin.com/in/peter-ugah-8a009b104/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Configure Env Variables

```bash
the only env variable required is the PORT which is set to 3000 by default.
To change it, create an .env file on the root directory and set the port to a port of your choice.
```

## Sample requests

```bash
# production
GET http://localhost:3000/api/transactions?transactionId=5c868b22eb7069b50c6d2d32&confidenceLevel=1

# development
GET http://localhost:3000/api/transactions?transactionId=5c868b22eb7069b50c6d2d32&confidenceLevel=1
```

Email - [p.ugah.pu@gmail.com](mailto:p.ugah.pu@gmail.com)
