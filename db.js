const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'responseapp'
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Terhubung dengan database MySQL');
});

module.exports = connection;
