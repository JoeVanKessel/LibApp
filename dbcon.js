// JavaScript source code
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_dougherm',
    password: '1865',
    database: 'cs340_dougherm'
});
module.exports.pool = pool;
