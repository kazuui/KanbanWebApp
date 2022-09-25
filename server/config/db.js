const mysql = require('mysql2');
require('dotenv/config');

const db = mysql.createPool({
  connectionLimit:10,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

module.exports = db;