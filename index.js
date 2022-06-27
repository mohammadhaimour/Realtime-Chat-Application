'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formateMessage = require('./utils/message');
const {join,getUser}=require('./utils/users');
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
    socket.on('joinRoom', ({ username,room}) => {
        console.log(username,room);
        const user=join(socket.id,username,room);
        socket.join(user.room)
        // send welcome message when join chat
        socket.emit('message', formateMessage('LTUC BOT', 'welcome to LTUC chat'));
        //WHEN USER CONNECT
        socket.broadcast.to(user.room).emit('message', formateMessage('LTUC BOT', `${user.username} has joined chat`));
        // when user disconnect
    });

    socket.on('disconnect', () => {
        io.emit('message', formateMessage('LTUC BOT', 'a user has left the chat')); //this send to all users
    });

    // catch chatMessage from client
    socket.on('chatMessage', message => {
        const user=getUser(socket.id);
        console.log({user});
        io.to(user.room).emit(user.username, formateMessage('user', message));
    });
})
// console.log(PORT);
server.listen(PORT, () => {
    console.log(`server lestining on port ${PORT}`);
});