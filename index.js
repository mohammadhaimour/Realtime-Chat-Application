'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
// The path module provides utilities for working with file and directory paths.

const path = require('path');
// create node.js server with core 'http' module ====== */

const http = require('http');
const socketio = require('socket.io');
// require functions

const formateMessage = require('./utils/message');
const {
    join,
    getUser,
    userLeave,
    getRoom,
    getall
} = require('./utils/users');

// stert the app and connection with files 
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'client')));

// run when client connect
io.on('connection', socket => {
    // handle join from client with name of room and username
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        // add user info and room to the data
        const user = join(socket.id, username, room);
        socket.join(user.room);

        // send welcome message when join chat
        socket.emit('message', formateMessage('LTUC BOT', 'welcome to LTUC chat'));

        //WHEN USER CONNECT brodcast message to all users in the room
        socket.broadcast.to(user.room).emit('message', formateMessage('LTUC BOT', `${user.username} has joined chat`));

        // send users and room info
        io.to(user.room).emit('user-rooms-info', ({
            room: user.room,
            users: getRoom(user.room)
        }));
    });

    // catch chatMessage from client
    socket.on('chatMessage', message => {
        // get the user who have this socket id
        const user = getUser(socket.id);
        // emit the user info to the room with information and message
        io.to(user[0].room).emit('message', formateMessage(user[0].username, message));
    });

    //handle when client leave chat
    socket.on('disconnect', () => {
        // to know wich user leave by socket id
        const user = userLeave(socket.id);
        // check if there user
        if (user) {
            //this send to all users that user has leave
            io.to(user[0].room).emit('message', formateMessage('LTUC BOT', `${user[0].username} has left the chat`));

            // send users and room info to handle them in client
            io.to(user.room).emit('user-rooms-info', ({
                room: user[0].room,
                users: getRoom()
            }))
        }
    });

})
// console.log(PORT);
server.listen(PORT, () => {
    console.log(`server lestining on port ${PORT}`);
});