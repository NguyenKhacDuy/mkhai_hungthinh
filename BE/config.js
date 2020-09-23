require('dotenv').config()

const username = process.env.USER_DB
const password = process.env.PW_DB
const database = process.env.DATABASE
const dbHost = process.env.HOST_DB
const node_env = process.env.NODE_ENV
const private_key = process.env.PRIVATE_KEY
const hostname = process.env.HOSTNAME
const port = process.env.PORT
const timezone = process.env.TIMEZONEDB
const current_timezone = process.env.CURRENT_TIMEZONE

const config = {
    dev: {
        db: {
            username,
            password, 
            database,
            host: dbHost,
            timezone: timezone
        },
        privateKey: private_key,
        hostname,
        port,
        current_timezone
    },
    test: {},
    prod: {}
}
module.exports = config[node_env]