'use strict';

const knex = require('knex')

const dotenv = require('dotenv');
dotenv.config();

const dbConn = new knex({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST?process.env.MYSQL_HOST:'localhost',
        port: process.env.MYSQL_PORT?process.env.MYSQL_PORT:3306,
        user: process.env.MYSQL_USER?process.env.MYSQL_USER:'root',
        password: process.env.MYSQL_PASSWORD?process.env.MYSQL_PASSWORD:'',
        database: process.env.MYSQL_DATABASE?process.env.MYSQL_DATABASE:'loan_db'
    }
});

module.exports = dbConn;

