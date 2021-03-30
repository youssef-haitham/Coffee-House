var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  database: "meetinDB",
  user: "root",
  password: "root",
  port: "3306"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
