'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formateMessage = require('./utils/message');
const {
    join,
    getUser,
    userLeave,
    getRoom,
    getall
} = require('./utils/users');
// console.log({join});
// set static folder
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'client')));
// run when client connect
io.on('connection', socket => {
    // console.log("doooooo");
    // handle join from client with name of room and username
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        // console.log(username, room);
        const user = join(socket.id, username, room);
        socket.join(user.room)
        // send welcome message when join chat
        console.log('allllllllllllllllll',getall());
        socket.emit('message', formateMessage('LTUC BOT', 'welcome to LTUC chat'));
        //WHEN USER CONNECT
        socket.broadcast.to(user.room).emit('message', formateMessage('LTUC BOT', `${user.username} has joined chat`));
        // send users and room info
        // let x=user.room;
        // console.log('sssssssss',{x});
        // let xx=getRoom(user.room);
        // console.log({xx});
        io.to(user.room).emit('user-rooms-info', ({
            room: user.room,
            users: getRoom(user.room)
        }))
    });
    //handle when client leave chat
    socket.on('disconnect', () => {
        // to know wich user leave
        const user = userLeave(socket.id);
        // console.log({
        //     user
        // });
        // check if there user
        if (user) {
            //this send to all users
            io.to(user[0].room).emit('message', formateMessage('LTUC BOT', `${user[0].username} has left the chat`));
            // send users and room info
            io.to(user.room).emit('user-rooms-info', ({
                room: user[0].room,
                users: getRoom()
            }))
        }
    });
    // catch chatMessage from client
    socket.on('chatMessage', message => {
        // console.log('sent from index and handle from server', message);
        console.log(socket.id);
        const user = getUser(socket.id);
        // console.log('aaaaaaaaaaaaaaaaaaaaa',user);
        let x=user[0].username;
        // console.log({x});
        io.to(user[0].room).emit('message', formateMessage(user[0].username, message));
    });
})
// console.log(PORT);
server.listen(PORT, () => {
    console.log(`server lestining on port ${PORT}`);
});