const users=[];

// join user to chat
function join(id,username,room){
    // console.log("hhhhhhhhhhhhhhh");
    const user={id,username,room};
    // console.log('userrrrrrr',user);
    users.push(user);
    return user;
}



//get user by id
function getUser(id){
    // console.log({id});
    let x=users.filter(e=>e.id=id);
    // console.log({x});
    return users.filter(e=>e.id=id);
}

module.exports={
    join,
    getUser
}
