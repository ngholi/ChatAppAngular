/**
 * Created by Minh on 9/17/2016.
 */
var express = require('express');
var router = express.Router();
var roomQueries = require('../query-service/room-queries');
var jwtService = require('../jwt-service/jwt-service');
var path = require('path');
var fs = require('fs');


router.post('/create', function(req, res){
    var user = req.payload;
    if(!req.body.roomName){
        console.log('no room name');
        return res.status(400).json({message: 'Please fill room name'});
    }

    if(!req.body.owner || user.id != req.body.owner){
        return res.status(401).json({message: 'You are not authorized to create room'});
    }

    roomQueries.createRoom({name: req.body.roomName, owner: req.body.owner}, function(result, data){
        if(result){
            return res.status(200).json({roomId: data.insertId});
        }else{
            return res.status(400).json({message: data});
        }
    })
})

router.post('/join', function(req, res){
    var user = req.payload;
    var data = {
        room_id: req.body.roomId,
        user_id: req.payload.id

    }
    roomQueries.joinRoom(data, function(status, message){
        if(status){
            return res.status(200).json({message:message});
        }else{
            return res.status(400).json({message:message});
        }
    })
})

router.get('/all', function(req, res){
    var user = req.payload;
    roomQueries.getAllRooms(function(rooms){
        if(rooms){
            //var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
            var accessLogStream = fs.createWriteStream('log/access.log', {flags: 'a'});
            accessLogStream.write('log\n', function(){
               console.log('ok');
               accessLogStream.close();
            })
            return res.status(200).json({rooms: rooms});
        }else{
            if(rooms.length == 0)
                return res.status(200).json({message:'No rooms yet'});
            else
                return res.status(403).json({message: 'Connection error'});
        }
    })
});

router.get('/joinedrooms', function(req, res){
    var user = req.payload;
    roomQueries.getJoinedRooms(user.id, function(rooms){
        if(rooms){
            return res.status(200).json({rooms: rooms});
        }else{
            return res.status(403).json({message: 'Connection error'});
        }
    })
})

module.exports = router;