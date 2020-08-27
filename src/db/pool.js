const {Pool} = require('pg')
const url = require('url')

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// })

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':')

const pool = new Pool({
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1]
})

module.exports = {pool}


