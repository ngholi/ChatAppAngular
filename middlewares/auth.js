var jwtService = require('../jwt-service/jwt-service');

module.exports = {
	verifyToken : function(req, res, next){
		jwtService.getPayload(req.headers.authorization, function(result){
	        if(result){
	        	req.payload = result;
	            next();

	        }else{
	            return res.status(401).json({message: 'Unauthorized'});
	        }
	    });
	}
}