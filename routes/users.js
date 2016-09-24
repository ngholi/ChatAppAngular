var express = require('express');
var router = express.Router();
var jwtService = require('../jwt-service/jwt-service');
var userQueries = require('../query-service/user-queries');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var user = req.payload;

	userQueries.getAll(user.id,function(rows){
		return res.status(200).json({users: rows});
	})
});

module.exports = router;
