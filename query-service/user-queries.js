var app = require('../app');
var connection = require('../database-config/db');
var query = {};


query.insertUser = function(user,callback,callbackError){
	var queryString = 'SELECT * FROM USER WHERE email = "'+user.email+'"';
	connection.query(queryString,function(err,rows){
		if(err){
			callbackError();
		}
		if(rows.length == 0){
			connection.query('INSERT INTO USER SET?', user,function(err,result){
				if(err){
					callbackError();
				} 
				callback(result);
			})
		}else{
			console.log('CANNOT ADD');
			callbackError();
		}
	})
	
};

query.getUserById = function(userId, callback){
	var queryString = 'SELECT * FROM USER WHERE id = "'+userId+'"';
	connection.query(queryString, function(err,result){
		if(err){
			callback(false);
		}else{
			callback(result);
		}
	})
}

query.getUser = function(user, callback){
	var queryString = 'SELECT * FROM USER WHERE email = "'+user.email+ '" AND password = "'+user.password+'"';
	connection.query(queryString, function(err,result){
		if(err) throw(err);
		callback(result);
	})
}

query.verifyFromToken = function(user, callback){
	var queryString = 'SELECT * FROM USER WHERE email = "'+user.useremail+ '" AND name = "'+user.username+'"';
	connection.query(queryString, function(err,result){
		if(err){
			callback(false);
		}else{
			callback(result);
		}
	})
}

query.getAll = function(id,callback){
	var queryString = 'SELECT id,name,email from USER WHERE id != '+id;
	connection.query(queryString, function(err,rows){
		if(err) throw(err);
		callback(rows);
	})
}


module.exports = query;