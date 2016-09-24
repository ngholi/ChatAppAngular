/**
 * Created by Minh on 9/17/2016.
 */
var connection = require('../database-config/db');
var query = {};

query.createRoom = function(room, callback){
    connection.query('SELECT * FROM ROOM WHERE name = "'+ room.name + '"',function(err,rows){
        if(err){
            callback(false, 'Invalid input');
        }
        if(rows.length == 0){
            connection.query('INSERT INTO ROOM SET?', room, function(err, data){
                if(err){
                    callback(false, 'Cannot create room');
                }else{
                    var room_user = {
                        room_id: data.insertId,
                        user_id: room.owner
                    }

                    connection.query('INSERT INTO ROOM_USER SET?', room_user, function(err, room_user_data){
                        if(err){
                            callback(false, 'Cannot create room');
                        }else{
                            callback(true, data);
                        }
                    })
                }

            })
        }else{
            callback(false, 'Room name already exists');
        }
    })
};

query.joinRoom = function(data, callback){
    var queryString = 'SELECT * FROM room_user \
                    WHERE room_id = "'+data.room_id+'"'+ 'AND user_id="'+data.user_id+'"';
    connection.query(queryString, function(err,rows){
        if(err)
            callback(false,'Connection error');
        else{
            if(rows.length == 1){
                callback(false,'You already joined this');
            }else{
                connection.query ('INSERT INTO room_user SET?',data,function(err,result){
                    if(err){
                        callback(false,'Connection error');
                    }
                    else{
                        callback(true,'Join room sucessfully');
                    }
                })
            }
            
        }
    })
}

query.getAllRooms = function(callback){
    var queryString = "SELECT r.id, r.name, r.owner, u.name as ownerName \
                    FROM room r inner join user u \
                    ON u.id = r.owner";
    connection.query(queryString, function(err, rows){
        if(err){
            callback(false);
        }else{
            callback(rows);
        }
    })
}

query.getJoinedRooms = function(userId, callback){
    var queryString = 'SELECT r.id, r.name, u.name as ownerName \
                    FROM room r join room_user ru ON r.id = ru.room_id \
                    join user u ON u.id = r.owner \
                    WHERE ru.user_id ="' + userId + '"';
    connection.query(queryString, function(err, rows){
        if(err){
            callback(false);
        }else{
            callback(rows);
        }
    })
};
module.exports = query;