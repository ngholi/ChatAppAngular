var timestamp = require('unix-timestamp');
var fs = require('fs');
var path = require('path');

module.exports = {
	writeLog : function(req, res, next){
		var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
		accessLogStream.write('xxx\n', function(){
			next();
		})
	}
}