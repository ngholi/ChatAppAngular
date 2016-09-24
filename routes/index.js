var express = require('express');
var router = express.Router();
var userQueries = require('../query-service/user-queries');
var jwtService = require('../jwt-service/jwt-service');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');
var SECRET = config.SECRET;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.post('/register', function(req, res, next){
	
	if(!req.body.username||!req.body.email||!req.body.password){
		return res.status(400).json({message: 'Please fill all fields'});
	}

	var user = {
		'name': req.body.username,
		'email':req.body.email,
		'password':bcrypt.hashSync(req.body.password, SECRET)
	};
	
	userQueries.insertUser(user,
		function(result){
			user.id = result.insertId;

			return res.status(200).json({token: jwtService.generateJWT(user)});
		},function(){
			res.status(401).json({message: 'Email already exists'});
	})	
});

router.post('/login', function(req, res, next){
	if(!req.body.email || !req.body.password){
		return res.status(400).json({message: 'Please fill all fields'});
	}
	var user = {
		'email' : req.body.email,
		'password': bcrypt.hashSync(req.body.password, SECRET)
	}


	userQueries.getUser(user, function(rows){
		if(rows.length == 1){
			res.status(200).json({token: jwtService.generateJWT(rows[0])});
		}else{
			return res.status(401).json({message: 'Invalid credentials'});
		}		
	})
});


module.exports = router;
