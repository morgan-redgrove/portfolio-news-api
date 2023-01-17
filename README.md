# Northcoders News API

In order to access the PSQL databases using `connection.js` two `.env` files will need to be created in the root directory:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

<br>

Scripts have been written to setup both PSQL databases and seed the development database with data:
`setup-dbs`

```terminal
psql -f ./db/setup.sql
```

`seed`

```terminal
node ./db/seeds/run-seed.js
```

These can be ran in the terminal using the npm:
```terminal
$ npm run setup-dbs
$ npm run seed
```
