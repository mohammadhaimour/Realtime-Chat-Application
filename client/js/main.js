const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName=document.getElementById('room-name');
const usersNames=document.getElementById('users')
// get username and room name from url 
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);
const socket = io();
// get room and users
socket.on('user-rooms-info',({room,users})=>{
    // console.log({room});
    // let x=users.username
    // console.log(x);
    outputRoom(room);
    outputUsers(users);
})
// chatroom joining whth room name and username
socket.emit('joinRoom',{username,room});
// message from server
socket.on('message', message => {
    // console.log("ratacke from server and handle from index",message);
    // console.log(message);
    outputMessage(message);
    //scroll every comming message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit messsge
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.message.value;
    // console.log('sent from index',message);
    // emmit message to server
    socket.emit('chatMessage', message);
    //clear input after send
    e.target.message.value='' // focus means empty
 // focus means empty
});

// output message to client
function outputMessage(message) {
    // console.log("gggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
    // console.log({message});
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username}<span>  ${message.time}</span></p>
    <p class="text">
        ${message.text}.
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
// output room name to client
function outputRoom(room){
    roomName.innerText=room;
}
// output users to client
function outputUsers(users){
    console.log({users});
    usersNames.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`
}