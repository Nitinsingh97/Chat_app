var Hapi =require ('hapi')
var server = new Hapi.Server({port : 3000});
var inert =require('inert')
var io =require('socket.io')(server.listener);
connections=[];
users=[];
const provision = async () => {

    await server.register(inert);

    
    server.route({
        method: 'GET',
        path :'/',
        handler: (request,h)=>{
                return h.file('/home/vvdn/Desktop/app/views/index.html');
         }
    });



const init = async () => {
 
      await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

}
provision();


io.sockets.on('connection',(socket)=>{
    connections.push(socket);
    console.log("Connected :  %s socket connected",connections.length);
    // socket.emit('news',{hello : 'world'});
    // socket.on('something',(data)=>{
    //     console.log(data);
    // })
  socket.on('disconnect',()=>{
      users.splice(users.indexOf(socket.username),1);
       updateUsernames();

    connections.splice(connections.indexOf(socket),1)   
    console.log("Disconnected :  %s socket connected",connections.length);
  })  

  socket.on("send message",(data)=>{
      //console.log(data);
      io.sockets.emit('new message',{msg : data})
  })
  socket.on("new user",(data)=>{
   // console.log(data);
    socket.username=data;
    users.push(socket.username);
    updateUsernames();
    console.log(data);
});
   function updateUsernames(){
       io.sockets.emit('get users', users);
       console.log(users);
   }
})