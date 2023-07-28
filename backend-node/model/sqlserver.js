const mysql = require('mysql2');

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "webserver"
})

db.getConnection( (err, connection)=> {   if (err) throw (err)
  console.log ("DB connected successful: " + connection.threadId)})

module.exports = db;

/* 
sudo systemctl start mysqld
systemctl status mysqld( pra ver se ligou mesmo )
mysql -u root -p
*/
