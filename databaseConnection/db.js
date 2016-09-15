/*requiring mysql node modules */
var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mychatapp'
});

connection.connect(function(err){
	  if(!err) {
	      console.log("Database is connected"); 
	      console.log('connected as id ' + connection.threadId);   
	  } else {
	      console.log("Error connecting database");    
	  }
	});

module.exports = connection;
