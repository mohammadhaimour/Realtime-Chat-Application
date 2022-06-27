const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');

// get username and room name from url 
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);
const socket = io();
// chatroom joining whth room name and username
socket.emit('joinRoom',{username,room});
// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    //scroll every comming message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit messsge
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.message.value;
    // console.log({message});
    // emmit message to server
    socket.emit('chatMessage', message);
    //clear input after send
    e.target.message.value='' // focus means empty
 // focus means empty
});

// output message to client
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username}<span>  ${message.time}</span></p>
    <p class="text">
        ${message.text}.
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}