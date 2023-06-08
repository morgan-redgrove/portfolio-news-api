# Northcoders News API <br> https://nc-news-xe9m.onrender.com/api

The NC-News API provides a collection of endpoints to access and interact with a database of news articles and user comments.
This project uses a postgreSQL database and the express framework; with both hosted on ElephantSQL and Render respectively.
A full list of endpoints is available at `/api`.

## :wrench: Installation and Setup

To clone this project please use the following command within your desired target directory:

```shell
$ git clone https://github.com/MorganRedgrove/portfolio-news-api.git
```

This project uses `npm` to manage it's dependencies which can be installed using:

```shell
$ npm install
```

(please see [dependencies](#dependencies) for a full list)

Scripts have been written to setup the testing a development databases and seed the development database with data:
`setup-dbs`

```shell
psql -f ./db/setup.sql
```

`seed`

```shell
node ./db/seeds/run-seed.js
```

These can be ran in the terminal using npm:

```shell
$ npm run setup-dbs
$ npm run seed
```

In order to access both databases using `connection.js` two `.env` files will need to be created in the root directory:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

## :test_tube: Testing

Unit and end-to-end testing for this project is handled using the Jest testing framework.
All required unit tests are collected into `utils.test.js`, whilst e-2-e tests can be found in `app.tests.js`.
These can be ran in the terminal using npm:

```shell
$ npm test utils.test
$ npm test app.test
```

## :lock: Security

All stored user passwords are encrypted with the blowfish cypher utilising `bcrypt.js` for utility functions and `pgcrypto` on the database. Caution however is advised when submitting a username and password, this API is intended for educational and demonstration purposes only.

## :clipboard: Dependencies

This project was built using Node `19.0.1` and npm `8.19.2`, it is recommended you run this project using these versions or higher.

Below is a list of dependencies and minimum version requirements for this project:

**_Production_**

| Package   | Version |
| --------- | ------- |
| dotenv    | 16.0.0  |
| express   | 4.18.2  |
| pg        | 8.7.3   |
| pg-format | 1.0.4   |
| bcryptjs  | 2.4.3   |

**_Development only_**

| Package       | Version |
| ------------- | ------- |
| husky         | 8.0.2   |
| jest          | 27.5.1  |
| jest-extended | 2.0.0   |
| jest-sorted   | 1.0.14  |
| supertest     | 6.3.3   |
