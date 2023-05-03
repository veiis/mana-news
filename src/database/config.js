require('dotenv').config({ path: `env/.${process.env.NODE_ENV}.env` })

module.exports = {
  "local": {
    "dialect": "postgres",
    "username": process.env.PG_USER,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DATABASE,
    "host": process.env.PG_HOST,
    "port": process.env.PG_PORT,
  },
  "development": {
    "dialect": "postgres",
    "username": process.env.PG_USER,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DATABASE,
    "host": process.env.PG_HOST,
    "port": process.env.PG_PORT,
  },
  "production": {
    "dialect": "postgres",
    "username": process.env.PG_USER,
    "password": process.env.PG_PASSWORD,
    "database": process.env.PG_DATABASE,
    "host": process.env.PG_HOST,
    "port": process.env.PG_PORT,
  }
}
