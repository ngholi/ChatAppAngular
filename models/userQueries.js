var app = require('../app');
var connection = require('../databaseConnection/db');
var query = {};


query.insertUser = function(user,callback,callbackError){
	connection.query('SELECT * FROM USER WHERE email = "'+user.email+'"',function(err,rows){
		if(rows.length == 0){
			connection.query('INSERT INTO USER SET?', user,function(err,result){
				if(err){
					console.log("ERROR HERE");
					throw(err);
				} 
				callback(result);
			})
		}else{
			console.log('CANNOT ADD');
			callbackError();
		}
	})
	
};

query.getUser = function(user, callback){
	connection.query('SELECT * FROM USER WHERE email = "'+user.email+ '" AND password = "'+user.password+'"', function(err,result){
		if(err) throw(err);
		callback(result);
	})
}

query.getAll = function(id,callback){
	connection.query('SELECT id,name,email from USER WHERE id != '+id, function(err,rows){
		if(err) throw(err);
		callback(rows);
	})
}


module.exports = query;