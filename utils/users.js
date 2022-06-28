const users=[];

// join user to chat
function join(id,username,room){
    // console.log("hhhhhhhhhhhhhhh");
    const user={id,username,room};
    // console.log('userrrrrrr',user);
    users.push(user);
    // console.log(user);
    return user;
}

function getall(){
  return users;
}

//get user by id
function getUser(id){
    console.log({id});
    let x=users.filter(element=>element.id===id);
    console.log({x});
    return users.filter(e=>e.id===id);
}
console.log('main users',{users});
// get user leave
function userLeave(id){
  //  find the index of that id
  const index=users.findIndex(e=>e.id===id);
  // check for that index
  if(index !==-1){
    // now remove that user from data
    return users.splice(index,1)
  }
}

//get user room
function getRoom(room){
    return users.filter(e=>e.room===room);
}

module.exports={
    join,
    getUser,
    userLeave,
    getRoom,
    getall
}
